const db = require('../db/connection');

exports.fetchReviewById = id => {
  if (isNaN(Number(id))) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: `Invalid review_id: ${id}. Must be a number.`
    });
  }

  return db.query('SELECT * FROM reviews WHERE review_id = $1', [id]).then(result => {
    if (result.rowCount === 0) {
      return Promise.reject({
        errorCode: 400,
        errorMessage: `Non-existent review_id: ${id}. Please try again.`
      });
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
    .then(result => {
      return result.rows[0];
    });
};
