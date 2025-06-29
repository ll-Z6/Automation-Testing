describe('SauceDemo Login Tests', () => {
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
}); 