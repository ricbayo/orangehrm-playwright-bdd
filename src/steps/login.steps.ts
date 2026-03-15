import { Given, When, Then } from '@cucumber/cucumber'
import { LoginPage } from '../pages/login.page'
import { page } from '../hooks/hooks'

let loginPage: LoginPage


Given('I am logged in as {string} with password {string}', async (username, password) => {
  loginPage = new LoginPage(page);
  await page.goto('https://opensource-demo.orangehrmlive.com/');
  await loginPage.login(username, password);
});

Given('I login as admin', async () => {
  console.log("Logging in as admin")
  loginPage = new LoginPage(page);
  await page.goto('https://opensource-demo.orangehrmlive.com/');
  await loginPage.login('Admin', 'admin123')

  const cookies = await page.context().cookies()

  const cookieHeader = cookies
  .map(cookie => `${cookie.name}=${cookie.value}`)
  .join('; ')
  console.log("Login submitted")
})