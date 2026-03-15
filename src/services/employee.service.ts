import { APIRequestContext, expect } from '@playwright/test';

export class EmployeeService {
  constructor(private request: APIRequestContext) {}

  async getEmployeeById(employeeId: string) {
    const response = await this.request.get(
      `/web/index.php/api/v2/pim/employees?employeeId=${employeeId}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBeTruthy();

    const employee = body.data.find((emp: any) => emp.employeeId === employeeId);

    expect(employee).toBeTruthy();

    return employee;
  }
}