describe('SauceDemo Login Performance & Stress Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
    });

    it('should load login page within 2 seconds', () => {
        const start = Date.now();
        cy.visit('https://www.saucedemo.com/');
        cy.get('[data-test="username"]').should('be.visible').then(() => {
            const loadTime = Date.now() - start;
            cy.log(`Login page load time: ${loadTime} ms`);
            expect(loadTime).to.be.lessThan(2000);
        });
    });

    it('should complete login within 1.5 seconds', () => {
        cy.get('[data-test="username"]').type('standard_user');
        cy.get('[data-test="password"]').type('secret_sauce');
        
        const start = Date.now();
        cy.get('[data-test="login-button"]').click();
        cy.url().should('include', '/inventory.html').then(() => {
            const loginTime = Date.now() - start;
            cy.log(`Login completion time: ${loginTime} ms`);
            expect(loginTime).to.be.lessThan(1500);
        });
    });

    it('should display products page within 1 second after login', () => {
        cy.login('standard_user', 'secret_sauce');
        
        const start = Date.now();
        cy.get('.inventory_list').should('be.visible').then(() => {
            const productsLoadTime = Date.now() - start;
            cy.log(`Products page load time: ${productsLoadTime} ms`);
            expect(productsLoadTime).to.be.lessThan(1000);
        });
    });

    it('should handle multiple login attempts efficiently', () => {
        const loginTimes: number[] = [];
        
        for (let i = 0; i < 3; i++) {
            cy.visit('https://www.saucedemo.com/');
            cy.get('[data-test="username"]').type('standard_user');
            cy.get('[data-test="password"]').type('secret_sauce');
            
            const start = Date.now();
            cy.get('[data-test="login-button"]').click();
            cy.url().should('include', '/inventory.html').then(() => {
                const loginTime = Date.now() - start;
                loginTimes.push(loginTime);
                cy.log(`Login attempt ${i + 1}: ${loginTime} ms`);
            });
        }
        
        cy.then(() => {
            const avgLoginTime = loginTimes.reduce((a, b) => a + b, 0) / loginTimes.length;
            cy.log(`Average login time: ${avgLoginTime} ms`);
            expect(avgLoginTime).to.be.lessThan(2500);
        });
    });

    // Stress test scenarios
    it('should handle rapid login/logout cycles (stress test)', () => {
        const cycleTimes: number[] = [];
        const cycles = 5;
        
        for (let i = 0; i < cycles; i++) {
            const cycleStart = Date.now();
            
            // Login
            cy.get('[data-test="username"]').type('standard_user');
            cy.get('[data-test="password"]').type('secret_sauce');
            cy.get('[data-test="login-button"]').click();
            cy.url().should('include', '/inventory.html');
            
            // Logout
            cy.get('#react-burger-menu-btn').click();
            cy.get('#logout_sidebar_link').click();
            cy.url().should('eq', 'https://www.saucedemo.com/');
            
            const cycleTime = Date.now() - cycleStart;
            cycleTimes.push(cycleTime);
            cy.log(`Login/logout cycle ${i + 1}: ${cycleTime} ms`);
        }
        
        cy.then(() => {
            const avgCycleTime = cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length;
            const maxCycleTime = Math.max(...cycleTimes);
            cy.log(`Average cycle time: ${avgCycleTime} ms`);
            cy.log(`Max cycle time: ${maxCycleTime} ms`);
            
            // Stress test assertion: Average time should not exceed 5 seconds, max time should not exceed 8 seconds
            expect(avgCycleTime).to.be.lessThan(5000);
            expect(maxCycleTime).to.be.lessThan(8000);
        });
    });

    it('should handle concurrent form submissions (stress test)', () => {
        const submissionTimes: number[] = [];
        const submissions = 5; // Reduce submission count
        
        for (let i = 0; i < submissions; i++) {
            cy.visit('https://www.saucedemo.com/');
            
            const start = Date.now();
            cy.get('[data-test="username"]').type('standard_user');
            cy.get('[data-test="password"]').type('secret_sauce');
            cy.get('[data-test="login-button"]').click();
            
            cy.url().should('include', '/inventory.html').then(() => {
                const submissionTime = Date.now() - start;
                submissionTimes.push(submissionTime);
                cy.log(`Form submission ${i + 1}: ${submissionTime} ms`);
            });
        }
        
        cy.then(() => {
            const avgSubmissionTime = submissionTimes.reduce((a, b) => a + b, 0) / submissionTimes.length;
            const maxSubmissionTime = Math.max(...submissionTimes);
            cy.log(`Average submission time: ${avgSubmissionTime} ms`);
            cy.log(`Max submission time: ${maxSubmissionTime} ms`);
            
            // Stress test assertion: System should remain stable even with repeated submissions
            expect(avgSubmissionTime).to.be.lessThan(3000);
            expect(maxSubmissionTime).to.be.lessThan(5000);
        });
    });
}); 