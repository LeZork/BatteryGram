#!/bin/bash

STEAMDECK_IP="192.168.31.170"
PLUGIN_NAME="BatteryGram"

echo "🔨 Собираем плагин..."
pnpm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки!"
    exit 1
fi

echo "📦 Создаем директорию и копируем файлы..."
# Создаем директорию через SSH с sudo
ssh -t deck@$STEAMDECK_IP "sudo mkdir -p /home/deck/homebrew/plugins/$PLUGIN_NAME && sudo chown deck:deck /home/deck/homebrew/plugins/$PLUGIN_NAME"

# Копируем файлы
scp -r dist/ deck@$STEAMDECK_IP:/home/deck/homebrew/plugins/$PLUGIN_NAME/
scp main.py deck@$STEAMDECK_IP:/home/deck/homebrew/plugins/$PLUGIN_NAME/
scp plugin.json deck@$STEAMDECK_IP:/home/deck/homebrew/plugins/$PLUGIN_NAME/
scp package.json deck@$STEAMDECK_IP:/home/deck/homebrew/plugins/$PLUGIN_NAME/
scp -r backend/ deck@$STEAMDECK_IP:/home/deck/homebrew/plugins/$PLUGIN_NAME/

echo "🔄 Перезагружаем Decky..."
ssh -t deck@$STEAMDECK_IP "sudo systemctl restart plugin_loader.service"

echo "✅ Готово! Плагин обновлен!"
echo ""
echo "📊 Проверить логи:"
echo "ssh deck@$STEAMDECK_IP 'sudo journalctl -f -u plugin_loader.service'"