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

exports.updateCommentById = (votesIncrease, comment_id) => {
  return db
    .query(
      `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;`,
      [votesIncrease.inc_votes, comment_id]
    )
    .then(result => {
      if (result.rowCount === 0) {
        return rejectIfNonExistent('comment_id', comment_id);
      } else {
        return result.rows[0];
      }
    });
};
