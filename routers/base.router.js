const { welcome } = require('../controllers/api.controller');
const baseRouter = require('express').Router();

baseRouter.use('/api', apiRouter);

baseRouter.route('/').get(welcome);

module.exports = baseRouter;
