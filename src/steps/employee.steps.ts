import { Given, When, Then, DataTable, Before,  } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { PimPage } from '../pages/pim.page';
import { EmployeePage } from '../pages/employee.page';
import { page } from '../hooks/hooks';
import { TestDataHelper } from '../utils/testDataHelper';
import { testContext } from '../utils/testContext';
import { EmployeeAPI, EmployeeData } from '../api/employee.api'; 

let loginPage: LoginPage;
let pimPage: PimPage;
let employeePage: EmployeePage;

Before(async () => {
  loginPage = new LoginPage(page);
  pimPage = new PimPage(page);
  employeePage = new EmployeePage(page);
});

Then('I should see the left side navigation menu', async () => {
  await loginPage.verifyLeftMenu();
});

When('I navigate to the PIM module', async () => {
  await pimPage.navigateToPIM();
});

When('I add a new employee with valid details', async () => {
  testContext.employeeData = TestDataHelper.getRandomEmployee();
  const emp = testContext.employeeData;

  console.log(`Adding employee: ${emp.firstName} ${emp.lastName}`);
  await pimPage.addEmployee(emp.firstName, emp.lastName, true);
});

Then('the employee should appear in the employee list', async () => {
  const emp = testContext.employeeData;
  await pimPage.verifyEmployeeInList(emp.employeeId, emp.firstName, emp.lastName);
});

// --- UPDATED STEP ---
When('I update the employee {string} details', async function (section: string, table: DataTable) {
  const data = table.rowsHash();

  testContext.sectionData = testContext.sectionData || {};
  testContext.sectionData[section] = data;

  await employeePage.editSectionFields(section, data);
});

Then('the employee {string} details should be saved', async function (section: string) {
  await employeePage.verifySectionFields(section, testContext.sectionData[section]);
});

When('I logout from the application', async () => {
  await loginPage.logout();
});

Then('I select the employee from the list', async () => {
  const emp = testContext.employeeData;
  await pimPage.selectEmployee(emp.employeeId);
});

Then('the UI personal details should match the API data', async function () {

  // 2️⃣ Fetch API data
  const employeeData: EmployeeData = await EmployeeAPI.fetchEmployeePersonalDetailsFromUrl();
  this.employeeData = employeeData; // optional, store in World

  // 3️⃣ Map API data to UI-friendly strings
  const fields = {
    "First Name": String(employeeData.firstName || ""),
    "Middle Name": String(employeeData.middleName || ""),
    "Last Name": String(employeeData.lastName || ""),
    "Gender": employeeData.gender === 1 ? "Male" :
              employeeData.gender === 2 ? "Female" : "",
    "Marital Status": String(employeeData.maritalStatus || ""),
    "Nationality": employeeData.nationality?.name || "",
    "Date of Birth": String(employeeData.birthday || ""),
    "License Number": String(employeeData.drivingLicenseNo || ""),
    "License Expiry": String(employeeData.drivingLicenseExpiredDate || "")
  };

  // 4️⃣ Verify UI fields using existing helper
  await employeePage.verifySectionFields("Personal", fields);

  console.log('✅ UI personal details match API data');
});