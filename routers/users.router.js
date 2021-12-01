const { getUsers, getUserById } = require('../controllers/users.controller');
const usersRouter = require('express').Router();

usersRouter.route('/').get(getUsers);
usersRouter.route('/:username').get(getUserById);

module.exports = usersRouter;
