const Notifications = require('../../notifications');
const UniFiAccess = require('./unifi_access');


function telegramEcho(payload) {
    let myMatch = payload.msg.text.match(payload.regex);
    let reply = myMatch[1];
    let telegramBot = payload.telegram.bot;
    telegramBot.sendMessage(payload.msg.chat.id, reply);
}

async function telegramOpenDoor(payload) {
    await UniFiAccess.openDoor(process.env.UNIFI_DEVICE_ID, process.env.UNIFI_DOOR_NAME);
}

Notifications.addEventHook("TELEGRAM_ECHO", telegramEcho);
Notifications.addEventHook("TELEGRAM_OPEN_DOOR", telegramOpenDoor);

module.exports = null;