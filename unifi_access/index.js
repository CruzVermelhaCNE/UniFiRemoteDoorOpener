const playwright = require('playwright');

class UniFiAccess {
    async boot() {
        this.browser = await playwright.chromium.launch({
            headless: true
        });        
        this.page = await this.browser.newPage();
    }

    async login() {
        await this.page.goto('https://account.ui.com/login?redirect=https%3A%2F%2Funifi.ui.com%2Fdashboard');
        await this.page.waitForTimeout(500);
        await this.page.fill('input[name="username"]', process.env.UNIFI_EMAIL);
        await this.page.fill('input[name="password"]', process.env.UNIFI_PASSWORD);
        await this.page.click('button[type="submit"]');
        await this.page.waitForTimeout(500);
    }

    async openDoor(deviceId, doorName) {
        await this.page.goto(`https://unifi.ui.com/device/${deviceId}/access/entity/location`);
        await this.page.waitForTimeout(500);
        await this.page.click(`#c-layout-content div.location-container span:has-text("${doorName}")`);
        await this.page.click('button span:visible:has-text("Unlock")');
    }
}

module.exports = new UniFiAccess();