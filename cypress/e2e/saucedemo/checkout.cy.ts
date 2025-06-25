/// <reference types="cypress" />

describe('SauceDemo Checkout Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
        cy.login('standard_user', 'secret_sauce');
        cy.addToCart('Sauce Labs Backpack');
        cy.get('.shopping_cart_link').click();
    });

    it('should complete checkout process', () => {
        cy.get('[data-test="checkout"]').click();
        cy.fillCheckoutInfo('John', 'Doe', '12345');
        cy.get('[data-test="continue"]').click();
        cy.get('[data-test="finish"]').click();
        cy.get('.complete-header').should('contain', 'Thank you for your order!');
    });

    it('should validate required fields', () => {
        cy.get('[data-test="checkout"]').click();
        cy.get('[data-test="continue"]').click();
        cy.get('[data-test="error"]').should('contain', 'First Name is required');
    });
}); 