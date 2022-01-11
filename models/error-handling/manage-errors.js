exports.rejectIfKeyMissing = (keys, object) => {
  for (const key of keys) {
    if (!object.hasOwnProperty(key)) {
      return Promise.reject({
        errorCode: 400,
        errorMessage: `Missing object property: ${key}`,
      });
    }
  }
};

exports.rejectIfNaN = (property, value) => {
  if (isNaN(Number(value)) || Number(value) % 1 !== 0) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: `Invalid ${property}: ${value}. Must be a number.`,
    });
  }
};

exports.rejectIfNonExistent = (property, value) => {
  return Promise.reject({
    errorCode: 404,
    errorMessage: `Non-existent ${property}: ${value}. Please try again.`,
  });
};

exports.rejectIfInvalidQueryParameter = (queries) => {
  const sort = queries.sort.toLowerCase();
  const order = queries.order.toUpperCase();
  const category = queries.category.toLowerCase();

  if (
    !['created_at', 'owner', 'review_id', 'category', 'votes'].includes(sort)
  ) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: 'Invalid sort parameter.',
    });
  }
  if (!['ASC', 'DESC'].includes(order)) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: 'Invalid order parameter.',
    });
  }
  if (
    ![
      '%',
      'dexterity',
      'euro game',
      'social deduction',
      "children's games",
      'strategy',
      'hidden-roles',
      'dexterity',
      'push-your-luck',
      'roll-and-write',
      'deck-building',
      'engine-building',
    ].includes(category)
  ) {
    return Promise.reject({
      errorCode: 400,
      errorMessage: 'Invalid category parameter.',
    });
  }
  if (queries.limit < 1 || queries > 50) {
    return Promise.reject({
      errorCode: 400,
      errorMessage:
        'Out of bounds for limit parameter. Must be a number between 1 and 50 (inclusive).',
    });
  }
};

exports.rejectIfInvalidProperties = (review) => {
  if (
    !review.hasOwnProperty('owner') ||
    !review.hasOwnProperty('title') ||
    !review.hasOwnProperty('review_body') ||
    !review.hasOwnProperty('designer') ||
    !review.hasOwnProperty('category')
  ) {
    return Promise.reject({
      errorCode: 400,
      errorMessage:
        'Missing property in review object. Must contain: owner, title, review_body, designer and category.',
    });
  } else if (
    typeof review.owner !== 'string' ||
    typeof review.title !== 'string' ||
    typeof review.review_body !== 'string' ||
    typeof review.designer !== 'string' ||
    typeof review.category !== 'string'
  ) {
    return Promise.reject({
      errorCode: 400,
      errorMessage:
        'Invalid data type in review object. Each value must be passed as a string.',
    });
  }
};
