const { getMessage } = require('../controllers/api.controller');
const apiRouter = require('express').Router();

apiRouter.route('/').get(getMessage);

module.exports = apiRouter;
