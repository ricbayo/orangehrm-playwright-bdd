import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    console.log(`Attempting to login as ${username}`)
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');

    // Wait for dashboard to load
    await this.page.waitForSelector('.oxd-topbar-header', { state: 'visible', timeout: 10000 });
    console.log('Login successful, dashboard loaded.')
  }

  async verifyLeftMenu() {
    console.log('Verifying left menu is visible.')
    // Wait for sidepanel to appear after login
    const sidePanel = this.page.locator('.oxd-sidepanel');
    await sidePanel.waitFor({ state: 'visible', timeout: 10000 });
    await expect(sidePanel).toBeVisible();
    console.log('Left menu is visible.')
  }

  async logout() {
    console.log('Attempting to logout.')
    await this.page.click('.oxd-userdropdown'); 
    await this.page.click('text=Logout');
    await this.page.waitForSelector('input[name="username"]', { state: 'visible', timeout: 5000 });
    console.log('Logout successful.')
  }
}