import { BasePage } from './base.page'
import { Locator, expect } from '@playwright/test'
import { PimPage } from './pim.page'

export class EmployeePage extends BasePage {

  /**
   * Edits fields dynamically for any PIM section.
   * @param sectionName - e.g., 'Personal Details' or 'Job'
   * @param pageHeader - header to confirm section loaded
   * @param fields - object of label/value pairs
   * @param delayMs - optional delay before each field edit
   */
  async editSectionFields(sectionName: string, fields: Record<string, string>) {
    console.log(`Editing section: ${sectionName}`)
    const sectionLocator = await this._getSection(sectionName)

    for (const [label, value] of Object.entries(fields)) {
      console.log(`Updating field '${label}' with value '${value}'`)

      if (['First Name', 'Middle Name', 'Last Name'].includes(label)) {
        await this._editFullNameField(label, value)
        continue
      }

      if (['Joined Date', 'Date of Birth', 'License Expiry'].includes(label)) {
        await this._editDateField(label, value)
        continue
      }

      // Generic field handling
      const fieldGroup = sectionLocator.locator(
        `.oxd-input-group:has(label:has-text("${label}"))`
      )

      const isRadio = (await fieldGroup.locator('input[type="radio"]').count()) > 0
      const isDropdown = (await fieldGroup.locator('.oxd-select-text').count()) > 0
      const isInput = (await fieldGroup.locator('input').count()) > 0

      if (isRadio) {
        await this._editRadioField(fieldGroup, value)
      } else if (isDropdown) {
        await this._editDropdownField(fieldGroup, value)
      } else if (isInput) {
        await this._editTextField(fieldGroup, value)
      }
    }

    await this._saveSection(sectionLocator, sectionName)
  }

  /**
   * Verifies fields dynamically for any PIM section.
   */
  async verifySectionFields(sectionName: string, fields: Record<string, string>) {
    console.log(`Verifying section: ${sectionName}`)
    const sectionLocator = await this._getSection(sectionName)

    for (const [label, value] of Object.entries(fields)) {
      console.log(`Verifying field '${label}' has value '${value}'`)

      if (['First Name', 'Middle Name', 'Last Name'].includes(label)) {
        await this._verifyFullNameField(label, value)
        continue
      }

      if (['Joined Date', 'Date of Birth', 'License Expiry'].includes(label)) {
        await this._verifyDateField(label, value)
        continue
      }

      // Generic field handling
      const fieldGroup = sectionLocator.locator(
        `.oxd-input-group:has(label:has-text("${label}"))`
      )

      const isRadio = (await fieldGroup.locator('input[type="radio"]').count()) > 0
      const isDropdown = (await fieldGroup.locator('.oxd-select-text').count()) > 0
      const isInput = (await fieldGroup.locator('input').count()) > 0

      if (isRadio) {
        await this._verifyRadioField(fieldGroup, value)
      } else if (isDropdown) {
        await this._verifyDropdownField(fieldGroup, value)
      } else if (isInput) {
        await this._verifyTextField(fieldGroup, value)
      } else {
        // Fallback for other text-based content that isn't an input
        await this._verifyDropdownField(fieldGroup, value)
      }
    }
    console.log(`Verification successful for section: ${sectionName}`)
  }

  // --- PRIVATE HELPERS ---

  private async _getSection(sectionName: string) {
    const pimPage = new PimPage(this.page)
    const sectionMap: Record<string, string> = {
      Personal: 'Personal Details',
      'Personal Details': 'Personal Details',
      Job: 'Job Details',
      'Job Details': 'Job Details',
    }
    const actualSectionName = sectionMap[sectionName] || sectionName

    if (actualSectionName === 'Job Details') {
      console.log('Navigating to Job tab')
      await pimPage.navigatePimTab('Job', 'Job Details')
    } else if (actualSectionName === 'Personal Details') {
      console.log('Navigating to Personal Details tab')
      await pimPage.navigatePimTab('Personal Details', 'Personal Details')
    }
    await this.page.waitForTimeout(3000)
    return this.page.locator(
      `.orangehrm-card-container:has-text("${actualSectionName}")`
      
    )
  }

