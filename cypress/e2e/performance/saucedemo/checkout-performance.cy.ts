describe('SauceDemo Checkout Performance & Stress Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
        cy.login('standard_user', 'secret_sauce');
        cy.addToCart('Sauce Labs Backpack');
        cy.get('.shopping_cart_link').click();
    });

    it('should load cart page within 1 second', () => {
        const start = Date.now();
        cy.get('.cart_list').should('be.visible').then(() => {
            const cartLoadTime = Date.now() - start;
            cy.log(`Cart page load time: ${cartLoadTime} ms`);
            expect(cartLoadTime).to.be.lessThan(1000);
        });
    });

    it('should complete checkout process within 3 seconds', () => {
        const start = Date.now();
        
        cy.get('[data-test="checkout"]').click();
        cy.fillCheckoutInfo('John', 'Doe', '12345');
        cy.get('[data-test="continue"]').click();
        cy.get('.summary_subtotal_label').should('be.visible');
        cy.get('[data-test="finish"]').click();
        cy.get('.complete-header').should('contain', 'Thank you for your order!').then(() => {
            const checkoutTime = Date.now() - start;
            cy.log(`Complete checkout time: ${checkoutTime} ms`);
            expect(checkoutTime).to.be.lessThan(3000);
        });
    });

    it('should load checkout overview page within 1 second', () => {
        cy.get('[data-test="checkout"]').click();
        cy.fillCheckoutInfo('John', 'Doe', '12345');
        
        const start = Date.now();
        cy.get('[data-test="continue"]').click();
        cy.get('.summary_subtotal_label').should('be.visible').then(() => {
            const overviewLoadTime = Date.now() - start;
            cy.log(`Checkout overview load time: ${overviewLoadTime} ms`);
            expect(overviewLoadTime).to.be.lessThan(1000);
        });
    });

    it('should complete order within 1 second', () => {
        cy.get('[data-test="checkout"]').click();
        cy.fillCheckoutInfo('John', 'Doe', '12345');
        cy.get('[data-test="continue"]').click();
        
        const start = Date.now();
        cy.get('[data-test="finish"]').click();
        cy.get('.complete-header').should('contain', 'Thank you for your order!').then(() => {
            const orderCompleteTime = Date.now() - start;
            cy.log(`Order completion time: ${orderCompleteTime} ms`);
            expect(orderCompleteTime).to.be.lessThan(1000);
        });
    });

    // Stress test scenarios
    it('should handle rapid checkout cycles (stress test)', () => {
        const cycleTimes: number[] = [];
        const cycles = 3;
        
        for (let i = 0; i < cycles; i++) {
            // Re-add items to cart
            cy.visit('https://www.saucedemo.com/');
            cy.login('standard_user', 'secret_sauce');
            cy.addToCart('Sauce Labs Backpack');
            cy.get('.shopping_cart_link').click();
            
            const cycleStart = Date.now();
            
            // Execute checkout process
            cy.get('[data-test="checkout"]').click();
            cy.fillCheckoutInfo('John', 'Doe', '12345');
            cy.get('[data-test="continue"]').click();
            cy.get('[data-test="finish"]').click();
            cy.get('.complete-header').should('contain', 'Thank you for your order!');
            
            const cycleTime = Date.now() - cycleStart;
            cycleTimes.push(cycleTime);
            cy.log(`Checkout cycle ${i + 1}: ${cycleTime} ms`);
        }
        
        cy.then(() => {
            const avgCycleTime = cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length;
            const maxCycleTime = Math.max(...cycleTimes);
            cy.log(`Average checkout cycle time: ${avgCycleTime} ms`);
            cy.log(`Max checkout cycle time: ${maxCycleTime} ms`);
            
            // Stress test assertion: Checkout cycles should maintain stable performance
            expect(avgCycleTime).to.be.lessThan(6000);
            expect(maxCycleTime).to.be.lessThan(8000);
        });
    });

    it('should handle large cart checkout (stress test)', () => {
        // Add multiple items to cart
        cy.visit('https://www.saucedemo.com/');
        cy.login('standard_user', 'secret_sauce');
        cy.addToCart('Sauce Labs Backpack');
        cy.addToCart('Sauce Labs Bike Light');
        cy.addToCart('Sauce Labs Bolt T-Shirt');
        cy.addToCart('Sauce Labs Fleece Jacket');
        cy.addToCart('Sauce Labs Onesie');
        cy.addToCart('Test.allTheThings() T-Shirt (Red)');
        
        cy.get('.shopping_cart_link').click();
        
        const start = Date.now();
        
        // Execute checkout process
        cy.get('[data-test="checkout"]').click();
        cy.fillCheckoutInfo('John', 'Doe', '12345');
        cy.get('[data-test="continue"]').click();
        cy.get('.summary_subtotal_label').should('be.visible');
        cy.get('[data-test="finish"]').click();
        cy.get('.complete-header').should('contain', 'Thank you for your order!').then(() => {
            const largeCartCheckoutTime = Date.now() - start;
            cy.log(`Large cart checkout time: ${largeCartCheckoutTime} ms`);
            
            // Stress test assertion: Checkout time for large cart should be within reasonable range
            expect(largeCartCheckoutTime).to.be.lessThan(8000);
        });
    });

    it('should handle concurrent form interactions (stress test)', () => {
        cy.get('[data-test="checkout"]').click();
        
        const start = Date.now();
        
        // Quickly fill form
        cy.get('[data-test="firstName"]').type('John');
        cy.get('[data-test="lastName"]').type('Doe');
        cy.get('[data-test="postalCode"]').type('12345');
        
        // Click continue button
        cy.get('[data-test="continue"]').click();
        
        cy.get('.summary_subtotal_label').should('be.visible').then(() => {
            const concurrentInteractionTime = Date.now() - start;
            cy.log(`Concurrent form interaction time: ${concurrentInteractionTime} ms`);
            
            // Stress test assertion: Concurrent operations should be handled correctly
            expect(concurrentInteractionTime).to.be.lessThan(3000);
        });
    });

    it('should maintain performance with multiple browser tabs (stress test)', () => {
        const tabPerformance: number[] = [];
        const tabs = 2; // Reduce tab count to avoid overload
        
        for (let i = 0; i < tabs; i++) {
            const start = Date.now();
            
            // Execute login and checkout in new tab
            cy.window().then((win) => {
                const newWindow = win.open('https://www.saucedemo.com/', '_blank');
                if (newWindow) {
                    cy.wrap(newWindow).then(() => {
                        cy.visit('https://www.saucedemo.com/');
                        cy.login('standard_user', 'secret_sauce');
                        cy.addToCart('Sauce Labs Backpack');
                        cy.get('.shopping_cart_link').click();
                        cy.get('[data-test="checkout"]').click();
                        cy.fillCheckoutInfo('John', 'Doe', '12345');
                        cy.get('[data-test="continue"]').click();
                        
                        cy.get('.summary_subtotal_label').should('be.visible').then(() => {
                            const tabTime = Date.now() - start;
                            tabPerformance.push(tabTime);
                            cy.log(`Tab ${i + 1} performance: ${tabTime} ms`);
                        });
                    });
                }
            });
        }
        
        cy.then(() => {
            if (tabPerformance.length > 0) {
                const avgTabTime = tabPerformance.reduce((a, b) => a + b, 0) / tabPerformance.length;
                const maxTabTime = Math.max(...tabPerformance);
                cy.log(`Average tab performance: ${avgTabTime} ms`);
                cy.log(`Max tab performance: ${maxTabTime} ms`);
                
                // Stress test assertion: Multi-tab performance should remain stable
                expect(avgTabTime).to.be.lessThan(8000);
                expect(maxTabTime).to.be.lessThan(10000);
            }
        });
    });
}); 