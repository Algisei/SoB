#!/bin/bash

# Обновление системы
echo "Обновление системы..."
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
echo "Установка необходимых пакетов..."
sudo apt install -y curl git build-essential

# Установка Node.js и npm
echo "Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка версий
echo "Проверка установленных версий..."
node -v
npm -v

# Клонирование репозитория с React-приложением
echo "Введите URL репозитория вашего React-приложения:"
read REPO_URL
git clone $REPO_URL react-app

# Переход в папку приложения
cd react-app || { echo "Ошибка: папка приложения не найдена."; exit 1; }

# Установка зависимостей
echo "Установка зависимостей проекта..."
npm install

# Сборка проекта
echo "Сборка React-приложения..."
npm run build

# Установка serve для запуска приложения
echo "Установка serve для раздачи статических файлов..."
sudo npm install -g serve

# Создание systemd службы
echo "Настройка автозапуска приложения..."
SERVICE_FILE=/etc/systemd/system/react-app.service
sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=React Application
After=network.target

[Service]
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/serve -s build -l 80
Restart=always
User=$(whoami)

[Install]
WantedBy=multi-user.target
EOF

# Активируем и запускаем службу
sudo systemctl enable react-app
sudo systemctl start react-app

# Проверка статуса службы
echo "Проверка статуса службы..."
sudo systemctl status react-app

echo "React-приложение успешно развернуто и работает на порту 80!"
