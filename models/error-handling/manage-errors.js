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

exports.rejectIfInvalidQueryParameter = queries => {
  const sort = queries.sort.toLowerCase();
  const order = queries.order.toUpperCase();
  const category = queries.category.toLowerCase();

  if (!['created_at', 'owner', 'review_id', 'category', 'votes'].includes(sort)) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: 'Invalid sort parameter.'
    });
  }
  if (!['ASC', 'DESC'].includes(order)) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: 'Invalid order parameter.'
    });
  }
  if (!['%', 'dexterity', 'euro game', 'social deduction', "children's games"].includes(category)) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: 'Invalid category parameter.'
    });
  }
};
