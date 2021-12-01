const db = require('../db/connection');
const { rejectIfNonExistent } = require('./error-handling/manage-errors');

exports.fetchUsers = () => {
  return db.query('SELECT * FROM users').then(result => {
    if (result.rowCount === 0) {
      return rejectIfNonExistent('users', 0);
    } else {
      return result.rows;
    }
  });
};
