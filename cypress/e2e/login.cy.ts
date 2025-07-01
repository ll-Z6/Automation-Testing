describe('SauceDemo Login Tests', () => {
    // Note: In real production environment, user credentials should be set as environment variables
    // instead of hardcoded in test files or fixtures
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/');
    });

    it('should login with valid users', () => {
        cy.fixture('users').then((userData) => {
            userData.validUsers.forEach((user: any) => {
                cy.visit('https://www.saucedemo.com/');
                cy.login(user.username, user.password);
                cy.url().should('include', '/inventory.html');
                cy.get('.inventory_list').should('be.visible');
            });
        });
    });

    it('should display error with invalid credentials', () => {
        cy.fixture('users').then((userData) => {
            const invalidUser = userData.invalidCredentials;
            cy.login(invalidUser.username, invalidUser.password);
            cy.get('[data-test="error"]').should('be.visible');
        });
    });

    it('should lock out locked user', () => {
        cy.fixture('users').then((userData) => {
            const lockedUser = userData.lockedUser;
            cy.login(lockedUser.username, lockedUser.password);
            cy.get('[data-test="error"]').should('contain', 'locked out');
        });
    });

    it('should display error with empty username', () => {
        cy.get('[data-test="password"]').type('secret_sauce');
        cy.get('[data-test="login-button"]').click();
        cy.get('[data-test="error"]').should('contain', 'Username is required');
    });

    it('should display error with empty password', () => {
        cy.get('[data-test="username"]').type('standard_user');
        cy.get('[data-test="login-button"]').click();
        cy.get('[data-test="error"]').should('contain', 'Password is required');
    });

    it('should handle empty credentials', () => {
        cy.get('[data-test="login-button"]').click();
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('should handle SQL injection attempts', () => {
        const sqlInjectionAttempts = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "admin'--"
        ];

        sqlInjectionAttempts.forEach((attempt) => {
            cy.visit('https://www.saucedemo.com/');
            cy.get('[data-test="username"]').type(attempt);
            cy.get('[data-test="password"]').type('secret_sauce');
            cy.get('[data-test="login-button"]').click();
            
            cy.get('[data-test="error"]').should('be.visible');
        });
    });

    it('should handle XSS attempts', () => {
        const xssAttempts = [
            '<script>alert("XSS")</script>',
            '"><script>alert("XSS")</script>'
        ];

        xssAttempts.forEach((attempt) => {
            cy.visit('https://www.saucedemo.com/');
            cy.get('[data-test="username"]').type(attempt);
            cy.get('[data-test="password"]').type('secret_sauce');
            cy.get('[data-test="login-button"]').click();
            
            cy.get('[data-test="error"]').should('be.visible');
        });
    });

    it('should handle very long input values', () => {
        const longString = 'a'.repeat(500);
        
        cy.get('[data-test="username"]').type(longString);
        cy.get('[data-test="password"]').type(longString);
        cy.get('[data-test="login-button"]').click();
        
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('should handle special characters in credentials', () => {
        const specialChars = [
            { username: 'user@domain.com', password: 'pass@word' },
            { username: 'user-name', password: 'pass_word' }
        ];

        specialChars.forEach((credential) => {
            cy.visit('https://www.saucedemo.com/');
            cy.get('[data-test="username"]').type(credential.username);
            cy.get('[data-test="password"]').type(credential.password);
            cy.get('[data-test="login-button"]').click();
            
            cy.get('[data-test="error"]').should('be.visible');
        });
    });

    it('should handle whitespace in credentials', () => {
        cy.get('[data-test="username"]').type(' standard_user ');
        cy.get('[data-test="password"]').type(' secret_sauce ');
        cy.get('[data-test="login-button"]').click();
        
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('should handle case sensitivity', () => {
        cy.get('[data-test="username"]').type('STANDARD_USER');
        cy.get('[data-test="password"]').type('SECRET_SAUCE');
        cy.get('[data-test="login-button"]').click();
        
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('should handle form submission via Enter key', () => {
        cy.get('[data-test="username"]').type('standard_user');
        cy.get('[data-test="password"]').type('secret_sauce');
        cy.get('[data-test="password"]').type('{enter}');
        
        cy.url().should('include', '/inventory.html');
    });
}); 