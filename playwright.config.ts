import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 1. Directory for your tests
  testDir: './tests',

  // 2. Test timeout
  timeout: 60 * 1000,

  // 3. Retries for flaky tests
  retries: process.env.CI ? 2 : 1,

  // 4. Reporters
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/json-report/results.json' }]
  ],

  // 5. Shared settings
  use: {
    browserName: 'chromium',
    headless: process.env.CI ? true : false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    baseURL: 'https://opensource-demo.orangehrmlive.com/',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30 * 1000,
    ignoreHTTPSErrors: true,
  },

  // 6. Multiple browsers
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],

  // 7. CI-friendly settings
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : undefined,
});