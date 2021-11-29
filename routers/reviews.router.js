const { getReviewById, patchReviewById } = require('../controllers/reviews.controller');
const reviewsRouter = require('express').Router();

reviewsRouter.route('/:review_id').get(getReviewById);
reviewsRouter.route('/:review_id').patch(patchReviewById);

module.exports = reviewsRouter;
