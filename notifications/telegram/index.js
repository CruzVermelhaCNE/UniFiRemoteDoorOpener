const TelegramBot = require('node-telegram-bot-api');
const Notifications = require('../index');
const TelegramValidations = require('../../validations/telegram');


class Telegram {
    constructor(token, TelegramConfig) {
        this.chats = {}
        this.bot = new TelegramBot(token, { polling: true });
        this.bot.on('message', (msg) => {
            this.processMessage(msg);
        });

        for (const chatId in TelegramConfig) {
            if (Object.hasOwnProperty.call(TelegramConfig, chatId)) {
                const details = TelegramConfig[chatId];
                if (!("validation" in details)) {
                    console.error("The parameter 'validation' needs to be defined");
                    process.exit(1);
                }
                let defaultValidation = details["validation"];
                let defaultValidationArguments = null;

                if (!(defaultValidation in TelegramValidations)) {
                    console.error("The parameter 'validation' is not valid");
                    process.exit(1);
                }

                if (defaultValidation == "user_ids") {
                    if (!("validation_userIds" in details)) {
                        console.error("Validation user_ids requires the parameter 'validation_userIds'");
                        process.exit(1);
                    }
                    if (!Array.isArray(details["validation_userIds"])) {
                        console.error("The parameter 'validation_userIds' needs to be an array");
                        process.exit(1);
                    }
                    defaultValidationArguments = details["validation_userIds"];
                }
                for (const messageRegex in details["messages"]) {
                    if (Object.hasOwnProperty.call(details["messages"], messageRegex)) {
                        const message = details["messages"][messageRegex];
                        let validation = defaultValidation;
                        let validationArguments = defaultValidationArguments;
                        if (!("event" in message)) {
                            console.error("The parameter 'event' needs to be defined inside every message");
                            process.exit(1);
                        }
                        let eventName = message["event"];
                        if ("validation" in message) {
                            validation = message["validation"];
                            if (!(validation in TelegramValidations)) {
                                console.error("The parameter 'validation' is not valid");
                                process.exit(1);
                            }
                            validationArguments = null;
                            if (validation == "user_ids") {
                                if (!("validation_userIds" in message)) {
                                    console.error("Validation user_ids requires the parameter 'validation_userIds'");
                                    process.exit(1);
                                }
                                if (!Array.isArray(message["validation_userIds"])) {
                                    console.error("The parameter 'validation_userIds' needs to be an array");
                                    process.exit(1);
                                }
                                validationArguments = message["validation_userIds"];
                            }
                        }
                        this.addProcessor(chatId, messageRegex, TelegramValidations[validation], validationArguments, eventName);
                    }
                }
            }
        }
    }

    addProcessor(chatId, messageRegex, authorizationCallback, authorizationArguments, eventName) {
        if (!(chatId in this.chats)) {
            this.chats[chatId] = {};
        }
        if (!(messageRegex in this.chats[chatId])) {
            this.chats[chatId][messageRegex] = {
                authorizationCallback,
                authorizationArguments,
                eventName
            };
        }
    }

    removeProcessor(chatId, messageRegex) {
        if (!(chatId in this.chats)) {
            return;
        }
        if (this.chats[chatId][messageRegex]) {
            delete this.chats[chatId][messageRegex];
        }
    }

    processMessage(msg) {
        let chatId = msg.chat.id;
        if (!(chatId in this.chats)) {
            return;
        }
        for (const messageRegex in this.chats[chatId]) {
            let regex = new RegExp(messageRegex);
            if (msg.text.match(regex)) {
                if (this.chats[chatId][messageRegex]["authorizationCallback"](this.chats[chatId][messageRegex]["authorizationArguments"],msg)) {
                    Notifications.trigger(this.chats[chatId][messageRegex]["eventName"], { telegram: this, msg, regex });
                }
            }
        }
    }
}

module.exports = Telegram;