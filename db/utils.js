const format = require('pg-format');
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

exports.insertData = data => {
  const { categoryData, commentData, reviewData, userData } = data;

  const queryString = format(
    `
      INSERT INTO categories 
      (slug, description)
      VALUES 
      %L;`,
    categoryData.map(category => [category.slug, category.description])
  );

  return db
    .query(queryString)
    .then(() => {
      const queryString = format(
        `
              INSERT INTO users
              (username, avatar_url, name)
              VALUES
              %L;
              `,
        userData.map(user => [user.username, user.avatar_url, user.name])
      );

      return db.query(queryString);
    })
    .then(() => {
      const queryString = format(
        `
              INSERT INTO reviews
              (title, review_body, designer, review_img_url, votes, category, owner, created_at)
              VALUES
              %L;
              `,
        reviewData.map(review => [
          review.title,
          review.review_body,
          review.designer,
          review.review_img_url,
          review.votes,
          review.category,
          review.owner,
          review.created_at
        ])
      );

      return db.query(queryString);
    })
    .then(() => {
      const queryString = format(
        `
                INSERT INTO comments
                (author, review_id, votes, created_at, body)
                VALUES
                %L;
                `,
        commentData.map(comment => [
          comment.author,
          comment.review_id,
          comment.votes,
          comment.created_at,
          comment.body
        ])
      );

      return db.query(queryString);
    });
};
