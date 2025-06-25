/// <reference types="cypress" />

describe('SauceDemo Login Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
    });

    it('should display login page elements', () => {
        cy.get('[data-test="username"]').should('be.visible');
        cy.get('[data-test="password"]').should('be.visible');
        cy.get('[data-test="login-button"]').should('be.visible');
    });

    it('should login with valid credentials (Happy Path)', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');
        cy.get('.inventory_list').should('be.visible');
    });

    it('should display error with invalid credentials (Sad Path)', () => {
        cy.login('invalid_user', 'wrong_password');
        cy.get('[data-test="error"]').should('be.visible').and('contain', 'Username and password do not match');
    });

    it('should lock out locked user', () => {
        cy.login('locked_out_user', 'secret_sauce');
        cy.get('[data-test="error"]').should('contain', 'Epic sadface: Sorry, this user has been locked out.');
    });
}); 