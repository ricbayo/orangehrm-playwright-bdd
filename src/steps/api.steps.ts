// src/steps/employee.steps.ts
import { When } from '@cucumber/cucumber';
import { EmployeeAPI } from '../api/employee.api';
import { testContext } from '../utils/testContext';

When('I fetch employee from the API', async () => {
  // Fetch the first employee and store in testContext automatically
  const emp = await EmployeeAPI.fetchEmployees(1, 0);
  testContext.employeeData = emp[0];
  console.log('Employee fetched from API:', testContext.employeeData);
});

When('I fetch the updated employee details via API', async function () {
  // This automatically extracts empNumber from the current page URL
  this.employeeData = await EmployeeAPI.fetchEmployeePersonalDetailsFromUrl();
  console.log('Fetched employee data via API:', this.employeeData);
});

