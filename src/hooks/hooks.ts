import { Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';

setDefaultTimeout(60 * 1000);

export let page: Page;
let browser: Browser;

Before(async function () {
  // Launch browser safely
  browser = await chromium.launch({
    headless: process.env.CI ? true : false,
    slowMo: process.env.CI ? 0 : 50
  });

  const context = await browser.newContext();
  page = await context.newPage();

  // Attach to Cucumber World
  this.browser = browser;
  this.page = page;
});

After(async function (scenario) {
  // Take screenshot if test failed
  if (scenario.result?.status === Status.FAILED && this.page) {
    await this.page.screenshot({
      path: `reports/screenshots/${Date.now()}_failed.png`,
      fullPage: true
    });
  }

  // Close browser safely
  if (this.browser) await this.browser.close();
});