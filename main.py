import json
import os
import sys
from typing import Any, Optional

# Добавляем пути для импорта
plugin_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(plugin_dir, "backend")
py_modules_path = os.path.join(plugin_dir, "py_modules")

for path in [backend_dir, py_modules_path]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Теперь импортируем
import decky_plugin
from decky_plugin import logger
from src.battery_monitor import BatteryMonitor

THRESHOLD_MIN = 5
THRESHOLD_MAX = 50
SETTINGS_FILENAME = "batterygram.json"
_SETTINGS_PATH_CACHE: Optional[str] = None


def _settings_dir() -> str:
    """Папка для настроек: DECKY_PLUGIN_SETTINGS_DIR или папка settings в плагине."""
    env_dir = os.environ.get("DECKY_PLUGIN_SETTINGS_DIR", "").strip()
    if env_dir:
        return env_dir
    plugin_dir = os.environ.get("DECKY_PLUGIN_DIR", "").strip() or os.path.dirname(os.path.abspath(__file__))
    return os.path.join(plugin_dir, "settings")


def _settings_path() -> str:
    """Получить полный путь к файлу настроек"""
    global _SETTINGS_PATH_CACHE
    if _SETTINGS_PATH_CACHE is None:
        _SETTINGS_PATH_CACHE = os.path.join(_settings_dir(), SETTINGS_FILENAME)
    return _SETTINGS_PATH_CACHE


def _read_settings_file() -> dict[str, Any]:
    """Читаем настройки из JSON-файла"""
    path = _settings_path()
    if not os.path.isfile(path):
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, dict) else {}
    except Exception as e:
        logger.error(f"Ошибка чтения файла настроек: {e}")
        return {}


