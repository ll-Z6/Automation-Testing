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

export {}; 