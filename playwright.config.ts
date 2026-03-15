import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 1. Directory for your Playwright tests / step definitions
  testDir: './src/steps',

  // 2. Maximum time a test can run
  timeout: 60000, // 60 seconds

  // 3. Retries on CI for flaky tests
  retries: process.env.CI ? 2 : 1, // retry twice on CI, once locally

  // 4. Reporters
  reporter: [
    ['list'], // console summary
    ['html', { outputFolder: 'reports/html-report', open: 'never' }], // HTML report
    ['json', { outputFile: 'reports/json-report/results.json' }] // JSON for email/CI
  ],

  // 5. Shared settings for all tests
  use: {
    browserName: 'chromium', // default browser
    headless: process.env.CI ? true : false, // headless in CI
    screenshot: 'only-on-failure', // take screenshots only on failure
    video: 'retain-on-failure', // retain video on failure
    baseURL: 'https://opensource-demo.orangehrmlive.com/',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000, // max time for each action
    ignoreHTTPSErrors: true, // allow self-signed certs if any
  },

  // 6. Run tests in multiple browsers (projects)
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // Optional: add WebKit for cross-browser coverage
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],

  // 7. CI-friendly settings
  forbidOnly: !!process.env.CI, // fail if .only is left in code on CI
  workers: process.env.CI ? 2 : undefined, // limit parallelism on CI if needed

});