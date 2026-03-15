const nodemailer = require("nodemailer");
const fs = require("fs");

const reportFile = "reports/json-report/results.json";

let total = 0;
let passed = 0;
let failed = 0;
let flaky = 0;

if (fs.existsSync(reportFile)) {

  const report = JSON.parse(fs.readFileSync(reportFile));

  report.tests?.forEach((test: any) => {
    total++;

    if (test.status === "passed") passed++;
    if (test.status === "failed") failed++;

    if (test.results?.length > 1) flaky++;
  });
}

const html = `
<h2>Playwright Automation Test Report</h2>

<p><b>Total Tests:</b> ${total}</p>
<p><b>Passed:</b> ${passed}</p>
<p><b>Failed:</b> ${failed}</p>
<p><b>Flaky / Retries:</b> ${flaky}</p>

<h3>Failed Test Artifacts</h3>
<p>Screenshots and logs are available in the GitHub Actions artifacts.</p>

<p>View full report in GitHub Actions.</p>
`;

async function sendEmail() {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"Playwright CI" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_TO,
    subject: "Playwright Test Execution Report",
    html: html
  });

  console.log("Email sent successfully");
}

sendEmail();