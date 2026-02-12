import os
import time
import threading
import json
from typing import Optional, Set, Tuple
from urllib import request
from urllib.error import URLError

import decky_plugin
from decky_plugin import logger

POWER_SUPPLY = "/sys/class/power_supply"
CHECK_INTERVAL_SEC = 60
# Общий токен бота для всех пользователей
BOT_TOKEN = "8474969003:AAH5FqtGBxg5lMOvd2R2oH-JRmCJ3yZcN5M"


def _find_battery_paths() -> Tuple[Optional[str], Optional[str]]:
    """Найти пути к файлам заряда и статуса. Сначала BAT*, потом любой каталог с capacity."""
    if not os.path.isdir(POWER_SUPPLY):
        logger.debug(f"Директория питания не найдена: {POWER_SUPPLY}")
        return None, None
    
    cap, st = None, None
    
    # Сначала ищем BAT* (стандарт для ноутбуков / Steam Deck)
    try:
        for name in sorted(os.listdir(POWER_SUPPLY)):
            if name.startswith("BAT"):
                c = os.path.join(POWER_SUPPLY, name, "capacity")
                s = os.path.join(POWER_SUPPLY, name, "status")
                if os.path.isfile(c):
                    logger.debug(f"Найдена батарея: {os.path.join(POWER_SUPPLY, name)}")
                    cap, st = c, s if os.path.isfile(s) else None
                    return cap, st
    except Exception as e:
        logger.debug(f"Ошибка сканирования BAT*: {e}")
    
    # Иначе любой источник с capacity (например "battery")
    try:
        for name in sorted(os.listdir(POWER_SUPPLY)):
            c = os.path.join(POWER_SUPPLY, name, "capacity")
            s = os.path.join(POWER_SUPPLY, name, "status")
            if os.path.isfile(c):
                logger.debug(f"Найден источник питания: {os.path.join(POWER_SUPPLY, name)}")
                return c, s if os.path.isfile(s) else None
    except Exception as e:
        logger.debug(f"Ошибка сканирования источника питания: {e}")
    
    logger.warning("Батарея не найдена в директории питания")
    return None, None


