/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            login(username: string, password: string): Chainable<Element>;
            addToCart(productName: string): Chainable<Element>;
            fillCheckoutInfo(firstName: string, lastName: string, zipCode: string): Chainable<Element>;
        }
    }
}

Cypress.Commands.add('login', (username: string, password: string) => {
    cy.get('[data-test="username"]').type(username);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
});

Cypress.Commands.add('addToCart', (productName: string) => {
    cy.contains('.inventory_item', productName).find('button').click();
});

Cypress.Commands.add('fillCheckoutInfo', (firstName: string, lastName: string, zipCode: string) => {
    cy.get('[data-test="firstName"]').type(firstName);
    cy.get('[data-test="lastName"]').type(lastName);
    cy.get('[data-test="postalCode"]').type(zipCode);
});

export {}; 