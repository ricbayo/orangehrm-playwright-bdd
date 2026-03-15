@ui
Feature: Employee Management

Scenario: Add and edit employee in OrangeHRM
  Given I login as admin
  Then I should see the left side navigation menu
  When I navigate to the PIM module
  And I add a new employee with valid details
  Then the employee should appear in the employee list
  Then I select the employee from the list
  When I update the employee "Personal" details
      | First Name     | John         |
      | Last Name      | Doe          |
      | Gender         | Male         |
      | Marital Status | Single       |
      | Nationality    | Filipino     |
      | Date of Birth  | 1990-01-01   |
      | License Number | 123456789    |
      | License Expiry | 2030-01-01   |
  Then the employee "Personal" details should be saved
  When I update the employee "Job" details
      | Joined Date       | 2024-01-01 |
      | Job Title         | QA Engineer |
      | Sub Unit          | Quality Assurance |
      | Location          | HQ - CA, USA |
      | Employment Status | Full-Time Permanent |
  Then the employee "Job" details should be saved
  When I logout from the application