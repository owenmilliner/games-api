const db = require("../db/connection");
const { rejectIfNonExistent } = require("./error-handling/manage-errors");

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, 
            (SELECT COUNT(*) FROM comments WHERE comments.review_id=reviews.review_id) AS comment_count 
       FROM reviews WHERE review_id = $1`,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return rejectIfNonExistent("review_id", review_id);
      } else {
        return result.rows[0];
      }
    });
};

exports.updateReviewById = (votesIncrease, review_id) => {
  return db
    .query(
      `
      UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *;`,
      [votesIncrease.inc_votes, review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return rejectIfNonExistent("review_id", review_id);
      } else {
        return result.rows[0];
      }
    });
};

exports.fetchReviews = (queries) => {
  const sort = queries.sort.toLowerCase();
  const order = queries.order.toUpperCase();
  const category = queries.category.toLowerCase();
  category.replace(/^%20$/g, " ");
  const { limit } = queries;

  let page = queries.page * limit;
  page -= limit;

  return db
    .query(
      `
        SELECT 
            reviews.owner, 
            reviews.title, 
            reviews.review_id, 
            reviews.category, 
            reviews.review_img_url, 
            reviews.created_at, 
            reviews.votes, 
            (SELECT COUNT(*) FROM comments WHERE comments.review_id=reviews.review_id) AS comment_count
        FROM reviews
    WHERE category LIKE '${category}'
    ORDER BY reviews.${sort} ${order}
    LIMIT ${queries.limit} OFFSET ${page}
    ;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchReviewsCount = (queries) => {
  const category = queries.category.toLowerCase();

  return db
    .query(
      `
        SELECT 
        COUNT(*) OVER() AS total_count
        FROM reviews
        WHERE category LIKE '${category}'
        ;`
    )
    .then((result) => {
      if (queries.total_count) {
        return result.rows[0];
      } else {
        return { unwanted_count: 0 };
      }
    });
};

exports.fetchReviewComments = (review_id) => {
  return db
    .query(
      `
      SELECT 
        comment_id,
        votes,
        created_at,
        author,
        body
     FROM comments
     WHERE review_id = $1
     ;`,
      [review_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertReviewComment = (review_id, comment) => {
  const { username, body } = comment;

  return this.fetchReviewById(review_id)
    .then(() => {
      return db.query(
        `
      INSERT INTO comments
      (author, review_id, body)
      VALUES
      ($1, $2, $3)
      RETURNING *
      ;`,
        [username, review_id, body]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};

exports.insertReview = (review) => {
  const { owner, title, review_body, designer, category } = review;

  return db
    .query(
      `
        INSERT INTO reviews
            (owner, title, review_body, designer, category)
        VALUES
            ($1, $2, $3, $4, $5)
        RETURNING 
            review_id, 
            owner, 
            title, 
            review_body, 
            designer, 
            category,
            votes,
            created_at,
            (SELECT COUNT(*) FROM comments WHERE comments.review_id=reviews.review_id) AS comment_count
       ;`,
      [owner, title, review_body, designer, category]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err);
    });
};
