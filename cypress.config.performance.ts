import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
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
    // JUnit reporter configuration
    reporter: 'mocha-junit-reporter',
    reporterOptions: {
      mochaFile: 'results/junit/performance-test-results-[hash].xml',
      toConsole: true
    },
    env: {
      testType: 'performance'
    }
  },
  // Global configuration
  requestTimeout: 15000,
  responseTimeout: 15000,
  pageLoadTimeout: 60000
}); 