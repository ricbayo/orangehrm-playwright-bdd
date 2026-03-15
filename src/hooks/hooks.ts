import { Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber'
import { chromium, Browser, Page } from '@playwright/test'
import { testContext } from '../utils/testContext'

setDefaultTimeout(60 * 1000) // 60 seconds

export let page: Page
let browser: Browser

Before(async () => {
  // Launch browser with GUI and slowMo for easier debugging
  browser = await chromium.launch({
    headless: false
  })
  const context = await browser.newContext()
  page = await context.newPage()
})

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    // Screenshot on failure
    await page.screenshot({ 
      path: `reports/${Date.now()}_failed.png`, 
      fullPage: true 
    })
  }
  await browser.close()
})