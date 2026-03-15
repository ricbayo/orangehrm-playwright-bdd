const fs = require('fs');
const nodemailer = require('nodemailer');

(async () => {
  // Read Playwright JSON results
  const results = JSON.parse(fs.readFileSync('reports/json-report/results.json', 'utf-8'));
  const total = results.stats?.total || 0;
  const passed = results.stats?.passed || 0;
  const failed = results.stats?.failed || 0;

  // SMTP transporter (Gmail example)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email message
  let message = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `Playwright CI Report - ${new Date().toLocaleString()}`,
    text: `Total tests: ${total}\nPassed: ${passed}\nFailed: ${failed}\n`,
    attachments: [
      { path: 'reports/html-report/index.html' }
    ]
  };

  await transporter.sendMail(message);
  console.log('Email sent successfully!');
})();