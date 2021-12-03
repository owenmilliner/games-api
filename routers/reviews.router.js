const {
  getReviewById,
  patchReviewById,
  getReviews,
  getReviewComments,
  postReviewComment,
  postReview
} = require('../controllers/reviews.controller');
const reviewsRouter = require('express').Router();

reviewsRouter.route('/:review_id/comments').get(getReviewComments);
reviewsRouter.route('/:review_id/comments').post(postReviewComment);
reviewsRouter.route('/:review_id').get(getReviewById);
reviewsRouter.route('/:review_id').patch(patchReviewById);
reviewsRouter.route('/').get(getReviews);
reviewsRouter.route('/').post(postReview);

module.exports = reviewsRouter;
