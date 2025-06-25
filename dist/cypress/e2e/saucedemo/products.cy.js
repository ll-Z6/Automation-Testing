"use strict";
/// <reference types="cypress" />
describe('SauceDemo Products Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
        cy.login('standard_user', 'secret_sauce');
    });
    it('should display products correctly', () => {
        cy.get('.inventory_item').should('have.length', 6);
    });
    it('should sort products by price low to high', () => {
        cy.get('.product_sort_container').select('lohi');
        cy.get('.inventory_item_price').then($prices => {
            const prices = $prices.map((_, el) => parseFloat(el.innerText.replace('$', ''))).get();
            const sortedPrices = [...prices].sort((a, b) => a - b);
            expect(prices).to.deep.equal(sortedPrices);
        });
    });
    it('should add product to cart', () => {
        cy.addToCart('Sauce Labs Backpack');
        cy.get('.shopping_cart_badge').should('contain', '1');
    });
});
