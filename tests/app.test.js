'use strict';

const request = require('supertest');
const app = require('../src/app');

describe('Items API', () => {
  // Test 1: Health check
  describe('GET /health', () => {
    it('should return status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  // Test 2: Create an item
  describe('POST /items', () => {
    it('should create a new item with valid name', async () => {
      const res = await request(app)
        .post('/items')
        .send({ name: 'Test Item' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Test Item');
    });

    it('should return 400 when name is missing', async () => {
      const res = await request(app)
        .post('/items')
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('name is required');
    });

    it('should return 400 when name is empty string', async () => {
      const res = await request(app)
        .post('/items')
        .send({ name: '   ' });
      expect(res.statusCode).toBe(400);
    });
  });

  // Test 3: Get all items
  describe('GET /items', () => {
    it('should return an array of items', async () => {
      const res = await request(app).get('/items');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // Test 4: Get single item
  describe('GET /items/:id', () => {
    it('should return 404 for non-existent item', async () => {
      const res = await request(app).get('/items/99999');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Item not found');
    });

    it('should return item when it exists', async () => {
      // Create first, then fetch
      const createRes = await request(app)
        .post('/items')
        .send({ name: 'Fetchable Item' });
      const id = createRes.body.id;

      const res = await request(app).get(`/items/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Fetchable Item');
    });
  });

  // Test 5: Delete item
  describe('DELETE /items/:id', () => {
    it('should delete an existing item', async () => {
      const createRes = await request(app)
        .post('/items')
        .send({ name: 'To Delete' });
      const id = createRes.body.id;

      const deleteRes = await request(app).delete(`/items/${id}`);
      expect(deleteRes.statusCode).toBe(204);

      const getRes = await request(app).get(`/items/${id}`);
      expect(getRes.statusCode).toBe(404);
    });

    it('should return 404 when deleting non-existent item', async () => {
      const res = await request(app).delete('/items/99999');
      expect(res.statusCode).toBe(404);
    });
  });
});
