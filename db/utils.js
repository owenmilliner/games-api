const db = require('./connection');

exports.dropTables = () => {
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
    });
};

exports.createTables = () => {
  return db
    .query(
      `
    CREATE TABLE categories (
      slug VARCHAR(100) NOT NULL PRIMARY KEY,
      description VARCHAR(1000)
    );`
    )
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR(100) NOT NULL PRIMARY KEY,
          avatar_url VARCHAR(1000),
          name VARCHAR(100)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          review_body VARCHAR(1000) NOT NULL,
          designer VARCHAR(100),
          review_img_url VARCHAR(300) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAUlT 0,
          category VARCHAR(100) NOT NULL REFERENCES categories(slug),
          owner VARCHAR(100) NOT NULL REFERENCES users(username),
          created_at DATE DEFAULT CURRENT_TIMESTAMP
        );`);
    })
    .then(() => {
      return db.query(`
          CREATE TABLE comments (
            comment_id SERIAL PRIMARY KEY,
            author VARCHAR(100) NOT NULL REFERENCES users(username),
            review_id INT NOT NULL REFERENCES reviews(review_id),
            votes INT DEFAUlT 0,
            created_at DATE DEFAULT CURRENT_TIMESTAMP,
            body VARCHAR(1000) NOT NULL
            );`);
    });
};