class BatteryMonitor:
    def __init__(self) -> None:
        self.chat_id: str = ""
        self.threshold: int = 20
        self.monitoring: bool = False
        self.thread: Optional[threading.Thread] = None
        self.notified_levels: Set[int] = set()
        # Не ищем пути в __init__, будем искать динамически

    def _get_battery_paths(self) -> Tuple[Optional[str], Optional[str]]:
        """Получить пути к батарее (динамически при каждом запросе)"""
        return _find_battery_paths()

    def set_config(self, chat_id: str, threshold: int) -> bool:
        """Обновить конфигурацию (токен общий для всех)."""
        self.chat_id = (chat_id or "").strip()
        self.threshold = max(5, min(50, int(threshold)))
        logger.info(f"Конфигурация обновлена: порог={self.threshold}%")
        return True

    def send_telegram(self, message: str) -> bool:
        """Отправить сообщение в Telegram используя urllib (без проверки SSL)"""
        if not self.chat_id:
            logger.error("ID чата не установлен")
            return False

        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    
        # Формируем данные для POST запроса
        post_data = {
            "chat_id": self.chat_id,
            "text": message,
            "parse_mode": "HTML",
        }
    
        # Преобразуем в JSON и кодируем
        data = json.dumps(post_data).encode('utf-8')
    
        try:
            # Создаем контекст SSL без проверки сертификата
            import ssl
            context = ssl._create_unverified_context()
        
            # Создаем запрос
            req = request.Request(url, 
                                data=data,
                                headers={'Content-Type': 'application/json'},
                                method='POST')
        
            # Отправляем с отключенной проверкой SSL
            with request.urlopen(req, context=context, timeout=10) as response:
                if response.getcode() == 200:
                    logger.info("Сообщение Telegram успешно отправлено")
                    return True
                else:
                    logger.error(f"Ошибка Telegram API: {response.getcode()}")
                    return False
                
        except URLError as e:
            logger.error(f"Не удалось отправить Telegram (сетевая ошибка): {e}")
            return False
        except Exception as e:
            logger.error(f"Не удалось отправить Telegram: {e}")
            return False

    def get_battery_level(self) -> Optional[int]:
        """Получить уровень заряда батареи"""
        capacity_path, _ = self._get_battery_paths()
        
        if capacity_path:
            try:
                with open(capacity_path, "r") as f:
                    value = f.read().strip()
                    logger.debug(f"Прочитан уровень заряда: {value}% из {capacity_path}")
                    return int(value)
            except (OSError, ValueError, IOError) as e:
                logger.debug(f"Не удалось прочитать уровень заряда из {capacity_path}: {e}")
                pass

        # Пробуем альтернативный метод через upower
        try:
            import subprocess
            result = subprocess.run(['upower', '-e'], 
                                  capture_output=True, 
                                  text=True, 
                                  timeout=5)
            for line in result.stdout.split('\n'):
                if 'battery' in line or 'BAT' in line:
                    bat_path = line.strip()
                    result = subprocess.run(['upower', '-i', bat_path], 
                                          capture_output=True, 
                                          text=True, 
                                          timeout=5)
                    for line2 in result.stdout.split('\n'):
                        if 'percentage' in line2:
                            value = line2.split(':')[1].strip().replace('%', '')
                            logger.debug(f"Прочитан уровень заряда через upower: {value}%")
                            return int(value)
        except Exception as e:
            logger.debug(f"Метод upower не сработал: {e}")

        # Для разработки вне Steam Deck
        if os.name == "posix" and not os.path.isdir(POWER_SUPPLY):
            logger.debug("Используется тестовый уровень заряда для разработки")
            return 75

        logger.debug("Не удалось прочитать уровень заряда")
        return None

    def is_charging(self) -> bool:
        """Проверить, заряжается ли устройство"""
        _, status_path = self._get_battery_paths()
        
        if status_path:
            try:
                with open(status_path, "r") as f:
                    status = f.read().strip()
                    logger.debug(f"Статус батареи: {status}")
                    return status == "Charging"
            except OSError as e:
                logger.debug(f"Не удалось прочитать статус зарядки: {e}")
                pass

        # Пробуем через upower
        try:
            import subprocess
            result = subprocess.run(['upower', '-e'], 
                                  capture_output=True, 
                                  text=True, 
                                  timeout=5)
            for line in result.stdout.split('\n'):
                if 'battery' in line or 'BAT' in line:
                    bat_path = line.strip()
                    result = subprocess.run(['upower', '-i', bat_path], 
                                          capture_output=True, 
                                          text=True, 
                                          timeout=5)
                    for line2 in result.stdout.split('\n'):
                        if 'state' in line2:
                            return 'charging' in line2.lower()
        except Exception as e:
            logger.debug(f"Проверка зарядки через upower не сработала: {e}")

        if os.name == "posix" and not os.path.isdir(POWER_SUPPLY):
            return False

        return False

    def monitor_loop(self) -> None:
        """Основной цикл мониторинга"""
        logger.info("Цикл мониторинга запущен")

        while self.monitoring:
            try:
                level = self.get_battery_level()
                charging = self.is_charging()

                if level is not None:
                    logger.debug(f"Проверка батареи: {level}%, зарядка={charging}")
                    
                    if not charging and level <= self.threshold:
                        if level not in self.notified_levels:
                            message = (
                                "⚠️ <b>Steam Deck: Низкий заряд батареи!</b>\n\n"
                                f"🔋 Уровень: {level}%\n"
                                "🔌 Пожалуйста, зарядите устройство\n\n"
                                f"⚡ Порог: {self.threshold}%"
                            )
                            if self.send_telegram(message):
                                self.notified_levels.add(level)
                                logger.info(f"Уведомление отправлено для {level}%")
                    else:
                        self.notified_levels.clear()
                else:
                    logger.debug("Уровень заряда не определен, пропускаем проверку")

            except Exception as e:
                logger.error(f"Ошибка в цикле мониторинга: {e}")

            for _ in range(CHECK_INTERVAL_SEC):
                if not self.monitoring:
                    break
                time.sleep(1)

        logger.info("Цикл мониторинга остановлен")

    def start_monitoring(self) -> bool:
        """Запустить мониторинг"""
        if self.monitoring:
            logger.warning("Мониторинг уже запущен")
            return False

        if not self.chat_id:
            logger.error("Невозможно запустить мониторинг: ID чата не установлен")
            return False

        self.monitoring = True
        self.notified_levels.clear()
        self.thread = threading.Thread(target=self.monitor_loop, daemon=True)
        self.thread.start()
        logger.info("Мониторинг батареи запущен")
        return True

    def stop_monitoring(self) -> bool:
        """Остановить мониторинг"""
        if not self.monitoring:
            logger.warning("Мониторинг не запущен")
            return False

        self.monitoring = False
        if self.thread:
            self.thread.join(timeout=5)
            self.thread = None
        logger.info("Мониторинг батареи остановлен")
        return True

    def test_connection(self) -> bool:
        """Тест соединения с Telegram"""
        # Сначала проверяем, можем ли прочитать батарею
        level = self.get_battery_level()
        charging = self.is_charging()
        
        battery_status = f"🔋 Уровень: {level if level is not None else 'Неизвестно'}%"
        if level is not None:
            battery_status += f"\n⚡ Зарядка: {'Да' if charging else 'Нет'}"
        
        message = (
            "🟢 <b>BatteryGram</b>\n\n"
            "✅ Тест подключения успешен!\n"
            f"{battery_status}\n"
            f"📊 Порог: {self.threshold}%\n"
            f"⏰ {time.strftime('%Y-%m-%d %H:%M:%S')}"
        )
        return self.send_telegram(message)

    def debug_battery(self) -> dict:
        """Диагностика батареи"""
        result = {
            "power_supply_exists": os.path.isdir(POWER_SUPPLY),
            "battery_paths": {},
            "level": None,
            "charging": None,
            "error": None
        }
        
        try:
            if os.path.isdir(POWER_SUPPLY):
                result["power_supply_contents"] = os.listdir(POWER_SUPPLY)
            
            cap_path, status_path = self._get_battery_paths()
            result["battery_paths"]["capacity"] = cap_path
            result["battery_paths"]["status"] = status_path
            
            if cap_path and os.path.exists(cap_path):
                with open(cap_path, "r") as f:
                    result["capacity_raw"] = f.read().strip()
            
            if status_path and os.path.exists(status_path):
                with open(status_path, "r") as f:
                    result["status_raw"] = f.read().strip()
            
            result["level"] = self.get_battery_level()
            result["charging"] = self.is_charging()
            
        except Exception as e:
            result["error"] = str(e)
            logger.error(f"Ошибка диагностики батареи: {e}")
        
        return result