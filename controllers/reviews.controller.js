const { rejectIfNaN } = require('../models/error-handling/manage-errors');
const { fetchReviewById, updateReviewById } = require('../models/reviews.model');

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  Promise.all([fetchReviewById(review_id), rejectIfNaN('review_id', review_id)])
    .then(result => {
      res.status(200).send({ review: result[0] });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const newVotes = req.body;

  Promise.all([
    updateReviewById(newVotes, review_id),
    rejectIfNaN('review_id', review_id),
    rejectIfNaN('vote increment value', newVotes.inc_votes)
  ])
    .then(result => {
      res.status(200).send({ review: result[0] });
    })
    .catch(next);
};