def _write_settings_file(settings: dict[str, Any]) -> None:
    """Сохраняем настройки в JSON-файл"""
    d = _settings_dir()
    path = _settings_path()
    try:
        os.makedirs(d, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(settings, f, ensure_ascii=False, indent=2)
        logger.info(f"Настройки BatteryGram сохранены в: {path}")
    except Exception as e:
        logger.error(f"Ошибка сохранения настроек в {path}: {e}")
        raise


class Plugin:
    async def _main(self) -> bool:
        """Инициализация плагина"""
        logger.info("Запуск плагина BatteryGram...")
        
        try:
            self.battery_monitor = BatteryMonitor()
            logger.info("BatteryMonitor инициализирован")
        except Exception as e:
            logger.error(f"Ошибка инициализации BatteryMonitor: {e}")
            return False

        try:
            settings = _read_settings_file()
            if settings:
                chat_id = settings.get("chat_id", "")
                threshold = min(THRESHOLD_MAX, max(THRESHOLD_MIN, settings.get("threshold", 20)))
                self.battery_monitor.set_config(chat_id, threshold)
                logger.info(f"Загружены настройки: порог={threshold}%")
        except Exception as e:
            logger.error(f"Ошибка загрузки настроек: {e}")

        logger.info(f"BatteryGram загружен. Файл настроек: {_settings_path()}")
        return True

    async def _unload(self) -> bool:
        """Выгрузка плагина"""
        if hasattr(self, 'battery_monitor'):
            self.battery_monitor.stop_monitoring()
        logger.info("BatteryGram выгружен")
        return True

    async def _migration(self) -> bool:
        """Миграция версий"""
        logger.info("Выполняется миграция BatteryGram")
        return True

    # ---------- Методы для фронтенда ----------

    async def get_settings_path(self) -> str:
        """Вернуть путь к файлу настроек (для отладки)"""
        return _settings_path()

    async def get_config(self) -> dict[str, Any]:
        """Вернуть сохранённые настройки"""
        try:
            settings = _read_settings_file()
            threshold = min(THRESHOLD_MAX, max(THRESHOLD_MIN, settings.get("threshold", 20)))
            lang = settings.get("language", "ru")  # По умолчанию русский
            if lang not in ("en", "ru"):
                lang = "ru"
            return {
                "chat_id": settings.get("chat_id", "") or "",
                "threshold": threshold,
                "language": lang,
            }
        except Exception as e:
            logger.error(f"Ошибка чтения конфигурации: {e}")
            return {"chat_id": "", "threshold": 20, "language": "ru"}

    async def save_config(
        self,
        chat_id: Optional[str] = None,
        threshold: Optional[int] = None,
        language: Optional[str] = None,
        **kwargs: Any,
    ) -> bool:
        """Сохранить настройки"""
        try:
            # Обработка вызова из фронтенда
            if isinstance(chat_id, dict):
                data = chat_id
                chat_id = str(data.get("chat_id", "") or "")
                threshold = data.get("threshold", 20)
                language = str(data.get("language", "ru") or "ru")
            elif isinstance(chat_id, str) and chat_id.strip().startswith("{"):
                try:
                    data = json.loads(chat_id)
                    chat_id = str(data.get("chat_id", "") or "")
                    threshold = data.get("threshold", 20)
                    language = str(data.get("language", "ru") or "ru")
                except json.JSONDecodeError:
                    pass
            
            if chat_id is None:
                chat_id = ""
            if threshold is None:
                threshold = 20
            if language is None:
                language = kwargs.get("language", "ru") or "ru"

            chat_id = (chat_id or "").strip() if isinstance(chat_id, str) else ""
            threshold = min(THRESHOLD_MAX, max(THRESHOLD_MIN, int(threshold)))
            lang = language if language in ("en", "ru") else "ru"

            if hasattr(self, 'battery_monitor'):
                self.battery_monitor.set_config(chat_id, threshold)
            
            settings = {
                "chat_id": chat_id,
                "threshold": threshold,
                "language": lang,
            }
            _write_settings_file(settings)
            
            # Маскируем chat_id для логов
            masked_chat_id = chat_id[:8] + "..." if len(chat_id) > 8 else chat_id or "(пусто)"
            logger.info(f"Конфигурация сохранена: chat_id={masked_chat_id}, порог={threshold}%, язык={lang}")
            return True
        except Exception as e:
            logger.error(f"Ошибка сохранения конфигурации: {e}")
            return False

    async def start_monitoring(self) -> bool:
        """Запустить мониторинг"""
        try:
            if hasattr(self, 'battery_monitor'):
                result = self.battery_monitor.start_monitoring()
                logger.info(f"Мониторинг запущен: {result}")
                return result
            return False
        except Exception as e:
            logger.error(f"Ошибка запуска мониторинга: {e}")
            return False

    async def stop_monitoring(self) -> bool:
        """Остановить мониторинг"""
        try:
            if hasattr(self, 'battery_monitor'):
                result = self.battery_monitor.stop_monitoring()
                logger.info(f"Мониторинг остановлен: {result}")
                return result
            return False
        except Exception as e:
            logger.error(f"Ошибка остановки мониторинга: {e}")
            return False

    async def test_telegram(self) -> bool:
        """Тест отправки сообщения в Telegram"""
        try:
            if hasattr(self, 'battery_monitor'):
                result = self.battery_monitor.test_connection()
                logger.info(f"Тест Telegram: {result}")
                return result
            return False
        except Exception as e:
            logger.error(f"Ошибка тестирования Telegram: {e}")
            return False

    async def get_battery_status(self) -> dict[str, Any]:
        """Получить текущий статус батареи"""
        try:
            if hasattr(self, 'battery_monitor'):
                level = self.battery_monitor.get_battery_level()
                charging = self.battery_monitor.is_charging()
                
                logger.debug(f"Статус батареи - уровень: {level}, зарядка: {charging}")
                
                return {
                    "level": level,
                    "charging": bool(charging) if charging is not None else False,
                    "monitoring": bool(self.battery_monitor.monitoring),
                }
            return {
                "level": None,
                "charging": False,
                "monitoring": False,
            }
        except Exception as e:
            logger.error(f"Ошибка получения статуса батареи: {e}")
            return {
                "level": None,
                "charging": False,
                "monitoring": False,
                "error": str(e),
            }

    async def debug_battery(self) -> dict:
        """Диагностика батареи"""
        try:
            if hasattr(self, 'battery_monitor'):
                return self.battery_monitor.debug_battery()
            return {"error": "BatteryMonitor не инициализирован"}
        except Exception as e:
            logger.error(f"Ошибка диагностики батареи: {e}")
            return {"error": str(e)}