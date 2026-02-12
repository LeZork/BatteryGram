import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  SliderField,
  TextField,
  staticClasses,
} from '@decky/ui';
import {
  FaBatteryHalf,
  FaPlay,
  FaStop,
  FaSave,
  FaVial,
} from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import { definePlugin, call, toaster } from '@decky/api';

const POLL_INTERVAL_MS = 5000;
const THRESHOLD_MIN = 5;
const THRESHOLD_MAX = 50;

interface BatteryStatusResponse {
  level: number | null;
  charging: boolean;
  monitoring: boolean;
  error?: string;
}

interface ConfigResponse {
  chat_id: string;
  threshold: number;
  language?: string;
}

// Русские тексты
const texts = {
  batteryStatus: 'Статус батареи',
  telegramSettings: 'Настройки Telegram',
  controls: 'Управление',
  monitoring: 'Мониторинг',
  charging: 'Зарядка',
  discharging: 'Разрядка',
  chatId: 'ID чата Telegram',
  chatIdHintFrom: 'Узнайте ваш ID у',
  chatIdKeyboardHint: ' или отправьте /id боту',
  lowBatteryThreshold: 'Порог низкого заряда',
  notifyWhen: 'Уведомить при',
  configSaved: 'Настройки сохранены',
  configSaveFailed: 'Не удалось сохранить настройки',
  configError: 'Ошибка сохранения',
  monitoringStarted: 'Мониторинг запущен',
  monitoringStopped: 'Мониторинг остановлен',
  operationFailed: 'Операция не удалась',
  testSent: 'Тестовое сообщение отправлено! Проверьте Telegram',
  testFailed: 'Ошибка отправки теста',
  settingsFile: 'Файл настроек:',
  save: 'Сохранить',
  start: 'Запустить',
  stop: 'Остановить',
  test: 'Тест',
};

