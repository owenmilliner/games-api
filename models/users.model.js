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

exports.fetchUserById = username => {
  return db.query('SELECT * FROM users WHERE username = $1', [username]).then(result => {
    if (result.rowCount === 0) {
      return rejectIfNonExistent('username', username);
    } else {
      return result.rows[0];
    }
  });
};
