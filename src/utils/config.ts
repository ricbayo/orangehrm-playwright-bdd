import dotenv from 'dotenv';
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL,
  adminUser: process.env.ADMIN_USER,
  adminPass: process.env.ADMIN_PASS
};