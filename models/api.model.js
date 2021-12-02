const categoriesRouter = require('../routers/categories.router');

exports.fetchEndpoints = stacks => {
  return new Promise(resolve => {
    const welcomeResponse = {
      message: 'Welcome to my games API!',
      endpoints: { api: ['get: /'], categories: [], reviews: [], comments: [], users: [] }
    };

    for (const key in stacks) {
      stacks[key].forEach(element => {
        welcomeResponse.endpoints[key].push(
          `${Object.keys(element.route.methods)[0]}: ${element.route.path}`
        );
      });
    }

    resolve(welcomeResponse);
    reject({ errorCode: 500, errorMessage: 'Unknown Error.' });
  });
};
