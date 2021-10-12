class Notification {
    constructor() {
        this.events = {}
    }

    addHook(eventName, eventCallback) {
        if(!(eventName in this.events)) {
            this.events[eventName] = [];
        }

        if(!(this.events[eventName].includes(eventCallback))) {
            this.events[eventName].push(eventCallback);
        }
        else {
            console.error(`Event Callback already exists on event ${eventName}`);
        }
    }

    removeHook(eventName, eventCallback) {
        if(!(eventName in this.events)) {
            return;
        }
        this.events[eventName] = this.events[eventName].filter((callback) => {
            return callback !== eventCallback;
        });
    }

    trigger(eventName, payload) {
        if(!(eventName in this.events)) {
            return;
        }
        for (const eventCallback of this.events[eventName]) {
            eventCallback(payload);
        }
    }
}

module.exports = new Notification();