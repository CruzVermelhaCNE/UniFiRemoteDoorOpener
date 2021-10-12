const TelegramBot = require('node-telegram-bot-api');
const Notifications = require('./index');

class Telegram {
    constructor(token) {
        this.chats = {}
        this.bot = new TelegramBot(token, {polling: true});
        this.bot.on('message',(msg) => {
            this.processMessage(msg);
        });
    }

    addProcessor(chatId,messageRegex,authorizationCallback, eventName) {
        if(!(chatId in this.chats)) {
            this.chats[chatId] = {};
        }
        if(!(messageRegex in this.chats[chatId])) {
            this.chats[chatId][messageRegex] = {
                authorizationCallback,
                eventName
            };
        }
    }

    removeProcessor(chatId,messageRegex) {
        if(!(chatId in this.chats)) {
            return;
        }
        if(this.chats[chatId][messageRegex]) {
            delete this.chats[chatId][messageRegex];
        }
    }

    processMessage(msg) {
        let chatId = msg.chat.id;
        if(!(chatId in this.chats)) {
            return;
        }
        for (const messageRegex in this.chats[chatId]) {
            let regex = new RegExp(messageRegex);
            if(msg.text.match(regex)) {
                if(this.chats[chatId][messageRegex]["authorizationCallback"](msg)) {
                    Notifications.trigger(this.chats[chatId][messageRegex]["eventName"],{telegram: this,msg,regex});
                }
            }
        }
    }
}

module.exports = Telegram;