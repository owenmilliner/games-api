const db = require('../connection');
const { dropTables, createTables, insertData } = require('../utils');

const seed = async data => {
  await dropTables();
  await createTables();
  await insertData(data);
};

module.exports = seed;
