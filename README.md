# Cypress Automation Project

## Project Overview

This project is an automated testing framework for web applications, using [Cypress](https://www.cypress.io/). It covers both functional and performance (including stress) testing for two demo systems: **SauceDemo** and **PetStore**. The framework supports:

- Functional E2E tests for critical user flows
- Performance and stress tests for key scenarios
- Data-driven testing and best practices
- Separate configuration and reporting for functional and performance tests
- Automated CI/CD pipelines with GitHub Actions

## Directory Structure

```
cypress-automation-project/
├── cypress/
│   ├── e2e/
│   │   ├── functional/         # Functional test cases
│   │   │   ├── saucedemo/
│   │   │   │   ├── login.cy.ts
│   │   │   │   ├── products.cy.ts
│   │   │   │   └── checkout.cy.ts
│   │   │   └── petstore/
│   │   │       └── store.cy.ts
│   │   └── performance/        # Performance & stress test cases
│   │       ├── saucedemo/
│   │       │   ├── login-performance.cy.ts
│   │       │   └── checkout-performance.cy.ts
│   │       └── petstore/
│   │           └── api-performance.cy.ts
│   ├── fixtures/               # Test data
│   ├── support/                # Custom commands & page objects
│   ├── screenshots/
│   ├── downloads/
│   └── videos/
├── results/                    # Test reports
├── cypress.config.ts           # Base Cypress config
├── cypress.config.functional.ts# Functional test config
├── cypress.config.performance.ts# Performance test config
├── package.json
├── tsconfig.json
└── .github/workflows/          # CI/CD workflows
    ├── functional-tests.yml
    └── performance-tests.yml
```

## Core Features

### Functional Testing
- **SauceDemo**: Login validation, product sorting/filtering, checkout flow
- **PetStore**: API testing, store operations, data validation
- **Data-driven**: Dynamic test data with fixtures and API responses
- **Best Practices**: Page Object Model, custom commands, assertions

### Performance & Stress Testing
- **Page Load Performance**: Response time measurements and thresholds
- **API Performance**: Endpoint response times and throughput
- **Stress Testing**: Rapid user actions, concurrency, memory pressure
- **Threshold Monitoring**: Configurable performance baselines

### Test Organization
- **Separation of Concerns**: Different configs, reports, and CI for functional vs. performance
- **Modular Structure**: Organized by application and test type
- **Reusable Components**: Shared fixtures, commands, and page objects

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or above recommended)
- [npm](https://www.npmjs.com/)

### 2. Install Dependencies
```bash
npm ci
```

### 3. Run Tests Locally

#### Functional Tests
```bash
npm run test:functional
```
- Results: `results/functional/`, videos/screenshots in `cypress/videos/functional/` and `cypress/screenshots/functional/`

#### Performance & Stress Tests
```bash
npm run test:performance
```
- Results: `results/performance/`, videos/screenshots in `cypress/videos/performance/` and `cypress/screenshots/performance/`

#### All Tests
```bash
npm run test:all
```

#### Open Cypress Interactive Runner
```bash
npm run test:ui
```

#### Generate Reports
```bash
# Generate functional test reports
npm run report:functional

# Generate performance test reports
npm run report:performance
```

## CI Pipeline Usage

### GitHub Actions Workflows

#### Functional Tests (`functional-tests.yml`)
- **Trigger**: Push or pull request to `main` or `develop` branches
- **Purpose**: Validate application functionality and user flows
- **Reports**: Mochawesome HTML reports and JUnit XML for CI integration

#### Performance Tests (`performance-tests.yml`)
- **Trigger**: Push to `main`, manual trigger, or yearly schedule (January 1st, 2:00 AM UTC)
- **Purpose**: Monitor performance metrics and stress test scenarios
- **Reports**: Performance-specific reports with threshold analysis

### How to Run CI Manually
1. Go to the **Actions** tab in your GitHub repository
2. Select the workflow (`Functional Tests` or `Performance Tests`)
3. Click **Run workflow** to trigger manually

### Viewing Test Results
- **CI Artifacts**: Download `functional-test-results` or `performance-test-results` from workflow runs
- **Local Reports**: Check `results/functional/` and `results/performance/` directories
- **PR Integration**: Automatic summary and report links posted on pull requests
- **Failure Handling**: GitHub issues automatically created for failed performance tests

## Test Coverage

### SauceDemo Application
- **Functional**: Login validation, product management, checkout process
- **Performance**: Login flow performance, checkout stress testing

### PetStore Application
- **Functional**: API testing, store operations, data validation
- **Performance**: API endpoint performance, concurrent request handling

## Troubleshooting

### Common Issues
- **Network Timeouts**: Check internet connection and target application availability
- **Performance Failures**: Review thresholds in performance test files and adjust if needed
- **CI/CD Issues**: Verify workflow YAML configurations and environment variables

### Performance Test Adjustments
- Modify thresholds in `cypress/e2e/performance/*` files
- Adjust stress test parameters for different environments
- Update baseline metrics as application performance improves

### Report Generation
- Ensure `results/` directory exists before running report commands
- Check for sufficient disk space for video/screenshot storage
- Verify Mochawesome dependencies are properly installed

---

**Happy Testing! 🚀** 