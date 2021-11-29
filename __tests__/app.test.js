const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api', () => {
  test('200: Responds with server connection message.', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.message).toBe('Welcome to my games API!');
      });
  });
});
