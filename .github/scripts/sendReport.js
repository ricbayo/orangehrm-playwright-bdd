const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Paths
const htmlReportPath = path.join(__dirname, '../../reports/html-report/index.html');
const screenshotsDir = path.join(__dirname, '../../reports/screenshots');
const jsonReportPath = path.join(__dirname, '../../reports/json-report/results.json');

// Helper: get all screenshots
function getScreenshots() {
  if (!fs.existsSync(screenshotsDir)) return [];
  return fs.readdirSync(screenshotsDir).map(file => ({
    filename: file,
    path: path.join(screenshotsDir, file)
  }));
}

// Summary defaults
let summary = {
  total: 'N/A',
  passed: 'N/A',
  failed: 'N/A',
  skipped: 'N/A'
};

// Read JSON report if exists
if (fs.existsSync(jsonReportPath)) {
  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonReportPath, 'utf-8'));
    let passed = 0, failed = 0, skipped = 0, total = 0;

    jsonData.forEach(feature => {
      feature.elements.forEach(scenario => {
        total++;
        const scenarioFailed = scenario.steps.some(step => step.result.status === 'failed');
        if (scenarioFailed) failed++;
        else if (scenario.steps.every(step => step.result.status === 'passed')) passed++;
        else skipped++;
      });
    });

    summary = { total, passed, failed, skipped };
  } catch (err) {
    console.log('Error parsing JSON report:', err.message);
  }
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Compose message
const message = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_TO,
  subject: `Playwright CI Report - ${new Date().toLocaleString()}`,
  html: `
    <h2>Playwright Cucumber CI Report</h2>
    <p><strong>Total scenarios:</strong> ${summary.total}</p>
    <p><strong>Passed:</strong> ${summary.passed}</p>
    <p><strong>Failed:</strong> ${summary.failed}</p>
    <p><strong>Skipped:</strong> ${summary.skipped}</p>
    <p>See attached HTML report and screenshots.</p>
  `,
  attachments: [
    // HTML report
    fs.existsSync(htmlReportPath) && { filename: 'report.html', path: htmlReportPath },
    // All screenshots
    ...getScreenshots()
  ].filter(Boolean) // remove undefined
};

// Send email
transporter.sendMail(message, (err, info) => {
  if (err) {
    console.error('Error sending email:', err);
    process.exit(1);
  }
  console.log('Email sent successfully:', info.response);
});