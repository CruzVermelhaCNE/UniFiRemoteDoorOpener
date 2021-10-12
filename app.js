require('dotenv').config()

const fs = require('fs');

const Notifications = require('./notifications');
const TelegramNotifications = require('./notifications/telegram');
const TelegramConfig = JSON.parse(fs.readFileSync('telegram_config.json'));
const UniFiAccess = require('./unifi_access');


require('./hooks/telegram');


const telegram = new TelegramNotifications(process.env.TELEGRAM_BOT_TOKEN, TelegramConfig);

async function main() {
    await UniFiAccess.boot();
    await UniFiAccess.login();
}

main();