var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaTelegram (props) {
  return GenIcon({"attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"},"child":[]}]})(props);
}function FaBatteryHalf (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M544 160v64h32v64h-32v64H64V160h480m16-64H48c-26.51 0-48 21.49-48 48v224c0 26.51 21.49 48 48 48h512c26.51 0 48-21.49 48-48v-16h8c13.255 0 24-10.745 24-24V184c0-13.255-10.745-24-24-24h-8v-16c0-26.51-21.49-48-48-48zm-240 96H96v128h224V192z"},"child":[]}]})(props);
}function FaPlay (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"},"child":[]}]})(props);
}function FaSave (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"},"child":[]}]})(props);
}function FaStop (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"},"child":[]}]})(props);
}function FaVial (props) {
  return GenIcon({"attr":{"viewBox":"0 0 480 512"},"child":[{"tag":"path","attr":{"d":"M477.7 186.1L309.5 18.3c-3.1-3.1-8.2-3.1-11.3 0l-34 33.9c-3.1 3.1-3.1 8.2 0 11.3l11.2 11.1L33 316.5c-38.8 38.7-45.1 102-9.4 143.5 20.6 24 49.5 36 78.4 35.9 26.4 0 52.8-10 72.9-30.1l246.3-245.7 11.2 11.1c3.1 3.1 8.2 3.1 11.3 0l34-33.9c3.1-3 3.1-8.1 0-11.2zM318 256H161l148-147.7 78.5 78.3L318 256z"},"child":[]}]})(props);
}

