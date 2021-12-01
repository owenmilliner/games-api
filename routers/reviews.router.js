const {
  getReviewById,
  patchReviewById,
  getReviews,
  getReviewComments
} = require('../controllers/reviews.controller');
const reviewsRouter = require('express').Router();

reviewsRouter.route('/:review_id/comments').get(getReviewComments);
reviewsRouter.route('/:review_id').get(getReviewById);
reviewsRouter.route('/:review_id').patch(patchReviewById);
reviewsRouter.route('/').get(getReviews);

module.exports = reviewsRouter;
