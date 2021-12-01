const { rejectIfNaN } = require('../models/error-handling/manage-errors');
const { removeCommentById } = require('../models/comments.model');

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  Promise.all([removeCommentById(comment_id), rejectIfNaN('comment_id', comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
