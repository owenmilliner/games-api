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

describe('GET /api/categories', () => {
  test('200: Responds with an array of category objects.', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toBeInstanceOf(Array);
        expect(body.categories).not.toHaveLength(0);

        body.categories.forEach(category => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});

describe('GET /api/reviews/:review_id', () => {
  test('200: Responds with a review object corresponding to the id passed.', () => {
    const id = 1;

    return request(app)
      .get(`/api/reviews/${id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);

        expect(body).toEqual(
          expect.objectContaining({
            review: {
              review_id: 1,
              title: 'Agricola',
              review_body: 'Farmyard fun!',
              designer: 'Uwe Rosenberg',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              votes: 1,
              category: 'euro game',
              owner: 'mallionaire',
              created_at: expect.any(String)
            }
          })
        );
      });
  });

  test('400: Respond with an errorCode and errorMessage when an invalid review_id type is entered.', () => {
    const id = 'bananas';

    return request(app)
      .get(`/api/reviews/${id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Invalid review_id: bananas. Must be a number.');
      });
  });

  test('400: Respond with an errorCode and errorMessage when a valid, but non-existent review_id is entered. ', () => {
    const id = 1000;

    return request(app)
      .get(`/api/reviews/${id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Non-existent review_id: 1000. Please try again.');
      });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  test('200: Responds with an updated review object, with an increased voters value corresponding to the value provided.', () => {
    const newVotes = { inc_votes: 99 };
    const id = 1;

    return request(app)
      .patch(`/api/reviews/${id}`)
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);

        expect(body).toEqual(
          expect.objectContaining({
            review: {
              review_id: 1,
              title: 'Agricola',
              review_body: 'Farmyard fun!',
              designer: 'Uwe Rosenberg',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              votes: 100,
              category: 'euro game',
              owner: 'mallionaire',
              created_at: expect.any(String)
            }
          })
        );
      });
  });
});
