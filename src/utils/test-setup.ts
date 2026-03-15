import { chromium, Browser, Page } from '@playwright/test';

let browser: Browser;
let page: Page;

export async function startBrowser() {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  return page;
}

export async function closeBrowser() {
  await page.close();
  await browser.close();
}

export { page };