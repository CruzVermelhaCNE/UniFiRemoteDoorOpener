require('dotenv').config()

const Notifications = require('./notifications');
const TelegramNotifications = require('./notifications/telegram');

function telegramEcho(payload) {
    let myMatch = payload.msg.text.match(payload.regex);
    let reply = myMatch[1];
    let telegramBot = payload.telegram.bot;
    telegramBot.sendMessage(payload.msg.chat.id, reply);
}

Notifications.addHook("TELEGRAM_ECHO",telegramEcho);


const telegram = new TelegramNotifications(process.env.TELEGRAM_BOT_TOKEN);
telegram.addProcessor(process.env.TELEGRAM_CHAT_ID,'/echo (.+)',() => {return true},"TELEGRAM_ECHO")