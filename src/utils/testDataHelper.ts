// helpers/testDataHelper.ts
export class TestDataHelper {
  private static chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  // Generate random string of length between min and max
  static getRandomString(minLength: number = 3, maxLength: number = 9): string {
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
    }
    return result;
  }

  // Random first name with optional prefix
  static getFirstName(prefix: string = 'Test'): string {
    return `${prefix}${this.getRandomString()}`;
  }

  // Random last name with optional prefix
  static getLastName(prefix: string = 'User'): string {
    return `${prefix}${this.getRandomString()}`;
  }

  // Generate full random employee object
  static getRandomEmployee() {
    const firstName = this.getFirstName();
    const lastName = this.getLastName();
    const username = `user${this.getRandomString(3, 9)}`.toLowerCase();
    const email = `${username}@example.com`;
    return {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      username,
      email,
    };
  }
}