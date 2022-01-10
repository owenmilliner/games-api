const express = require('express');
const baseRouter = require('./routers/base.router');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/', baseRouter);

app.use((err, req, res, next) => {
  if (err.errorCode || err.errorMessage) {
    res.status(err.errorCode).send({ errorMessage: err.errorMessage });
  } else {
    res.status(500).send('Internal Server Error.');
  }
});

module.exports = app;
