const { getMessage } = require('../controllers/api.controller');
const apiRouter = require('express').Router();
const categoriesRouter = require('./categories.router');
const reviewsRouter = require('./reviews.router');

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);

apiRouter.route('/').get(getMessage);

module.exports = apiRouter;
