# Cypress Automation Project

## Project Overview

This project is an automated testing framework for web applications, using [Cypress](https://www.cypress.io/). It covers functional E2E testing for **SauceDemo** and API testing for **PetStore**. The framework supports:

- Functional E2E tests for critical user flows
- API testing for backend services
- Data-driven testing and best practices
- Automated CI/CD pipelines with GitHub Actions

## Directory Structure

```
cypress-automation-project/
├── cypress/
│   ├── e2e/                    # E2E functional test cases
│   │   ├── login.cy.ts
│   │   ├── products.cy.ts
│   │   └── checkout.cy.ts
│   ├── api/                    # API test cases
│   │   └── store.cy.ts
│   ├── fixtures/               # Test data
│   ├── support/                # Custom commands & page objects
│   ├── screenshots/
│   ├── downloads/
│   └── videos/
├── results/                    # Test reports
├── cypress.config.e2e.ts       # E2E test config
├── cypress.config.api.ts       # API test config
├── package.json
├── tsconfig.json
└── .github/workflows/          # CI/CD workflows
    └── functional-tests.yml
```

## Core Features

### Functional Testing
- **SauceDemo**: Login validation, product sorting/filtering, checkout flow
- **Data-driven**: Dynamic test data with fixtures and API responses

### API Testing
- **PetStore**: API testing, store operations, data validation
- **RESTful APIs**: Comprehensive endpoint testing and validation

### Test Organization
- **Modular Structure**: Organized by application and test type (E2E and API)
- **Reusable Components**: Shared fixtures, commands, and page objects

## Security Notes

> **Important**: In production environments, user credentials should be set as environment variables rather than hardcoded in test files or fixtures. The current setup uses demo credentials for testing purposes only.

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or above recommended)
- [npm](https://www.npmjs.com/)

### 2. Install Dependencies
```bash
npm ci
```

### 3. Run Tests Locally

#### E2E Tests
```bash
npm run test:e2e
```

#### API Tests
```bash
npm run test:api
```

#### Open Cypress Interactive Runner
```bash
npm run test:ui
```

#### Generate Reports
```bash
# Generate functional test reports
npm run report:functional

# Generate API test reports
npm run report:api
```

## CI Pipeline Usage

### GitHub Actions Workflows

#### Functional Tests (`functional-tests.yml`)
- **Trigger**: Push or pull request to `main` or `develop` branches
- **Purpose**: Validate application functionality and user flows, API endpoints
- **Reports**: Mochawesome HTML reports and JUnit XML for CI integration



### How to Run CI Manually
1. Go to the **Actions** tab in your GitHub repository
2. Select the workflow (`Functional Tests`)
3. Click **Run workflow** to trigger manually

### Viewing Test Results
- **CI Artifacts**: Download `e2e-test-results` and `api-test-results` from workflow runs
- **Local Reports**: Check `results/functional/` and `results/api/` directories
- **PR Integration**: Automatic summary and report links posted on pull requests
- **Failure Handling**: GitHub issues automatically created for failed tests

## Test Coverage

### SauceDemo Application
- **E2E**: Login validation, product management, checkout process

### PetStore Application
- **API**: Store operations, data validation, endpoint testing

## Troubleshooting

### Common Issues
- **Network Timeouts**: Check internet connection and target application availability
- **CI/CD Issues**: Verify workflow YAML configurations and environment variables

---

**Thanks For Your Review!!!** 