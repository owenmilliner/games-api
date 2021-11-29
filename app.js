const express = require('express');
const apiRouter = require('./routers/api.router');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  if (err.errorCode || err.errorMessage) {
    res.status(err.errorCode).send({ errorMessage: err.errorMessage });
  } else {
    res.status(500).send('Internal Server Error.');
  }
});

module.exports = app;
