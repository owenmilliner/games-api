const { fetchEndpoints } = require('../models/api.model');
const categoriesRouter = require('../routers/categories.router');
const commentsRouter = require('../routers/comments.router');
const reviewsRouter = require('../routers/reviews.router');
const usersRouter = require('../routers/users.router');

exports.getMessage = (req, res, next) => {
  const stacks = {
    categories: categoriesRouter.stack,
    reviews: reviewsRouter.stack,
    comments: commentsRouter.stack,
    users: usersRouter.stack
  };

  fetchEndpoints(stacks)
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.welcome = (req, res, next) => {
  res.status(200).send({ greeting: 'Welcome to my very first API!' });
};
