const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('Products API Endpoints', () => {
    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('GET /api/products - should return paginated products list', async () => {
        const res = await request(app).get('/api/products');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty('pagination');
    });

    test('POST /api/products - should block unauthenticated product creation', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name: 'Unauthorized Item',
                description: 'Should fail without admin token',
                price: 50,
                category: 'Test',
                stock: 5
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});