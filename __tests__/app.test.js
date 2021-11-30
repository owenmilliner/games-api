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
              created_at: expect.any(String),
              comment_count: expect.any(String)
            }
          })
        );
      });
  });

  test('400: Responds with an errorCode and errorMessage when an invalid review_id type is entered.', () => {
    const id = 'bananas';

    return request(app)
      .get(`/api/reviews/${id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Invalid review_id: bananas. Must be a number.');
        400;
      });
  });

  test('404: Responds with an errorCode and errorMessage when a valid, but non-existent review_id is entered. ', () => {
    const id = 1000;

    return request(app)
      .get(`/api/reviews/${id}`)
      .expect(404)
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

  test('400: Responds with an errorCode and errorMessage when an invalid review_id type is entered.', () => {
    const newVotes = { inc_votes: 99 };
    const id = 'bananas';

    return request(app)
      .patch(`/api/reviews/${id}`)
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Invalid review_id: bananas. Must be a number.');
      });
  });

  test('404: Responds with an errorCode and errorMessage when a valid, but non-existent review_id is entered.', () => {
    const newVotes = { inc_votes: 99 };
    const id = 1000;

    return request(app)
      .patch(`/api/reviews/${id}`)
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Non-existent review_id: 1000. Please try again.');
      });
  });

  test('400: Responds with an errorCode and errorMessage when an invalid vote increment type is entered.', () => {
    const newVotes = { inc_votes: 'ten' };
    const id = 1000;

    return request(app)
      .patch(`/api/reviews/${id}`)
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Invalid vote increment value: ten. Must be a number.');
      });
  });
});

describe('GET /api/reviews', () => {
  test('200: Responds with an array of review objects. ', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews).not.toHaveLength(0);

        body.reviews.forEach(review => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String)
            })
          );
        });
      });
  });

  describe('Queries.', () => {
    describe('Sorting.', () => {
      test('200: Responds with an array of review objects, sorted by the default of "date", when no sort value is specified.', () => {
        return request(app)
          .get('/api/reviews')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({ key: 'created_at', descending: true });
          });
      });

      test('200: Responds with an array of review objects, sorted by the column "owner".', () => {
        return request(app)
          .get('/api/reviews?sort=owner')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({ key: 'owner', descending: true });
          });
      });

      test('200: Responds with an array of review objects, sorted by the column "review_id".', () => {
        return request(app)
          .get('/api/reviews?sort=review_id')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({ key: 'review_id', descending: true });
          });
      });

      test('200: Responds with an array of review objects, sorted by the column "category".', () => {
        return request(app)
          .get('/api/reviews?sort=category')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({ key: 'category', descending: true });
          });
      });

      test('200: Responds with an array of review objects, sorted by the column "votes".', () => {
        return request(app)
          .get('/api/reviews?sort=votes')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({ key: 'votes', descending: true });
          });
      });
    });

    describe('Ordering.', () => {
      test('200: Responds with an array of review objects, ordered by the default of "descending', () => {
        return request(app)
          .get('/api/reviews')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({ key: 'created_at', descending: true });
          });
      });

      test('200: Responds with an array of review objects, ordered by "ascending', () => {
        return request(app)
          .get('/api/reviews?order=ASC')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({ key: 'created_at', descending: false });
          });
      });
    });

    describe('Filtering.', () => {
      test('200: Responds with an array of review objects, filtered by category.', () => {
        return request(app)
          .get('/api/reviews?category=dexterity')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).not.toHaveLength(0);

            body.reviews.forEach(review => {
              expect(review).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  category: 'dexterity',
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(String)
                })
              );
            });
          });
      });
    });
  });
});
