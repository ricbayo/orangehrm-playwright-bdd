module.exports = {
  default: {
    paths: ["tests/**/*.feature"],
    require: ["src/steps/**/*.ts", "src/hooks/**/*.ts"],
    requireModule: ["ts-node/register"],
    format: ["progress", "html:reports/cucumber-report.html"],
    publishQuiet: true
  }
};