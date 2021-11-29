const db = require('../connection');
const { dropTables, createTables } = require('../utils');

const seed = async data => {
  const { categoryData, commentData, reviewData, userData } = data;

  await dropTables();
  await createTables();
};

module.exports = seed;
