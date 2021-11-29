const { fetchReviewById } = require('../models/reviews.model');

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewById(review_id)
    .then(({ rows }) => {
      console.log({ review: rows[0] });
      res.status(200).send({ review: rows[0] });
    })
    .catch(next);
};