  async getEmployeeDetailsFromUI() {
  const firstName = await this.page
      .locator('input[name="firstName"]')
      .inputValue();

    const lastName = await this.page
      .locator('input[name="lastName"]')
      .inputValue();

    const employeeId = await this.page
      .locator('label:has-text("Employee Id")')
      .locator('xpath=..')
      .locator('input')
      .inputValue();

    const jobTitle = await this.page
      .locator('.oxd-input-group:has(label:has-text("Job Title"))')
      .locator('.oxd-select-text')
      .textContent();

    return {
      firstName,
      lastName,
      employeeId,
      jobTitle: jobTitle?.trim()
    };
  }
  


  private async _saveSection(sectionLocator: Locator, sectionName: string) {
    console.log(`Saving changes for section: ${sectionName}`)
    const saveButton = sectionLocator.locator('button:has-text("Save")').first()
    await saveButton.scrollIntoViewIfNeeded()
    await saveButton.click()
    await expect(this.page.locator('.oxd-toast')).toBeVisible()
    await expect(this.page.locator('.oxd-toast')).not.toBeVisible()
  }

  private _toCamelCase(s: string): string {
    return s.replace(/(\s\w)/g, m => m[1].toUpperCase()).replace(/\s/g, '')
  }

  // --- Edit Field Helpers ---

  private async _editFullNameField(label: string, value: string) {
    console.log('  -> Handling as Name field')
    const name = this._toCamelCase(label.toLowerCase())
    const nameInput = this.page.locator(`input[name="${name}"]`)
    await nameInput.fill(value)
    await this.page.waitForTimeout(300)
  }

  private async _editDateField(label: string, value: string) {
    console.log('  -> Handling as Date field')
    await this.forceFillDateByLabel(label, value)
    await this.page.waitForTimeout(300)
  }

  private async _editRadioField(fieldGroup: Locator, value: string) {
    console.log('  -> Handling as Radio button');

    // Map value to radio value
    const radioValue = value.toLowerCase() === 'male' ? '1' : '2';

    // Find the visible radio wrapper
    const radioWrapper = fieldGroup.locator(`label:has(input[value="${radioValue}"])`);
    await radioWrapper.scrollIntoViewIfNeeded();
    await radioWrapper.click(); // click the visible label, not hidden input

    await this.page.waitForTimeout(300);
  }

  private async _editTextField(fieldGroup: Locator, value: string) {
    console.log('  -> Handling as Text input')
    const input = fieldGroup.locator('input').first()
    await input.scrollIntoViewIfNeeded()
    await input.fill(value)
    await this.page.waitForTimeout(300)
  }

  private async _editDropdownField(fieldGroup: Locator, value: string) {
    console.log('  -> Handling as Dropdown')
    await fieldGroup.locator('.oxd-select-text').click()
    const option = this.page.locator(`.oxd-select-dropdown >> text="${value}"`)
    await option.waitFor({ state: 'visible', timeout: 5000 })
    await option.click()
    await this.page.waitForTimeout(300)
  }

  // --- Verify Field Helpers ---

  private async _verifyFullNameField(label: string, value: string) {
    console.log('  -> Verifying as Name field')
    const name = this._toCamelCase(label.toLowerCase())
    const nameInput = this.page.locator(`input[name="${name}"]`)
    await expect(nameInput).toHaveValue(value)
  }

  private async _verifyDateField(label: string, value: string) {
    console.log('  -> Verifying as Date field')
    await this.verifyInputValue(label, value)
  }

  private async _verifyRadioField(fieldGroup: Locator, value: string) {
    console.log('  -> Verifying as Radio button')
    const radioValue = value.toLowerCase() === 'male' ? '1' : '2'
    await expect(fieldGroup.locator(`input[value="${radioValue}"]`)).toBeChecked()
  }

  private async _verifyTextField(fieldGroup: Locator, value: string) {
    console.log('  -> Verifying as Text input')
    await expect(fieldGroup.locator('input').first()).toHaveValue(value)
  }

  private async _verifyDropdownField(fieldGroup: Locator, value: string) {
    console.log('  -> Verifying as Dropdown/Text content')
    await expect(fieldGroup).toContainText(value)
  }
}