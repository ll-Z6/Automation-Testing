describe('SauceDemo Products Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
        cy.login('standard_user', 'secret_sauce');
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
        cy.get('.inventory_item_name').first().invoke('text').then((productName) => {
            cy.addToCart(productName);
            cy.get('.shopping_cart_badge').should('contain', '1');
        });
    });

    it('should remove product from cart', () => {
        cy.get('.inventory_item_name').first().invoke('text').then((productName) => {
            cy.addToCart(productName);
            cy.get('.shopping_cart_badge').should('contain', '1');
            const removeButtonSelector = `[data-test="remove-${productName.toLowerCase().replace(/\s+/g, '-')}"]`;
            cy.get(removeButtonSelector).click();
            cy.get('.shopping_cart_badge').should('not.exist');
        });
    });
}); 