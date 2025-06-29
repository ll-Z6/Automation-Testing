import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configure reports for performance tests
      config.reporter = 'cypress-multi-reporters'
      config.reporterOptions = {
        reporterEnabled: 'mochawesome, mocha-junit-reporter',
        mochawesomeReporterOptions: {
          reportDir: 'results/performance',
          overwrite: false,
          html: true,
          json: true,
          charts: true
        },
        mochaJunitReporterReporterOptions: {
          mochaFile: 'results/performance/junit.xml',
          outputs: true,
          testCaseSwitchClassnameAndName: false
        }
      }
      return config
    },
    // Performance test specific configuration
    specPattern: "cypress/e2e/performance/**/*.cy.ts",
    supportFile: 'cypress/support/e2e.ts',
    videosFolder: "cypress/videos/performance",
    screenshotsFolder: "cypress/screenshots/performance",
    // Performance tests need longer timeout
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 90000,
    // Performance test configuration
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    baseUrl: 'https://www.saucedemo.com',
    experimentalModifyObstructiveThirdPartyCode: true,
    // Performance test retry mechanism
    retries: {
      runMode: 1,
      openMode: 0
    },
    env: {
      testType: 'performance'
    },
    // Performance test report configuration
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'mochawesome, mocha-junit-reporter',
      mochawesomeReporterOptions: {
        reportDir: 'results/performance',
        overwrite: false,
        html: true,
        json: true,
        charts: true
      },
      mochaJunitReporterReporterOptions: {
        mochaFile: 'results/performance/junit.xml',
        outputs: true,
        testCaseSwitchClassnameAndName: false
      }
    }
  },
  // Global configuration
  requestTimeout: 15000,
  responseTimeout: 15000,
  pageLoadTimeout: 60000
}); 