function BatteryTelegramPanel() {
  const [chatId, setChatId] = useState('');
  const [threshold, setThreshold] = useState(20);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [settingsPath, setSettingsPath] = useState<string>('');

  const fetchBatteryStatus = useCallback(async () => {
    try {
      const result = await call<[], BatteryStatusResponse>('get_battery_status');
      if (result && typeof result === 'object') {
        setBatteryLevel(result.level ?? null);
        setIsCharging(Boolean(result.charging));
        setIsMonitoring(Boolean(result.monitoring));
      }
    } catch (e) {
      console.error('BatteryGram: fetch status failed', e);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [cfg, path] = await Promise.all([
          call<[], ConfigResponse>('get_config'),
          call<[], string>('get_settings_path').catch(() => ''),
        ]);
        if (!cancelled && path) setSettingsPath(path);
        fetchBatteryStatus();
        if (cancelled || !cfg) return;
        if (typeof cfg === 'object') {
          setChatId(String(cfg.chat_id ?? ''));
          setThreshold(Math.max(THRESHOLD_MIN, Math.min(THRESHOLD_MAX, Number(cfg.threshold) ?? 20)));
        }
      } catch (e) {
        console.error('BatteryGram: load config failed', e);
      } finally {
        if (!cancelled) setConfigLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchBatteryStatus]);

  useEffect(() => {
    if (!configLoaded) return;
    const interval = setInterval(fetchBatteryStatus, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [configLoaded, fetchBatteryStatus]);

  const hasCredentials = chatId.trim().length > 0;

  const saveConfig = async () => {
    setIsLoading(true);
    try {
      let success = false;
      try {
        success = await call<[{ chat_id: string; threshold: number; language: string }], boolean>(
          'save_config',
          { chat_id: chatId.trim(), threshold, language: 'ru' }
        );
      } catch (_) {
        success = await call<[string, number, string], boolean>(
          'save_config',
          chatId.trim(),
          threshold,
          'ru'
        );
      }
      if (success) {
        toaster.toast({ title: 'BatteryGram', body: texts.configSaved });
        const path = await call<[], string>('get_settings_path').catch(() => '');
        if (path) setSettingsPath(path);
      } else {
        toaster.toast({ title: 'BatteryGram', body: texts.configSaveFailed, critical: true });
      }
    } catch (e) {
      toaster.toast({ title: 'BatteryGram', body: texts.configError, critical: true });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMonitoring = async () => {
    setIsLoading(true);
    try {
      const method = isMonitoring ? 'stop_monitoring' : 'start_monitoring';
      const success = await call<[], boolean>(method);
      if (success) {
        setIsMonitoring(!isMonitoring);
        toaster.toast({
          title: 'BatteryGram',
          body: isMonitoring ? texts.monitoringStopped : texts.monitoringStarted,
        });
        fetchBatteryStatus();
      } else {
        toaster.toast({ title: 'BatteryGram', body: texts.operationFailed, critical: true });
      }
    } catch (e) {
      toaster.toast({ title: 'BatteryGram', body: texts.operationFailed, critical: true });
    } finally {
      setIsLoading(false);
    }
  };

  const testTelegram = async () => {
    setIsLoading(true);
    try {
      const success = await call<[], boolean>('test_telegram');
      if (success) {
        toaster.toast({ title: 'BatteryGram', body: texts.testSent });
      } else {
        toaster.toast({ title: 'BatteryGram', body: texts.testFailed, critical: true });
      }
    } catch (e) {
      toaster.toast({ title: 'BatteryGram', body: texts.testFailed, critical: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PanelSection title={texts.batteryStatus}>
        <PanelSectionRow>
          <div
            style={{
              background: '#1a1a1a',
              padding: '15px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaBatteryHalf
                size={24}
                color={
                  batteryLevel !== null && batteryLevel < threshold ? '#ff4444' : '#44ff44'
                }
              />
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {batteryLevel !== null ? `${batteryLevel}%` : '--%'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {isMonitoring && (
                <span style={{ color: '#44ff44', fontSize: '12px' }}>● {texts.monitoring}</span>
              )}
              <span style={{ color: isCharging ? '#44ff44' : '#888' }}>
                {isCharging ? `⚡ ${texts.charging}` : `🔋 ${texts.discharging}`}
              </span>
            </div>
          </div>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={texts.telegramSettings}>
        <div style={{ padding: '0 0 10px 0' }}>
          <PanelSectionRow>
            <TextField
              label={texts.chatId}
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              description={
                <>
                  {texts.chatIdHintFrom}{' '}
                  <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" style={{ color: '#26A5E4' }}>@userinfobot</a>
                  {texts.chatIdKeyboardHint}
                </>
              }
              mustBeNumeric
            />
          </PanelSectionRow>

          <PanelSectionRow>
            <SliderField
              label={texts.lowBatteryThreshold}
              value={threshold}
              min={THRESHOLD_MIN}
              max={THRESHOLD_MAX}
              step={5}
              onChange={(v: number) => setThreshold(v)}
              description={`${texts.notifyWhen} ${threshold}%`}
              showValue
            />
          </PanelSectionRow>
        </div>
      </PanelSection>

      <PanelSection title={texts.controls}>
        <PanelSectionRow>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <ButtonItem layout="inline" onClick={saveConfig} disabled={isLoading}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaSave />
                {texts.save}
              </span>
            </ButtonItem>
            <ButtonItem
              layout="inline"
              onClick={toggleMonitoring}
              disabled={isLoading || !hasCredentials}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isMonitoring ? <FaStop /> : <FaPlay />}
                {isMonitoring ? texts.stop : texts.start}
              </span>
            </ButtonItem>
            <ButtonItem
              layout="inline"
              onClick={testTelegram}
              disabled={isLoading || !hasCredentials}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaVial />
                {texts.test}
              </span>
            </ButtonItem>
          </div>
        </PanelSectionRow>
      </PanelSection>

      {settingsPath && (
        <PanelSection>
          <PanelSectionRow>
            <div style={{ fontSize: '11px', color: '#666', wordBreak: 'break-all' }}>
              {texts.settingsFile} {settingsPath}
            </div>
          </PanelSectionRow>
        </PanelSection>
      )}
    </div>
  );
}

export default definePlugin(() => ({
  name: 'BatteryGram',
  icon: <FaBatteryHalf />,
  titleView: <div className={staticClasses.Title}>BatteryGram</div>,
  content: <BatteryTelegramPanel />,
  onDismount() {
    // cleanup if needed
  },
}));