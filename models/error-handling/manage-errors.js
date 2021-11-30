exports.rejectIfNaN = (property, value) => {
  if (isNaN(Number(value))) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: `Invalid ${property}: ${value}. Must be a number.`
    });
  }
};

exports.rejectIfNonExistent = (property, value) => {
  return Promise.reject({
    errorCode: 404,
    errorMessage: `Non-existent ${property}: ${value}. Please try again.`
  });
};
