const db = require('../connection');

const seed = data => {
  const { categoryData, commentData, reviewData, userData } = data;

  return db
    .query('DROP TABLE IF EXISTS comments;')
    .then(() => {
      return db.query('DROP TABLE IF EXISTS reviews;');
    })
    .then(() => {
      return db.query('DROP TABLE IF EXISTS users;');
    })
    .then(() => {
      return db.query('DROP TABLE IF EXISTS categories;');
    })
    .then(() => {
      return db.query(`
      CREATE TABLE categories (
        slug VARCHAR(50) NOT NULL PRIMARY KEY,
        description VARCHAR(400)
      );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR(50) NOT NULL PRIMARY KEY,
          avatar_url VARCHAR(400),
          name VARCHAR(100)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR(50) NOT NULL,
          review_body VARCHAR(400) NOT NULL,
          designer VARCHAR(100),
          review_img_url VARCHAR(300) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAUlT 0,
          category VARCHAR(50) NOT NULL REFERENCES categories(slug),
          owner VARCHAR(50) NOT NULL REFERENCES users(username),
          created_at DATE DEFAULT CURRENT_TIMESTAMP
        );`);
    })
    .then(() => {
      return db.query(`
          CREATE TABLE comments (
            comment_id SERIAL PRIMARY KEY,
            author VARCHAR(50) NOT NULL REFERENCES users(username),
            review_id INT NOT NULL REFERENCES reviews(review_id),
            votes INT DEFAUlT 0,
            created_at DATE DEFAULT CURRENT_TIMESTAMP,
            body VARCHAR(400) NOT NULL
            );`);
    });
};

module.exports = seed;
