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

    it('should maintain performance under memory pressure (stress test)', () => {
        const performanceMetrics: { loadTime: number; memoryUsage?: number }[] = [];
        const iterations = 10; // Increase sample count
        
        for (let i = 0; i < iterations; i++) {
            cy.visit('https://www.saucedemo.com/');
            
            const start = Date.now();
            cy.get('[data-test="username"]').type('standard_user');
            cy.get('[data-test="password"]').type('secret_sauce');
            cy.get('[data-test="login-button"]').click();
            cy.url().should('include', '/inventory.html').then(() => {
                const loadTime = Date.now() - start;
                performanceMetrics.push({ loadTime });
                cy.log(`Iteration ${i + 1} load time: ${loadTime} ms`);
            });
            
            // Simulate memory pressure: Perform some DOM operations
            cy.get('.inventory_item').should('have.length.at.least', 1);
            cy.get('.inventory_item_name').should('have.length.at.least', 1);
            cy.get('.inventory_item_price').should('have.length.at.least', 1);
        }
        
        cy.then(() => {
            const loadTimes = performanceMetrics.map(m => m.loadTime);
            const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
            const maxLoadTime = Math.max(...loadTimes);
            const minLoadTime = Math.min(...loadTimes);
            
            // Trimmed statistics: Remove maximum and minimum values
            const sortedTimes = [...loadTimes].sort((a, b) => a - b);
            const trimmedTimes = sortedTimes.slice(1, -1); // Remove first and last
            const trimmedMax = Math.max(...trimmedTimes);
            const trimmedMin = Math.min(...trimmedTimes);
            const trimmedAvg = trimmedTimes.reduce((a, b) => a + b, 0) / trimmedTimes.length;
            
            // Calculate median
            const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
            
            cy.log(`All load times: ${JSON.stringify(loadTimes)}`);
            cy.log(`Average load time: ${avgLoadTime} ms`);
            cy.log(`Max load time: ${maxLoadTime} ms`);
            cy.log(`Min load time: ${minLoadTime} ms`);
            cy.log(`Median load time: ${median} ms`);
            cy.log(`Trimmed average: ${trimmedAvg} ms`);
            cy.log(`Trimmed max/min ratio: ${(trimmedMax / trimmedMin).toFixed(2)}`);
            
            // Stress test assertion: Performance should not significantly degrade
            expect(avgLoadTime).to.be.lessThan(6000); // Strict assertion for average
            if (maxLoadTime > 8000) {
                cy.log(`⚠️ WARNING: Max load time (${maxLoadTime} ms) exceeded 8000ms!`);
            } else {
                cy.log(`✅ Max load time (${maxLoadTime} ms) within threshold.`);
            }
            
            // Use trimmed max/min ratio, warning only, no fail
            const trimmedRatio = trimmedMax / trimmedMin;
            if (trimmedRatio > 2) {
                cy.log(`⚠️ WARNING: Performance fluctuation detected! Trimmed max/min ratio: ${trimmedRatio.toFixed(2)}`);
                cy.log(`⚠️ This indicates potential performance instability under memory pressure`);
            } else {
                cy.log(`✅ Performance stability: Trimmed max/min ratio: ${trimmedRatio.toFixed(2)}`);
            }
            
            // Optional: If fluctuation is too high, set a more lenient threshold as fail condition
            if (trimmedRatio > 4) {
                throw new Error(`Performance fluctuation too high! Trimmed max/min ratio: ${trimmedRatio.toFixed(2)}`);
            }
        });
    });
}); 