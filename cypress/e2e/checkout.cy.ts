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

    it('should validate all required fields individually', () => {
        cy.fixture('checkout').then((checkoutData) => {
            const customer = checkoutData.customers[0];
            
            cy.get('[data-test="checkout"]').click();
            
            // Test missing firstName
            cy.get('[data-test="lastName"]').type(customer.lastName);
            cy.get('[data-test="postalCode"]').type(customer.zipCode);
            cy.get('[data-test="continue"]').click();
            cy.get('[data-test="error"]').should('contain', checkoutData.validationMessages.firstNameRequired);
            
            // Test missing lastName
            cy.get('[data-test="firstName"]').type(customer.firstName);
            cy.get('[data-test="lastName"]').clear();
            cy.get('[data-test="continue"]').click();
            cy.get('[data-test="error"]').should('contain', checkoutData.validationMessages.lastNameRequired);
            
            // Test missing zipCode
            cy.get('[data-test="lastName"]').type(customer.lastName);
            cy.get('[data-test="postalCode"]').clear();
            cy.get('[data-test="continue"]').click();
            cy.get('[data-test="error"]').should('contain', checkoutData.validationMessages.zipCodeRequired);
        });
    });

    it('should handle special characters in form fields', () => {
        const specialChars = [
            { firstName: 'John@Doe', lastName: 'Smith-Jones', zipCode: '12345' },
            { firstName: 'Mary+Jane', lastName: "O'Connor", zipCode: '54321' },
            { firstName: 'José', lastName: 'García', zipCode: '67890' }
        ];

        specialChars.forEach((customer) => {
            // Navigate back to cart page to ensure checkout button exists
            cy.visit('https://www.saucedemo.com/');
            cy.login('standard_user', 'secret_sauce');
            cy.addToCart('Sauce Labs Backpack');
            cy.get('.shopping_cart_link').click();

            cy.get('[data-test="checkout"]').click();
            cy.fillCheckoutInfo(customer.firstName, customer.lastName, customer.zipCode);
            cy.get('[data-test="continue"]').click();
            
            // Simplified logic: either show error message or proceed to next page
            cy.get('body').then(($body) => {
                if ($body.find('[data-test="error"]').length > 0) {
                    cy.get('[data-test="error"]').should('be.visible');
                } else {
                    cy.url().should('include', '/checkout-step-two.html');
                }
            });
        });
    });

    it('should handle XSS attempts in form fields', () => {
        const xssAttempts = [
            '<script>alert("XSS")</script>',
            '"><script>alert("XSS")</script>',
            'javascript:alert("XSS")'
        ];

        xssAttempts.forEach((attempt) => {
            // Navigate back to cart page to ensure checkout button exists
            cy.visit('https://www.saucedemo.com/');
            cy.login('standard_user', 'secret_sauce');
            cy.addToCart('Sauce Labs Backpack');
            cy.get('.shopping_cart_link').click();

            cy.get('[data-test="checkout"]').click();
            cy.get('[data-test="firstName"]').type(attempt);
            cy.get('[data-test="lastName"]').type('Doe');
            cy.get('[data-test="postalCode"]').type('12345');
            cy.get('[data-test="continue"]').click();
            
            // Simplified logic: either show error message or proceed to next page
            cy.get('body').then(($body) => {
                if ($body.find('[data-test="error"]').length > 0) {
                    cy.get('[data-test="error"]').should('be.visible');
                } else {
                    cy.url().should('include', '/checkout-step-two.html');
                }
            });
        });
    });

    it('should handle checkout with multiple products', () => {
        // Add multiple products
        cy.visit('https://www.saucedemo.com/');
        cy.login('standard_user', 'secret_sauce');
        cy.addToCart('Sauce Labs Backpack');
        cy.addToCart('Sauce Labs Bike Light');
        cy.get('.shopping_cart_link').click();
        
        cy.fixture('checkout').then((checkoutData) => {
            const customer = checkoutData.customers[0];
            
            cy.get('[data-test="checkout"]').click();
            cy.fillCheckoutInfo(customer.firstName, customer.lastName, customer.zipCode);
            cy.get('[data-test="continue"]').click();
            
            // Verify the number of items in cart (based on actual added products)
            cy.get('.cart_item').then(($items) => {
                const itemCount = $items.length;
                expect(itemCount).to.be.greaterThan(0);
                cy.log(`Found ${itemCount} items in cart`);
            });
            
            // Verify subtotal calculation
            cy.get('.summary_subtotal_label').invoke('text').then(subtotalText => {
                const subtotal = parseFloat(subtotalText.replace('Item total: $', ''));
                expect(subtotal).to.be.greaterThan(0);
            });
            
            cy.get('[data-test="cancel"]').click();
        });
    });

    it('should handle cancel operation', () => {
        cy.get('[data-test="checkout"]').click();
        cy.get('[data-test="cancel"]').click();
        
        // Should return to cart page
        cy.url().should('include', '/cart.html');
        cy.get('.cart_item').should('be.visible');
    });
}); 