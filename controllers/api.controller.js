exports.getMessage = (req, res) => {
  res.status(200).send({ message: 'Welcome to my games API!' });
};
