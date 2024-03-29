const {
  rejectIfNaN,
  rejectIfInvalidQueryParameter,
  rejectIfInvalidProperties,
  rejectIfKeyMissing,
  rejectIfInvalidUsername,
} = require('../models/error-handling/manage-errors');
const {
  fetchReviewById,
  updateReviewById,
  fetchReviews,
  fetchReviewComments,
  insertReviewComment,
  fetchReviewsCount,
  insertReview,
  removeReviewById,
} = require('../models/reviews.model');

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  Promise.all([fetchReviewById(review_id), rejectIfNaN('review_id', review_id)])
    .then((result) => {
      res.status(200).send({ review: result[0] });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const newVotes = req.body || {};

  Promise.all([
    updateReviewById(newVotes, review_id),
    rejectIfKeyMissing(['inc_votes'], newVotes),
    rejectIfNaN('review_id', review_id),
    rejectIfNaN('vote increment value', newVotes.inc_votes),
  ])
    .then((result) => {
      res.status(200).send({ review: result[0] });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const queries = {};
  queries.sort = req.query.sort || 'created_at';
  queries.order = req.query.order || 'DESC';
  queries.category = req.query.category || '%';
  queries.limit = req.query.limit || 10;
  queries.page = req.query.page || 1;
  queries.total_count = req.query.total_count || false;

  Promise.all([
    fetchReviews(queries),
    fetchReviewsCount(queries),
    rejectIfNaN('limit', queries.limit),
    rejectIfNaN('page', queries.page),
    rejectIfInvalidQueryParameter(queries),
  ])
    .then((result) => {
      if (result[1].total_count) {
        res
          .status(200)
          .send({ reviews: result[0], total_count: result[1].total_count });
      } else {
        res.status(200).send({ reviews: result[0] });
      }
    })
    .catch(next);
};

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;

  Promise.all([
    fetchReviewComments(review_id),
    rejectIfNaN('review_id', review_id),
  ])
    .then((result) => {
      res.status(200).send({ comments: result[0] });
    })
    .catch(next);
};

exports.postReviewComment = (req, res, next) => {
  const { review_id } = req.params;
  const comment = req.body;

  Promise.all([
    insertReviewComment(review_id, comment),
    rejectIfNaN('review_id', review_id),
    rejectIfKeyMissing(['username', 'body'], comment),
  ])
    .then((result) => {
      res.status(201).send({ comment: result[0] });
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  const review = req.body;

  Promise.all([insertReview(review), rejectIfInvalidProperties(review)])
    .then((result) => {
      res.status(201).send({ review: result[0] });
    })
    .catch(next);
};

exports.deleteReviewById = (req, res, next) => {
  const { review_id } = req.params;

  Promise.all([
    removeReviewById(review_id),
    rejectIfNaN('review_id', review_id),
  ])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
