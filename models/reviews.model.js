const db = require('../db/connection');

exports.fetchReviewById = id => {
  if (isNaN(Number(id))) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: `Invalid review_id: ${id}. Must be a number.`
    });
  }

  return db.query('SELECT * FROM reviews WHERE review_id = $1', [id]);
};
