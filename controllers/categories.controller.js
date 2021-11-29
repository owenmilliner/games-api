const { fetchCategories } = require('../models/categories.model');

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then(({ rows }) => {
      res.status(200).send({ categories: rows });
    })
    .catch(next);
};
