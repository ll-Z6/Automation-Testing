"use strict";
/// <reference types="cypress" />
Object.defineProperty(exports, "__esModule", { value: true });
Cypress.Commands.add('login', (username, password) => {
    cy.get('[data-test="username"]').type(username);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
});
Cypress.Commands.add('addToCart', (productName) => {
    cy.contains('.inventory_item', productName).find('button').click();
});
Cypress.Commands.add('fillCheckoutInfo', (firstName, lastName, zipCode) => {
    cy.get('[data-test="firstName"]').type(firstName);
    cy.get('[data-test="lastName"]').type(lastName);
    cy.get('[data-test="postalCode"]').type(zipCode);
});
