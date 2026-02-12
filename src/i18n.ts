export type Lang = 'en' | 'ru';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    batteryStatus: 'Battery Status',
    monitoring: 'Monitoring',
    charging: 'Charging',
    discharging: 'Discharging',
    telegramSettings: 'Telegram Settings',
    chatId: 'Chat ID',
    chatIdHintFrom: 'From',
    chatIdKeyboardHint: ' (Steam+X to open keyboard)',
    lowBatteryThreshold: 'Low battery threshold',
    notifyWhen: 'Notify when battery ≤',
    controls: 'Controls',
    save: 'Save',
    start: 'Start',
    stop: 'Stop',
    test: 'Test',
    language: 'Language',
    configSaved: 'Configuration saved.',
    configSaveFailed: 'Failed to save config.',
    configError: 'Error saving config.',
    monitoringStarted: 'Monitoring started.',
    monitoringStopped: 'Monitoring stopped.',
    operationFailed: 'Operation failed.',
    testSent: 'Test message sent!',
    testFailed: 'Telegram test failed.',
  },
  ru: {
    batteryStatus: 'Батарея',
    monitoring: 'Мониторинг',
    charging: 'Заряжается',
    discharging: 'Разряжается',
    telegramSettings: 'Настройки Telegram',
    chatId: 'Chat ID',
    chatIdHintFrom: 'Узнать у',
    chatIdKeyboardHint: ' (Steam+X — клавиатура)',
    lowBatteryThreshold: 'Порог низкого заряда',
    notifyWhen: 'Уведомлять при заряде ≤',
    controls: 'Управление',
    save: 'Сохранить',
    start: 'Старт',
    stop: 'Стоп',
    test: 'Тест',
    language: 'Язык',
    configSaved: 'Настройки сохранены.',
    configSaveFailed: 'Не удалось сохранить настройки.',
    configError: 'Ошибка сохранения.',
    monitoringStarted: 'Мониторинг запущен.',
    monitoringStopped: 'Мониторинг остановлен.',
    operationFailed: 'Ошибка операции.',
    testSent: 'Тестовое сообщение отправлено!',
    testFailed: 'Ошибка отправки в Telegram.',
  },
};

export const langLabels: Record<Lang, string> = {
  en: 'English',
  ru: 'Русский',
};

export const langOptions: { data: Lang; label: string }[] = [
  { data: 'en', label: langLabels.en },
  { data: 'ru', label: langLabels.ru },
];

export function t(lang: Lang, key: keyof typeof translations.en): string {
  const map = translations[lang];
  return (map && map[key]) || translations.en[key] || key;
}
