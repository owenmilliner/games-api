const { welcome } = require('../controllers/api.controller');
const apiRouter = require('express').Router();

apiRouter.use('/api', apiRouter);

apiRouter.route('/').get(welcome);

module.exports = apiRouter;
