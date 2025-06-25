"use strict";
/// <reference types="cypress" />
describe('SauceDemo Login Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
    });
    it('should login with valid credentials', () => {
        cy.login('standard_user', 'secret_sauce');
        cy.url().should('include', '/inventory.html');
    });
    it('should display error with invalid credentials', () => {
        cy.login('invalid_user', 'wrong_password');
        cy.get('[data-test="error"]').should('be.visible');
    });
    it('should lock out locked user', () => {
        cy.login('locked_out_user', 'secret_sauce');
        cy.get('[data-test="error"]').should('contain', 'Epic sadface: Sorry, this user has been locked out.');
    });
});
