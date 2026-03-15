import { Page, expect } from '@playwright/test'
import { BasePage } from './base.page'
import { testContext } from '../utils/testContext';

export class PimPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  employeeId: string = "";

  async navigateToPIM() {
    await this.click('text=PIM')
  }

    async addEmployee(firstName: string, lastName: string, useRandomId: boolean = false) {
    // Click "Add" button
    await this.click('button:has-text("Add")');

    // Wait until form is visible
    const firstNameInput = this.page.locator('input[name="firstName"]');
    await firstNameInput.waitFor({ state: 'visible', timeout: 10000 });

    // Fill first and last name
    await firstNameInput.fill(firstName);
    await this.page.locator('input[name="lastName"]').fill(lastName);

    // Capture Employee ID field
    const empIdField = this.page.locator('.oxd-input-group:has(label:has-text("Employee Id")) input');
    await empIdField.waitFor({ state: 'visible', timeout: 10000 });

    let employeeId = await empIdField.inputValue();

    // If we want a random ID, override the field
    if (useRandomId) {
      employeeId = this.generateRandomEmployeeId(6)
      await empIdField.fill(employeeId)
    }

    // Store in testContext
    testContext.employeeData = {
      firstName,
      lastName,
      employeeId
    };

    console.log(`Using Employee ID: ${employeeId}`);

    // Submit the form
    await this.click('button[type="submit"]');

    // Wait until employee list page is visible
    await this.page.locator('h6:has-text("Personal Details")').waitFor({ state: 'visible', timeout: 10000 });
  }

  async verifyEmployeeInList(employeeId: string, firstName: string, lastName: string) {
    await this.click('text=Employee List')
    const searchInput = this.page.locator('.oxd-input-group:has(label:has-text("Employee Id")) input');

    // Wait until input is visible
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });

    // Fill the Employee ID
    await searchInput.fill(employeeId);

    // Click Search button
    await this.page.getByRole('button', { name: 'Search' }).click();

    // Wait for the results table row containing this employee ID
    const resultRow = this.page.locator(`.oxd-table-row:has-text("${employeeId}")`);

    await resultRow.waitFor({ state: 'visible', timeout: 10000 });
    const row = this.page.locator(  `.oxd-table-row:has-text("${employeeId}"):has-text("${firstName}"):has-text("${lastName}")`
    );
    await expect(row).toBeVisible();

    console.log(`Search completed for employee ID: ${employeeId}`);
  }
  

  async selectEmployee(employeeId: string) {
    // Ensure results are present
    const resultRow = this.page.locator(`.oxd-table-row:has-text("${employeeId}")`);
    await resultRow.waitFor({ state: 'visible', timeout: 10000 });
    // Click the row to open employee details
    await resultRow.click();
    this.waitForVisible('h6:has-text("Personal Details")')
    await this.page.waitForTimeout(3000) 
    console.log(`Selected employee: ${employeeId}`);
  }

  async navigatePimTab(tabName: string, pageHeader: string) {
    // Locate the PIM left panel tab
    const tabLocator = this.page.locator('.orangehrm-tabs >> text=' + tabName)
    await tabLocator.waitFor({ state: 'visible', timeout: 5000 })
    await tabLocator.click()

    // Wait for the page header to confirm the tab loaded
    const headerLocator = this.page.locator(`h6:has-text("${pageHeader}")`)
    await headerLocator.waitFor({ state: 'visible', timeout: 10000 })
    await expect(headerLocator).toBeVisible()
  }  

    /** Generate a random numeric Employee ID of given length */
  generateRandomEmployeeId(length: number = 6): string {
    let result = ''
    const chars = '0123456789'
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

