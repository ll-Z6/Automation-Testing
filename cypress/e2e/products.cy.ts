describe('SauceDemo Products Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
        cy.login('standard_user', 'secret_sauce');
    });

    describe('Product Sorting', () => {
        it('should sort products by price low to high', () => {
            cy.get('.product_sort_container').select('lohi');
            cy.get('.inventory_item_price').then($prices => {
                const prices = $prices.map((_, el) => parseFloat(el.innerText.replace('$', ''))).get();
                const sortedPrices = [...prices].sort((a, b) => a - b);
                expect(prices).to.deep.equal(sortedPrices);
            });
        });

        it('should handle all sorting options', () => {
            const sortOptions = [
                { value: 'az', description: 'Name A to Z' },
                { value: 'za', description: 'Name Z to A' },
                { value: 'hilo', description: 'Price high to low' }
            ];

            sortOptions.forEach((option) => {
                cy.get('.product_sort_container').select(option.value);
                cy.get('.product_sort_container').should('have.value', option.value);
                cy.get('.inventory_item').should('have.length.greaterThan', 0);
            });
        });
    });

    describe('Shopping Cart Operations', () => {
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

        it('should handle multiple products in cart', () => {
            cy.get('.inventory_item_name').then($products => {
                const productNames = [];
                for (let i = 0; i < Math.min(3, $products.length); i++) {
                    productNames.push($products.eq(i).text());
                }

                productNames.forEach((productName) => {
                    cy.addToCart(productName);
                });

                cy.get('.shopping_cart_badge').should('contain', productNames.length.toString());
            });
        });

        it('should handle cart state persistence', () => {
            cy.get('.inventory_item_name').first().invoke('text').then((productName) => {
                cy.addToCart(productName);
                cy.get('.shopping_cart_badge').should('contain', '1');
                
                cy.reload();
                cy.get('.shopping_cart_badge').should('contain', '1');
                
                const removeButtonSelector = `[data-test="remove-${productName.toLowerCase().replace(/\s+/g, '-')}"]`;
                cy.get(removeButtonSelector).should('be.visible');
            });
        });
    });
}); 