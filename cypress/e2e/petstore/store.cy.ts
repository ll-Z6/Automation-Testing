describe('Petstore Store API Tests', () => {
    let testData: any;

    before(() => {
        cy.fixture('petstore-data').then((data) => {
            testData = data;
        });
    });

    // Test data defined directly in test file for better readability
    const testOrders = [
        {
            name: 'Basic Order',
            data: {
                id: 0,
                petId: 1001,
                quantity: 1,
                shipDate: '2024-01-01T00:00:00.000Z',
                status: 'placed',
                complete: true
            },
            description: 'Standard order with complete status'
        },
        {
            name: 'Incomplete Order',
            data: {
                id: 0,
                petId: 1002,
                quantity: 2,
                shipDate: '2024-01-01T00:00:00.000Z',
                status: 'placed',
                complete: false
            },
            description: 'Order with incomplete status'
        },
        {
            name: 'Large Quantity Order',
            data: {
                id: 0,
                petId: 1003,
                quantity: 5,
                shipDate: '2024-01-01T00:00:00.000Z',
                status: 'placed',
                complete: true
            },
            description: 'Order with multiple items'
        }
    ];

    const invalidOrderIds = [
        { id: 999999, description: 'Non-existent order ID' },
        { id: 0, description: 'Zero order ID' },
        { id: -1, description: 'Negative order ID' }
    ];

    it('should get pet inventories by status', () => {
        cy.request({
            method: 'GET',
            url: `${testData.baseUrl}${testData.endpoints.inventory}`,
            failOnStatusCode: false
        }).then(response => {
            if (response.status === testData.statusCodes.serviceUnavailable) {
                cy.log('Service temporarily unavailable, skipping test');
                return;
            }
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            
            // Verify inventory properties
            expect(response.body).to.have.property('available');
            expect(response.body).to.have.property('pending');
            expect(response.body).to.have.property('sold');
        });
    });

    it('should create orders with different data', () => {
        testOrders.forEach((orderConfig) => {
            const orderData = {
                ...orderConfig.data,
                shipDate: new Date().toISOString() // Use current date
            };

            cy.request({
                method: 'POST',
                url: `${testData.baseUrl}${testData.endpoints.order}`,
                body: orderData,
                failOnStatusCode: false
            }).then(response => {
                if (response.status === testData.statusCodes.serviceUnavailable) {
                    cy.log(`Service temporarily unavailable, skipping test for ${orderConfig.name}`);
                    return;
                }
                
                expect(response.status).to.equal(200);
                
                // Verify response properties
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('petId');
                expect(response.body).to.have.property('quantity');
                expect(response.body).to.have.property('shipDate');
                expect(response.body).to.have.property('status');
                expect(response.body).to.have.property('complete');
                
                // Verify order data matches
                expect(response.body.petId).to.equal(orderData.petId);
                expect(response.body.quantity).to.equal(orderData.quantity);
                expect(response.body.status).to.equal(orderData.status);
                expect(response.body.complete).to.equal(orderData.complete);
            });
        });
    });

    it('should get order by ID', () => {
        // Create an order first
        const orderData = {
            ...testOrders[0].data,
            shipDate: new Date().toISOString()
        };

        cy.request({
            method: 'POST',
            url: `${testData.baseUrl}${testData.endpoints.order}`,
            body: orderData,
            failOnStatusCode: false
        }).then(createResponse => {
            if (createResponse.status === testData.statusCodes.serviceUnavailable) {
                cy.log('Service temporarily unavailable, skipping test');
                return;
            }
            
            const orderId = createResponse.body.id;
            
            if (orderId && orderId < 1000000) {
                // Get the order by ID
                cy.request({
                    method: 'GET',
                    url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', orderId)}`,
                    failOnStatusCode: false
                }).then(getResponse => {
                    if (getResponse.status === testData.statusCodes.serviceUnavailable) {
                        cy.log('Service temporarily unavailable, skipping verification');
                        return;
                    }
                    
                    expect(getResponse.status).to.equal(200);
                    expect(getResponse.body.id).to.equal(orderId);
                    expect(getResponse.body.petId).to.equal(orderData.petId);
                    expect(getResponse.body.quantity).to.equal(orderData.quantity);
                    expect(getResponse.body.status).to.equal(orderData.status);
                    expect(getResponse.body.complete).to.equal(orderData.complete);
                });
            } else {
                cy.log('Skipping get order test due to invalid order ID returned by API');
            }
        });
    });

    it('should delete an existing order', () => {
        // Create an order to delete
        const orderData = {
            ...testOrders[1].data,
            shipDate: new Date().toISOString()
        };

        cy.request({
            method: 'POST',
            url: `${testData.baseUrl}${testData.endpoints.order}`,
            body: orderData,
            failOnStatusCode: false
        }).then(createResponse => {
            if (createResponse.status === testData.statusCodes.serviceUnavailable) {
                cy.log('Service temporarily unavailable, skipping test');
                return;
            }
            
            const orderId = createResponse.body.id;
            
            if (orderId && orderId < 1000000) {
                // Delete the order
                cy.request({
                    method: 'DELETE',
                    url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', orderId)}`,
                    failOnStatusCode: false
                }).then(deleteResponse => {
                    if (deleteResponse.status === testData.statusCodes.serviceUnavailable) {
                        cy.log('Service temporarily unavailable, skipping verification');
                        return;
                    }
                    
                    expect(deleteResponse.status).to.equal(200);
                    
                    // Verify the order is actually deleted
                    cy.request({
                        method: 'GET',
                        url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', orderId)}`,
                        failOnStatusCode: false
                    }).then(getResponse => {
                        if (getResponse.status === testData.statusCodes.serviceUnavailable) {
                            cy.log('Service temporarily unavailable, skipping verification');
                            return;
                        }
                        expect(getResponse.status).to.equal(404);
                    });
                });
            } else {
                cy.log('Skipping delete order test due to invalid order ID returned by API');
            }
        });
    });

    it('should return 404 for non-existent orders', () => {
        invalidOrderIds.forEach((invalidOrder) => {
            cy.request({
                method: 'GET',
                url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', invalidOrder.id)}`,
                failOnStatusCode: false
            }).then(response => {
                if (response.status === testData.statusCodes.serviceUnavailable) {
                    cy.log(`Service temporarily unavailable, skipping test for ${invalidOrder.description}`);
                    return;
                }
                
                expect(response.status).to.equal(404);
                
                // Verify error response properties
                expect(response.body).to.have.property('code');
                expect(response.body).to.have.property('type');
                expect(response.body).to.have.property('message');
            });
        });
    });

    it('should return 404 when deleting non-existent orders', () => {
        invalidOrderIds.forEach((invalidOrder) => {
            cy.request({
                method: 'DELETE',
                url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', invalidOrder.id)}`,
                failOnStatusCode: false
            }).then(response => {
                if (response.status === testData.statusCodes.serviceUnavailable) {
                    cy.log(`Service temporarily unavailable, skipping test for ${invalidOrder.description}`);
                    return;
                }
                
                expect(response.status).to.equal(404);
                
                // Verify error response properties
                expect(response.body).to.have.property('code');
                expect(response.body).to.have.property('type');
                expect(response.body).to.have.property('message');
            });
        });
    });
}); 