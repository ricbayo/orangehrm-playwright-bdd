import { Page, expect } from '@playwright/test'

export class BasePage {

  constructor(protected page: Page) {}

  async click(locator: string) {
    await this.page.click(locator)
  }

  async type(locator: string, text: string) {
    await this.page.fill(locator, text)
  }

  async waitForVisible(locator: string) {
    await this.page.waitForSelector(locator)
  }
async selectDropdownByLabel(label: string, value: string) {
    const dropdown = this.page.locator(
      `.oxd-input-group:has(label:has-text("${label}")) .oxd-select-text`
    )

    await dropdown.click()

    await this.page
      .locator('.oxd-select-dropdown')
      .getByText(value, { exact: true })
      .click()
  }

  async fillInputByLabel(label: string, value: string) {
    const input = this.page.locator(
      `.oxd-input-group:has(label:has-text("${label}")) input`
    )

    await input.fill(value)
  }

  async verifyDropdownValue(label: string, expected: string) {
    const dropdown = this.page.locator(
      `.oxd-input-group:has(label:has-text("${label}"))`
    )

    await expect(dropdown).toContainText(expected)
  }

  async verifyInputValue(label: string, expected: string) {
    const input = this.page.locator(
      `.oxd-input-group:has(label:has-text("${label}")) input`
    )

    await expect(input).toHaveValue(expected)
  }

  async forceFillDateByLabel(label: string, date: string) {
    const input = this.page.locator(
      `.oxd-input-group:has(label:has-text("${label}")) input`
    )
    await input.waitFor({ state: 'visible', timeout: 10000 })
    // Force fill the input even if it's readonly
    await input.fill(date, { force: true })

    // Optional: blur or press Tab to trigger JS change event
    await input.press('Tab')
    await input.click() // click to ensure any JS events are triggered
  }

}