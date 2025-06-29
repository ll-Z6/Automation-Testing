describe('SauceDemo Checkout Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
        cy.login('standard_user', 'secret_sauce');
        cy.addToCart('Sauce Labs Backpack');
        cy.get('.shopping_cart_link').click();
    });

    it('should complete checkout process', () => {
        cy.fixture('checkout').then((checkoutData) => {
            const customer = checkoutData.customers[0]; // Use first customer
            
            // Get product price dynamically
            let productPrice: number;
            cy.get('.inventory_item_price').invoke('text').then(priceText => {
                productPrice = parseFloat(priceText.replace('$', ''));
            });

            cy.get('[data-test="checkout"]').click();
            cy.fillCheckoutInfo(customer.firstName, customer.lastName, customer.zipCode);
            cy.get('[data-test="continue"]').click();

            // Verify order summary with dynamic values
            cy.get('.cart_item').should('have.length', 1);
            
            // Verify subtotal matches product price
            cy.get('.summary_subtotal_label').invoke('text').then(subtotalText => {
                const subtotal = parseFloat(subtotalText.replace('Item total: $', ''));
                expect(subtotal).to.equal(productPrice);
            });

            // Verify total is greater than subtotal (includes tax)
            cy.get('.summary_total_label').invoke('text').then(totalText => {
                const total = parseFloat(totalText.replace('Total: $', ''));
                expect(total).to.be.greaterThan(productPrice);
            });

            // Complete order
            cy.get('[data-test="finish"]').click();
            cy.get('.complete-header').should('contain', 'Thank you for your order!');
        });
    });

    it('should validate required fields', () => {
        cy.fixture('checkout').then((checkoutData) => {
            const errorMessage = checkoutData.validationMessages.firstNameRequired;
            
            cy.get('[data-test="checkout"]').click();
            cy.get('[data-test="continue"]').click();
            cy.get('[data-test="error"]').should('contain', errorMessage);
        });
    });
}); 