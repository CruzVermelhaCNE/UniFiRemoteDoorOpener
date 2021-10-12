require('dotenv').config()

const fs = require('fs');

const Notifications = require('./notifications');
const TelegramNotifications = require('./notifications/telegram');
const TelegramConfig = JSON.parse(fs.readFileSync('telegram_config.json'));

require('./hooks/telegram');


const telegram = new TelegramNotifications(process.env.TELEGRAM_BOT_TOKEN, TelegramConfig);

const UniFiAccess = require('./unifi_access');
async function main() {
    await UniFiAccess.boot();
    await UniFiAccess.login();
    await UniFiAccess.openDoor(process.env.UNIFI_DEVICE_ID, process.env.UNIFI_DOOR_NAME);
}

main();