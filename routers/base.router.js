const { welcome } = require('../controllers/api.controller');
const baseRouter = require('express').Router();

apiRouter.use('/api', apiRouter);

apiRouter.route('/').get(welcome);

module.exports = baseRouter;
