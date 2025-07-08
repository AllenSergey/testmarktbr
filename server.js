const express = require('express');
const path = require('path');
const app = express();

// Настройка порта
const PORT = process.env.PORT || 3000;

// Настройка статических файлов
app.use(express.static(path.join(__dirname)));

// Настройка заголовков для Telegram WebApp
app.use((req, res, next) => {
    // Разрешаем использование в iframe
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    
    // CORS для работы с Telegram
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Безопасность
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Политика безопасности контента
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self' https://telegram.org; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.telegram.org https://telegram.org;"
    );
    
    next();
});

// Основной маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Обработка всех остальных маршрутов (для SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Black Russia Market запущен на порту ${PORT}`);
    console.log(`📱 Откройте в браузере: http://localhost:${PORT}`);
    console.log(`🤖 Для Telegram используйте HTTPS версию`);
});

// Обработка ошибок
process.on('uncaughtException', (error) => {
    console.error('Необработанная ошибка:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Необработанный отказ промиса:', reason);
    process.exit(1);
}); 