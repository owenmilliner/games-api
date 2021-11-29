const db = require('../connection');
const format = require('pg-format');
const { dropTables, createTables } = require('../utils');

const seed = async data => {
  const { categoryData, commentData, reviewData, userData } = data;

  await dropTables();
  await createTables();

  const queryString = format(
    `
  INSERT INTO categories 
  (slug, description)
  VALUES 
  %L;`,
    categoryData.map(category => [category.slug, category.description])
  );

  return db.query(queryString).then(() => {
    const queryString = format(
      `
          INSERT INTO users
          (username, avatar_url, name)
          VALUES
          %L;
          `,
      userData.map(user => [user.username, user.avatar_url, user.name])
    );

    return db.query(queryString).then(() => {
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

      return db.query(queryString).then(() => {
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
    });
  });
};

module.exports = seed;
