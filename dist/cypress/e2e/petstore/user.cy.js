"use strict";
describe('Petstore User API Tests', () => {
    const username = 'testuser123';
    const testUser = {
        id: 1,
        username,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        userStatus: 0
    };
    it('should create a user', () => {
        cy.request('POST', 'https://petstore.swagger.io/v2/user', testUser)
            .then(response => {
            expect(response.status).to.equal(200);
        });
    });
    it('should login user', () => {
        cy.request('GET', `https://petstore.swagger.io/v2/user/login?username=${username}&password=password123`)
            .then(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message').that.includes('logged in user');
        });
    });
    it('should get user by username', () => {
        cy.request(`https://petstore.swagger.io/v2/user/${username}`)
            .then(response => {
            expect(response.status).to.equal(200);
            expect(response.body.username).to.equal(username);
        });
    });
    it('should update user', () => {
        const updatedUser = Object.assign(Object.assign({}, testUser), { firstName: 'Updated' });
        cy.request('PUT', `https://petstore.swagger.io/v2/user/${username}`, updatedUser)
            .then(response => {
            expect(response.status).to.equal(200);
        });
    });
    it('should delete user', () => {
        cy.request('DELETE', `https://petstore.swagger.io/v2/user/${username}`)
            .then(response => {
            expect(response.status).to.equal(200);
        });
    });
});
