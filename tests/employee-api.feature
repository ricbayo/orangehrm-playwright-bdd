@api
Feature: Employee API Validation
  @api @sc1
  Scenario: Validate employee created from UI via API
    Given I login as admin
    Then I should see the left side navigation menu
    When I fetch employee from the API
    When I navigate to the PIM module
    Then the employee should appear in the employee list
  
  @api @sc2
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
    When I fetch the updated employee details via API
    Then the UI personal details should match the API data
  
  

