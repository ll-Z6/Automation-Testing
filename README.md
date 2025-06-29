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
│   │   │   └── petstore/
│   │   └── performance/        # Performance & stress test cases
│   │       ├── saucedemo/
│   │       └── petstore/
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
```

## Core Features
- **Functional Testing**: E2E flows for login, checkout, product sorting, API validation, etc.
- **Performance & Stress Testing**: Page load, API response, rapid user actions, concurrency, and memory pressure.
- **Data-driven**: Fixtures for stable data, dynamic fetching for volatile data.
- **Separation of Concerns**: Different configs, reports, and CI for functional vs. performance.
- **CI/CD Integration**: Automated pipelines for both test types, with reporting and GitHub issue creation on failure.

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

#### Open Cypress Interactive Runner
```bash
npx cypress open
```

## CI Pipeline Usage

### GitHub Actions
- **Functional Tests**: Triggered on push or pull request to `main` or `develop` branches.
- **Performance Tests**: Triggered on push to `main`, or manually, or automatically once a year (January 1st, 2:00 AM UTC).

### How to Run CI Manually
- Go to the **Actions** tab in your GitHub repository.
- Select the workflow (`Functional Tests` or `Performance Tests`).
- Click **Run workflow** to trigger manually.

### Viewing Test Results
- After each CI run, reports are uploaded as artifacts.
- Navigate to the workflow run in GitHub Actions.
- Download the `functional-test-results` or `performance-test-results` artifact for full HTML/JSON reports, videos, and screenshots.
- For PRs, a summary and report link are auto-commented on the PR.

## Troubleshooting
- If tests fail due to network or environment instability, review the logs and screenshots in the results folders.
- For performance test failures, check the thresholds in `cypress/e2e/performance/*` and adjust if needed.
- For CI/CD issues, review the workflow YAML files in `.github/workflows/`.

---

**Happy Testing!** 