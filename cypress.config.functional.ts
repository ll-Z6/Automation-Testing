import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configure reports for functional tests
      config.reporter = 'cypress-multi-reporters'
      config.reporterOptions = {
        reporterEnabled: 'mochawesome, mocha-junit-reporter',
        mochawesomeReporterOptions: {
          reportDir: 'results/functional',
          overwrite: false,
          html: true,
          json: true,
          charts: true
        },
        mochaJunitReporterReporterOptions: {
          mochaFile: 'results/functional/junit.xml',
          outputs: true,
          testCaseSwitchClassnameAndName: false
        }
      }
      return config
    },
    // Functional test specific configuration
    specPattern: "cypress/e2e/functional/**/*.cy.ts",
    videosFolder: "cypress/videos/functional",
    screenshotsFolder: "cypress/screenshots/functional",
    // Functional test configuration
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 60000,
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    baseUrl: 'https://www.saucedemo.com',
    // Functional test retry mechanism
    retries: {
      runMode: 1,
      openMode: 0
    },
    // Functional test report configuration
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'mochawesome, mocha-junit-reporter',
      mochawesomeReporterOptions: {
        reportDir: 'results/functional',
        overwrite: false,
        html: true,
        json: true,
        charts: true
      },
      mochaJunitReporterReporterOptions: {
        mochaFile: 'results/functional/junit.xml',
        outputs: true,
        testCaseSwitchClassnameAndName: false
      }
    },
    env: {
      testType: 'functional'
    },
    supportFile: 'cypress/support/e2e.ts'
  },
  // Global configuration
  requestTimeout: 10000,
  responseTimeout: 10000,
  pageLoadTimeout: 60000
}); 