const db = require('../db/connection');
const { rejectIfNonExistent } = require('./error-handling/manage-errors');

exports.removeCommentById = comment_id => {
  return db
    .query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id])
    .then(result => {
      if (result.rowCount === 0) {
        return rejectIfNonExistent('comment_id', comment_id);
      } else {
        return result.rows[0];
      }
    });
};
