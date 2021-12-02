const app = require('./app');
const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
  if (err) {
    throw err;
  } else {
    console.log(`Listening on port: ${PORT}`);
  }
});
