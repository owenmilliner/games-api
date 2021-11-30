const db = require('../db/connection');
const { rejectIfNaN, rejectIfNonExistent } = require('./error-handling/manage-errors');

exports.fetchReviewById = review_id => {
  return db.query('SELECT * FROM reviews WHERE review_id = $1', [review_id]).then(result => {
    if (result.rowCount === 0) {
      return rejectIfNonExistent('review_id', review_id);
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
      if (result.rowCount === 0) {
        return rejectIfNonExistent('review_id', review_id);
      } else {
        return result.rows[0];
      }
    });
};
