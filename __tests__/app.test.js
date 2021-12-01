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

  test('200: Responds with an object containing all of the endpoints on the server.', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(
          expect.objectContaining({
            api: expect.any(Array),
            categories: expect.any(Array),
            reviews: expect.any(Array),
            comments: expect.any(Array)
          })
        );
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

      test('400: Responds with an errorCode and errorMessage when passed an invalid sort value.', () => {
        return request(app)
          .get('/api/reviews?sort=bananas')
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMessage).toBe('Invalid sort parameter.');
          });
      });

      test('200: Responds with an array of review objects, when passed a caseInsensitive parameter.', () => {
        return request(app)
          .get('/api/reviews?sort=vOtEs')
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

      test('400: Responds with an errorCode and errorMessage when passed an invalid order value.', () => {
        return request(app)
          .get('/api/reviews?order=bananas')
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMessage).toBe('Invalid order parameter.');
          });
      });

      test('200: Responds with an array of review objects, when passed a caseInsensitive parameter.', () => {
        return request(app)
          .get('/api/reviews?order=AsC')
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

      test('400: Responds with an errorCode and errorMessage when passed an invalid category value.', () => {
        return request(app)
          .get('/api/reviews?category=bananas')
          .expect(400)
          .then(({ body }) => {
            expect(body.errorMessage).toBe('Invalid category parameter.');
          });
      });

      test('200: Responds with an array of review objects, when passed a caseInsensitive parameter.', () => {
        return request(app)
          .get('/api/reviews?category=DeXtErItY')
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSorted({ key: 'created_at', descending: true });
          });
      });
    });
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
  test('200: Responds with an array of comments for the given review_id.', () => {
    const id = 2;

    return request(app)
      .get(`/api/reviews/${id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).not.toHaveLength(0);

        body.comments.forEach(comment => {
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String)
          });
        });
      });
  });

  test('404: Responds with an errorCode and errorMessage when a valid review_id is entered, but there are no comments found.', () => {
    const id = 1;

    return request(app)
      .get(`/api/reviews/${id}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Non-existent comments for review_id: 1. Please try again.');
      });
  });

  test('400: Responds with an errorCode and errorMessage when an invalid review_id is entered.', () => {
    const id = 'bananas';

    return request(app)
      .get(`/api/reviews/${id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Invalid review_id: bananas. Must be a number.');
      });
  });

  test('400: Responds with an errorCode and errorMessage when a float number is passed as a review_id.', () => {
    const id = '2.5';

    return request(app)
      .get(`/api/reviews/${id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Invalid review_id: 2.5. Must be a number.');
      });
  });
});

describe('POST /api/reviews/:review_id/comments', () => {
  test('201: Responds with a newly created comment object.', () => {
    const id = 1;
    const comment = {
      username: 'bainesface',
      body: 'Absolutely incredible!'
    };

    return request(app)
      .post(`/api/reviews/${id}/comments`)
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            comment: {
              comment_id: expect.any(Number),
              body: 'Absolutely incredible!',
              votes: 0,
              author: 'bainesface',
              review_id: 1,
              created_at: expect.any(String)
            }
          })
        );
      });
  });
});

describe('DELETE /api/comments/comment_id', () => {
  test('204: Responds with no content, and deletes the comment of the given id.', () => {
    const id = 6;

    return request(app).delete(`/api/comments/${id}`).expect(204);
  });

  test('404: Responds with errorCode and errorMessage when given a non-existent comment_id.', () => {
    const id = 10;

    return request(app)
      .delete(`/api/comments/${id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.errorMessage).toBe('Non-existent comment_id: 10. Please try again.');
      });
  });
});

describe('GET /api/users', () => {
  test('200: Responds with an array of user objects.', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users).not.toHaveLength(0);

        body.users.forEach(user => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
          );
        });
      });
  });
});

describe('GET /api/users/:username', () => {
  test('200: Responds with a user object corresponding to the given username.', () => {
    const username = 'bainesface';

    return request(app)
      .get(`/api/users/${username}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          user: {
            username: 'bainesface',
            name: 'sarah',
            avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
          }
        });
      });
  });
});
