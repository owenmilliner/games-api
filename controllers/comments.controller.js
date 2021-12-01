const { rejectIfNaN } = require('../models/error-handling/manage-errors');
const { removeCommentById, updateCommentById } = require('../models/comments.model');

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  Promise.all([removeCommentById(comment_id), rejectIfNaN('comment_id', comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const newVotes = req.body;

  Promise.all([
    updateCommentById(newVotes, comment_id),
    rejectIfNaN('comment_id', comment_id),
    rejectIfNaN('vote increment value', newVotes.inc_votes)
  ])
    .then(result => {
      res.status(200).send({ comment: result[0] });
    })
    .catch(next);
};