const manifest = {"name":"BatteryGram"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const call = api.call;
const toaster = api.toaster;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

const POLL_INTERVAL_MS = 5000;
const THRESHOLD_MIN = 5;
const THRESHOLD_MAX = 50;
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
    contact: 'Связь с разработчиком',
};
function BatteryTelegramPanel() {
    const [chatId, setChatId] = SP_REACT.useState('');
    const [threshold, setThreshold] = SP_REACT.useState(20);
    const [isMonitoring, setIsMonitoring] = SP_REACT.useState(false);
    const [batteryLevel, setBatteryLevel] = SP_REACT.useState(null);
    const [isCharging, setIsCharging] = SP_REACT.useState(false);
    const [isLoading, setIsLoading] = SP_REACT.useState(false);
    const [configLoaded, setConfigLoaded] = SP_REACT.useState(false);
    const [settingsPath, setSettingsPath] = SP_REACT.useState('');
    const fetchBatteryStatus = SP_REACT.useCallback(async () => {
        try {
            const result = await call('get_battery_status');
            if (result && typeof result === 'object') {
                setBatteryLevel(result.level ?? null);
                setIsCharging(Boolean(result.charging));
                setIsMonitoring(Boolean(result.monitoring));
            }
        }
        catch (e) {
            console.error('BatteryGram: fetch status failed', e);
        }
    }, []);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [cfg, path] = await Promise.all([
                    call('get_config'),
                    call('get_settings_path').catch(() => ''),
                ]);
                if (!cancelled && path)
                    setSettingsPath(path);
                fetchBatteryStatus();
                if (cancelled || !cfg)
                    return;
                if (typeof cfg === 'object') {
                    setChatId(String(cfg.chat_id ?? ''));
                    setThreshold(Math.max(THRESHOLD_MIN, Math.min(THRESHOLD_MAX, Number(cfg.threshold) ?? 20)));
                    setIsMonitoring(Boolean(cfg.monitoring));
                }
            }
            catch (e) {
                console.error('BatteryGram: load config failed', e);
            }
            finally {
                if (!cancelled)
                    setConfigLoaded(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [fetchBatteryStatus]);
    SP_REACT.useEffect(() => {
        if (!configLoaded)
            return;
        const interval = setInterval(fetchBatteryStatus, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [configLoaded, fetchBatteryStatus]);
    const hasCredentials = chatId.trim().length > 0;
    const saveConfig = async () => {
        setIsLoading(true);
        try {
            let success = false;
            try {
                success = await call('save_config', { chat_id: chatId.trim(), threshold, language: 'ru', monitoring: isMonitoring });
            }
            catch (_) {
                success = await call('save_config', chatId.trim(), threshold, 'ru');
            }
            if (success) {
                toaster.toast({ title: 'BatteryGram', body: texts.configSaved });
                const path = await call('get_settings_path').catch(() => '');
                if (path)
                    setSettingsPath(path);
            }
            else {
                toaster.toast({ title: 'BatteryGram', body: texts.configSaveFailed, critical: true });
            }
        }
        catch (e) {
            toaster.toast({ title: 'BatteryGram', body: texts.configError, critical: true });
        }
        finally {
            setIsLoading(false);
        }
    };
    const toggleMonitoring = async () => {
        setIsLoading(true);
        try {
            const method = isMonitoring ? 'stop_monitoring' : 'start_monitoring';
            const success = await call(method);
            if (success) {
                setIsMonitoring(!isMonitoring);
                toaster.toast({
                    title: 'BatteryGram',
                    body: isMonitoring ? texts.monitoringStopped : texts.monitoringStarted,
                });
                fetchBatteryStatus();
            }
            else {
                toaster.toast({ title: 'BatteryGram', body: texts.operationFailed, critical: true });
            }
        }
        catch (e) {
            toaster.toast({ title: 'BatteryGram', body: texts.operationFailed, critical: true });
        }
        finally {
            setIsLoading(false);
        }
    };
    const testTelegram = async () => {
        setIsLoading(true);
        try {
            const success = await call('test_telegram');
            if (success) {
                toaster.toast({ title: 'BatteryGram', body: texts.testSent });
            }
            else {
                toaster.toast({ title: 'BatteryGram', body: texts.testFailed, critical: true });
            }
        }
        catch (e) {
            toaster.toast({ title: 'BatteryGram', body: texts.testFailed, critical: true });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (SP_JSX.jsxs("div", { style: { padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px' }, children: [SP_JSX.jsx(DFL.PanelSection, { title: texts.batteryStatus, children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: {
                            background: '#1a1a1a',
                            padding: '15px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }, children: [SP_JSX.jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [SP_JSX.jsx(FaBatteryHalf, { size: 24, color: batteryLevel !== null && batteryLevel < threshold ? '#ff4444' : '#44ff44' }), SP_JSX.jsx("span", { style: { fontSize: '24px', fontWeight: 'bold' }, children: batteryLevel !== null ? `${batteryLevel}%` : '--%' })] }), SP_JSX.jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }, children: [isMonitoring && (SP_JSX.jsxs("span", { style: { color: '#44ff44', fontSize: '12px' }, children: ["\u25CF ", texts.monitoring] })), SP_JSX.jsx("span", { style: { color: isCharging ? '#44ff44' : '#888' }, children: isCharging ? `⚡ ${texts.charging}` : `🔋 ${texts.discharging}` })] })] }) }) }), SP_JSX.jsx(DFL.PanelSection, { title: texts.telegramSettings, children: SP_JSX.jsxs("div", { style: { padding: '0 0 10px 0' }, children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: texts.chatId, value: chatId, onChange: (e) => setChatId(e.target.value), description: SP_JSX.jsxs(SP_JSX.Fragment, { children: [texts.chatIdHintFrom, ' ', SP_JSX.jsx("a", { href: "https://t.me/userinfobot", target: "_blank", rel: "noopener noreferrer", style: { color: '#26A5E4' }, children: "@userinfobot" }), texts.chatIdKeyboardHint] }), mustBeNumeric: true }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.SliderField, { label: texts.lowBatteryThreshold, value: threshold, min: THRESHOLD_MIN, max: THRESHOLD_MAX, step: 5, onChange: (v) => setThreshold(v), description: `${texts.notifyWhen} ${threshold}%`, showValue: true }) })] }) }), SP_JSX.jsx(DFL.PanelSection, { title: texts.controls, children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' }, children: [SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: saveConfig, disabled: isLoading, children: SP_JSX.jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [SP_JSX.jsx(FaSave, {}), texts.save] }) }), SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: toggleMonitoring, disabled: isLoading || !hasCredentials, children: SP_JSX.jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [isMonitoring ? SP_JSX.jsx(FaStop, {}) : SP_JSX.jsx(FaPlay, {}), isMonitoring ? texts.stop : texts.start] }) }), SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: testTelegram, disabled: isLoading || !hasCredentials, children: SP_JSX.jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [SP_JSX.jsx(FaVial, {}), texts.test] }) })] }) }) }), SP_JSX.jsxs("div", { style: {
                    marginTop: '20px',
                    padding: '15px',
                    background: 'rgba(38, 165, 228, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(38, 165, 228, 0.3)',
                    textAlign: 'center'
                }, children: [SP_JSX.jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }, children: [SP_JSX.jsx(FaTelegram, { size: 20, color: "#26A5E4" }), SP_JSX.jsx("span", { style: { fontWeight: 'bold', color: '#26A5E4' }, children: texts.contact })] }), SP_JSX.jsx("a", { href: "https://t.me/sadzorax", target: "_blank", rel: "noopener noreferrer", style: {
                            display: 'inline-block',
                            padding: '8px 16px',
                            background: '#26A5E4',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            transition: 'opacity 0.2s'
                        }, onMouseEnter: (e) => e.currentTarget.style.opacity = '0.8', onMouseLeave: (e) => e.currentTarget.style.opacity = '1', children: "@sadzorax" }), SP_JSX.jsx("div", { style: { fontSize: '11px', color: '#888', marginTop: '8px' }, children: "\u041F\u043E \u0432\u043E\u043F\u0440\u043E\u0441\u0430\u043C \u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u043C" })] }), settingsPath && (SP_JSX.jsx(DFL.PanelSection, { children: SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { fontSize: '11px', color: '#666', wordBreak: 'break-all' }, children: [texts.settingsFile, " ", settingsPath] }) }) }))] }));
}
var index = definePlugin(() => ({
    name: 'BatteryGram',
    icon: SP_JSX.jsx(FaBatteryHalf, {}),
    titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "BatteryGram" }),
    content: SP_JSX.jsx(BatteryTelegramPanel, {}),
    onDismount() {
        // cleanup if needed
    },
}));

export { index as default };
//# sourceMappingURL=index.js.map
