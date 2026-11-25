const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth API Endpoints', () => {
    const testUser = {
        name: 'Test User',
        email: `testuser_${Date.now()}@example.com`,
        password: 'password123'
    };

    let authToken;

    afterAll(async () => {
        await User.deleteOne({ email: testUser.email });
        await mongoose.connection.close();
    });

    test('POST /api/auth/register - should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        authToken = res.body.data.token;
    });

    test('POST /api/auth/login - should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
    });

    test('GET /api/auth/profile - should return profile for authenticated user', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(testUser.email);
    });

    test('GET /api/auth/profile - should reject request without token', async () => {
        const res = await request(app).get('/api/auth/profile');
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});