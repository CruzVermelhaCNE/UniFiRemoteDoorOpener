const Notifications = require('../../notifications');

function telegramEcho(payload) {
    let myMatch = payload.msg.text.match(payload.regex);
    let reply = myMatch[1];
    let telegramBot = payload.telegram.bot;
    telegramBot.sendMessage(payload.msg.chat.id, reply);
}

Notifications.addEventHook("TELEGRAM_ECHO",telegramEcho);

module.exports = null;