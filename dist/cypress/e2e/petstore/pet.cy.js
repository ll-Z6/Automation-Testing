"use strict";
describe('Petstore Pet API Tests', () => {
    const petId = 1001;
    const testPet = {
        id: petId,
        name: 'Fluffy',
        status: 'available'
    };
    it('should add a new pet', () => {
        cy.request('POST', 'https://petstore.swagger.io/v2/pet', testPet)
            .then(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal(testPet);
        });
    });
    it('should retrieve the pet by ID', () => {
        cy.request(`https://petstore.swagger.io/v2/pet/${petId}`)
            .then(response => {
            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal(petId);
        });
    });
    it('should update pet status', () => {
        const updatedPet = Object.assign(Object.assign({}, testPet), { status: 'sold' });
        cy.request('PUT', 'https://petstore.swagger.io/v2/pet', updatedPet)
            .then(response => {
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('sold');
        });
    });
    it('should delete the pet', () => {
        cy.request('DELETE', `https://petstore.swagger.io/v2/pet/${petId}`)
            .then(response => {
            expect(response.status).to.equal(200);
        });
    });
});
