const {
  rejectIfNaN,
  rejectIfInvalidQueryParameter,
  rejectIfNonExistent
} = require('../models/error-handling/manage-errors');
const {
  fetchReviewById,
  updateReviewById,
  fetchReviews,
  fetchReviewComments
} = require('../models/reviews.model');

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

exports.getReviews = (req, res, next) => {
  const queries = {};
  queries.sort = req.query.sort || 'created_at';
  queries.order = req.query.order || 'DESC';
  queries.category = req.query.category || '%';

  Promise.all([fetchReviews(queries), rejectIfInvalidQueryParameter(queries)])
    .then(result => {
      res.status(200).send({ reviews: result[0] });
    })
    .catch(next);
};

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;

  Promise.all([fetchReviewComments(review_id), rejectIfNaN('review_id', review_id)])
    .then(result => {
      res.status(200).send({ comments: result[0] });
    })
    .catch(next);
};
