// src/api/employee.api.ts
import { page } from '../hooks/hooks';

export interface EmployeeData {
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: number; // 1 = Male, 2 = Female
  maritalStatus: string;
  nationality?: { id: number; name: string };
  birthday: string;
  drivingLicenseNo: string;
  drivingLicenseExpiredDate: string;
}

export class EmployeeAPI {
  private static async getCookieHeader() {
    const cookies = await page.context().cookies();
    return cookies.map(c => `${c.name}=${c.value}`).join('; ');
  }

  static async fetchEmployees(limit = 10, offset = 0): Promise<EmployeeData[]> {
    const headers = { Cookie: await this.getCookieHeader() };
    const res = await page.request.get(
      `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=${limit}&offset=${offset}`,
      { headers }
    );
    if (res.status() !== 200) throw new Error(`Failed to fetch employees: ${res.status()}`);
    const body = await res.json();
    return body.data.map((emp: any) => ({
      employeeId: (emp.id||emp.employeeId).toString(),
      firstName: emp.firstName,
      lastName: emp.lastName
    }));
  }

  static async fetchEmployeePersonalDetailsFromUrl(): Promise<EmployeeData> {
    const url = page.url();

    // Extract empNumber from UI page URL
    const empNumberMatch = url.match(/viewPersonalDetails\/empNumber\/(\d+)/);
    if (!empNumberMatch) throw new Error('empNumber not found in URL');

    const empNumber = empNumberMatch[1];
    console.log('Extracted empNumber from URL:', empNumber);

    // Fetch personal details from API
    const headers = { Cookie: await this.getCookieHeader() };
    const res = await page.request.get(
      `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/${empNumber}/personal-details`,
      { headers }
    );

    if (res.status() !== 200) throw new Error(`Failed to fetch employee: ${res.status()}`);

    const body = await res.json();
    console.log('API Response Body:', JSON.stringify(body, null, 2));

    return {
      employeeId: body.data.employeeId || body.data.id,
      firstName: body.data.firstName,
      middleName: body.data.middleName || "",
      lastName: body.data.lastName,
      gender: body.data.gender,
      maritalStatus: body.data.maritalStatus,
      nationality: body.data.nationality,
      birthday: body.data.birthday,
      drivingLicenseNo: body.data.drivingLicenseNo,
      drivingLicenseExpiredDate: body.data.drivingLicenseExpiredDate
    };
  }
}