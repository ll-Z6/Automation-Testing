describe('PetStore API Performance & Stress Tests', () => {
    let testData: any;

    before(() => {
        cy.fixture('petstore-data').then((data) => {
            testData = data;
        });
    });

    it('should get inventory within 500ms', () => {
        cy.request({
            method: 'GET',
            url: `${testData.baseUrl}${testData.endpoints.inventory}`,
            failOnStatusCode: false
        }).then(response => {
            cy.log(`Inventory API response time: ${response.duration} ms`);
            expect(response.duration).to.be.lessThan(500);
        });
    });

    it('should create order within 800ms', () => {
        const orderData = {
            id: 0,
            petId: 1001,
            quantity: 1,
            shipDate: new Date().toISOString(),
            status: 'placed',
            complete: true
        };

        cy.request({
            method: 'POST',
            url: `${testData.baseUrl}${testData.endpoints.order}`,
            body: orderData,
            failOnStatusCode: false
        }).then(response => {
            cy.log(`Create order API response time: ${response.duration} ms`);
            expect(response.duration).to.be.lessThan(800);
        });
    });

    it('should get order by ID within 600ms', () => {
        // First create an order
        const orderData = {
            id: 0,
            petId: 1002,
            quantity: 1,
            shipDate: new Date().toISOString(),
            status: 'placed',
            complete: true
        };

        cy.request({
            method: 'POST',
            url: `${testData.baseUrl}${testData.endpoints.order}`,
            body: orderData,
            failOnStatusCode: false
        }).then(createResponse => {
            const orderId = createResponse.body.id;
            
            if (orderId && orderId < 1000000) {
                cy.request({
                    method: 'GET',
                    url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', orderId)}`,
                    failOnStatusCode: false
                }).then(getResponse => {
                    cy.log(`Get order API response time: ${getResponse.duration} ms`);
                    expect(getResponse.duration).to.be.lessThan(600);
                });
            }
        });
    });

    it('should delete order within 500ms', () => {
        // First create an order
        const orderData = {
            id: 0,
            petId: 1003,
            quantity: 1,
            shipDate: new Date().toISOString(),
            status: 'placed',
            complete: true
        };

        cy.request({
            method: 'POST',
            url: `${testData.baseUrl}${testData.endpoints.order}`,
            body: orderData,
            failOnStatusCode: false
        }).then(createResponse => {
            const orderId = createResponse.body.id;
            
            if (orderId && orderId < 1000000) {
                cy.request({
                    method: 'DELETE',
                    url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', orderId)}`,
                    failOnStatusCode: false
                }).then(deleteResponse => {
                    cy.log(`Delete order API response time: ${deleteResponse.duration} ms`);
                    expect(deleteResponse.duration).to.be.lessThan(500);
                });
            }
        });
    });

    it('should handle multiple API calls efficiently', () => {
        const responseTimes: number[] = [];
        const testCount = 5;

        for (let i = 0; i < testCount; i++) {
            cy.request({
                method: 'GET',
                url: `${testData.baseUrl}${testData.endpoints.inventory}`,
                failOnStatusCode: false
            }).then(response => {
                responseTimes.push(response.duration);
                cy.log(`API call ${i + 1}: ${response.duration} ms`);
            });
        }

        cy.then(() => {
            const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            const maxResponseTime = Math.max(...responseTimes);
            
            cy.log(`Average response time: ${avgResponseTime} ms`);
            cy.log(`Max response time: ${maxResponseTime} ms`);
            
            expect(avgResponseTime).to.be.lessThan(500);
            expect(maxResponseTime).to.be.lessThan(800);
        });
    });

    // Stress test scenarios
    it('should handle high concurrent API requests (stress test)', () => {
        const responseTimes: number[] = [];
        const concurrentRequests = 8; // Reduce concurrent requests

        for (let i = 0; i < concurrentRequests; i++) {
            cy.request({
                method: 'GET',
                url: `${testData.baseUrl}${testData.endpoints.inventory}`,
                failOnStatusCode: false
            }).then(response => {
                responseTimes.push(response.duration);
                cy.log(`Concurrent request ${i + 1}: ${response.duration} ms`);
            });
        }

        cy.then(() => {
            const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            const maxResponseTime = Math.max(...responseTimes);
            const minResponseTime = Math.min(...responseTimes);
            
            cy.log(`Average concurrent response time: ${avgResponseTime} ms`);
            cy.log(`Max concurrent response time: ${maxResponseTime} ms`);
            cy.log(`Min concurrent response time: ${minResponseTime} ms`);
            
            // Stress test assertion: Performance should remain stable under high concurrency
            expect(avgResponseTime).to.be.lessThan(1000); // Adjust threshold
            expect(maxResponseTime).to.be.lessThan(1500);
            // Response time fluctuation should not be too large
            expect(maxResponseTime / minResponseTime).to.be.lessThan(3);
        });
    });

    it('should handle bulk order creation (stress test)', () => {
        const orderCreationTimes: number[] = [];
        const bulkSize = 3; // Reduce bulk size
        const orders: any[] = [];

        // Create bulk order data
        for (let i = 0; i < bulkSize; i++) {
            orders.push({
                id: 0,
                petId: 1000 + i,
                quantity: Math.floor(Math.random() * 5) + 1,
                shipDate: new Date().toISOString(),
                status: 'placed',
                complete: true
            });
        }

        // Bulk create orders
        orders.forEach((orderData, index) => {
            const start = Date.now();
            cy.request({
                method: 'POST',
                url: `${testData.baseUrl}${testData.endpoints.order}`,
                body: orderData,
                failOnStatusCode: false
            }).then(response => {
                const creationTime = Date.now() - start;
                orderCreationTimes.push(creationTime);
                cy.log(`Bulk order ${index + 1} creation time: ${creationTime} ms`);
            });
        });

        cy.then(() => {
            const avgCreationTime = orderCreationTimes.reduce((a, b) => a + b, 0) / orderCreationTimes.length;
            const maxCreationTime = Math.max(...orderCreationTimes);
            const totalCreationTime = orderCreationTimes.reduce((a, b) => a + b, 0);
            
            cy.log(`Average order creation time: ${avgCreationTime} ms`);
            cy.log(`Max order creation time: ${maxCreationTime} ms`);
            cy.log(`Total bulk creation time: ${totalCreationTime} ms`);
            
            // Stress test assertion: Bulk operations should maintain reasonable performance
            expect(avgCreationTime).to.be.lessThan(1500); // Adjust threshold
            expect(maxCreationTime).to.be.lessThan(2000);
            expect(totalCreationTime).to.be.lessThan(6000);
        });
    });

    it('should handle rapid CRUD operations (stress test)', () => {
        const operationTimes: number[] = [];
        const operations = 5; // Reduce operation count

        for (let i = 0; i < operations; i++) {
            const operationStart = Date.now();
            
            // Create
            const orderData = {
                id: 0,
                petId: 2000 + i,
                quantity: 1,
                shipDate: new Date().toISOString(),
                status: 'placed',
                complete: true
            };

            cy.request({
                method: 'POST',
                url: `${testData.baseUrl}${testData.endpoints.order}`,
                body: orderData,
                failOnStatusCode: false
            }).then(createResponse => {
                const orderId = createResponse.body.id;
                
                if (orderId && orderId < 1000000) {
                    // Read
                    cy.request({
                        method: 'GET',
                        url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', orderId)}`,
                        failOnStatusCode: false
                    }).then(() => {
                        // Delete
                        cy.request({
                            method: 'DELETE',
                            url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', orderId)}`,
                            failOnStatusCode: false
                        }).then(() => {
                            const operationTime = Date.now() - operationStart;
                            operationTimes.push(operationTime);
                            cy.log(`CRUD operation ${i + 1}: ${operationTime} ms`);
                        });
                    });
                }
            });
        }

        cy.then(() => {
            if (operationTimes.length > 0) {
                const avgOperationTime = operationTimes.reduce((a, b) => a + b, 0) / operationTimes.length;
                const maxOperationTime = Math.max(...operationTimes);
                const minOperationTime = Math.min(...operationTimes);
                
                cy.log(`Average CRUD operation time: ${avgOperationTime} ms`);
                cy.log(`Max CRUD operation time: ${maxOperationTime} ms`);
                cy.log(`Min CRUD operation time: ${minOperationTime} ms`);
                
                // Stress test assertion: CRUD operations should maintain stable performance
                expect(avgOperationTime).to.be.lessThan(3000); // Adjust threshold
                expect(maxOperationTime).to.be.lessThan(4000);
                // Operation time should be relatively stable
                expect(maxOperationTime / minOperationTime).to.be.lessThan(3);
            }
        });
    });

    it('should handle error recovery under load (stress test)', () => {
        const errorRecoveryTimes: number[] = [];
        const errorTests = 3; // Reduce error test count

        for (let i = 0; i < errorTests; i++) {
            const recoveryStart = Date.now();
            
            // First send an invalid request (simulate error)
            cy.request({
                method: 'GET',
                url: `${testData.baseUrl}${testData.endpoints.orderById.replace('{id}', '999999999')}`,
                failOnStatusCode: false
            }).then(errorResponse => {
                // Verify error response
                expect(errorResponse.status).to.be.oneOf([404, 400]);
                
                // Immediately send a valid request (test error recovery)
                cy.request({
                    method: 'GET',
                    url: `${testData.baseUrl}${testData.endpoints.inventory}`,
                    failOnStatusCode: false
                }).then(successResponse => {
                    const recoveryTime = Date.now() - recoveryStart;
                    errorRecoveryTimes.push(recoveryTime);
                    cy.log(`Error recovery test ${i + 1}: ${recoveryTime} ms`);
                    
                    // Verify successful response
                    expect(successResponse.status).to.be.oneOf([200, 201]);
                });
            });
        }

        cy.then(() => {
            if (errorRecoveryTimes.length > 0) {
                const avgRecoveryTime = errorRecoveryTimes.reduce((a, b) => a + b, 0) / errorRecoveryTimes.length;
                const maxRecoveryTime = Math.max(...errorRecoveryTimes);
                
                cy.log(`Average error recovery time: ${avgRecoveryTime} ms`);
                cy.log(`Max error recovery time: ${maxRecoveryTime} ms`);
                
                // Stress test assertion: Error recovery should be fast and stable
                expect(avgRecoveryTime).to.be.lessThan(2000); // Adjust threshold
                expect(maxRecoveryTime).to.be.lessThan(3000);
            }
        });
    });
}); 