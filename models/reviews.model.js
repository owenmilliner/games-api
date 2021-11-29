const db = require('../db/connection');

exports.fetchReviewById = review_id => {
  if (isNaN(Number(review_id))) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: `Invalid review_id: ${review_id}. Must be a number.`
    });
  }

  return db.query('SELECT * FROM reviews WHERE review_id = $1', [review_id]).then(result => {
    if (result.rowCount === 0) {
      return Promise.reject({
        errorCode: 400,
        errorMessage: `Non-existent review_id: ${review_id}. Please try again.`
      });
    } else {
      return result.rows[0];
    }
  });
};

exports.updateReviewById = (votesIncrease, review_id) => {
  if (isNaN(Number(review_id))) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: `Invalid review_id: ${review_id}. Must be a number.`
    });
  }
  if (isNaN(Number(votesIncrease.inc_votes))) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: `Invalid vote increment value: ${votesIncrease.inc_votes}. Must be a number.`
    });
  }

  return db
    .query(
      `
      UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *;`,
      [votesIncrease.inc_votes, review_id]
    )
    .then(result => {
      if (result.rowCount === 0) {
        return Promise.reject({
          errorCode: 400,
          errorMessage: `Non-existent review_id: ${review_id}. Please try again.`
        });
      } else {
        return result.rows[0];
      }
    });
};
