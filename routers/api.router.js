const { getMessage } = require('../controllers/api.controller');
const apiRouter = require('express').Router();
const categoriesRouter = require('./categories.router');

apiRouter.use('/categories', categoriesRouter);

apiRouter.route('/').get(getMessage);

module.exports = apiRouter;
