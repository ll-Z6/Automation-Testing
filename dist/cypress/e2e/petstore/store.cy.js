"use strict";
describe('Petstore Store API Tests', () => {
    const orderId = 1;
    const testOrder = {
        id: orderId,
        petId: 1001,
        quantity: 1,
        shipDate: new Date().toISOString(),
        status: 'placed',
        complete: true
    };
    it('should place an order', () => {
        cy.request('POST', 'https://petstore.swagger.io/v2/store/order', testOrder)
            .then(response => {
            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal(orderId);
        });
    });
    it('should retrieve order by ID', () => {
        cy.request(`https://petstore.swagger.io/v2/store/order/${orderId}`)
            .then(response => {
            expect(response.status).to.equal(200);
            expect(response.body.petId).to.equal(testOrder.petId);
        });
    });
    it('should delete order', () => {
        cy.request('DELETE', `https://petstore.swagger.io/v2/store/order/${orderId}`)
            .then(response => {
            expect(response.status).to.equal(200);
        });
    });
    it('should get inventory', () => {
        cy.request('GET', 'https://petstore.swagger.io/v2/store/inventory')
            .then(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('available');
        });
    });
});
