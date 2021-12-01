exports.getMessage = (req, res) => {
  res.status(200).send({
    message: 'Welcome to my games API!',
    endpoints: {
      api: ['/api'],
      categories: ['GET /api/categories'],
      reviews: [
        'GET /api/reviews',
        'GET /api/reviews/:review_id',
        'PATCH /api/reviews/:review_id',
        'GET /api/reviews/:review_id/comments',
        'POST /api/reviews/:review_id/comments'
      ],
      comments: ['DELETE /api/comments/:comment_id', 'PATCH /api/comments/:comment_id'],
      users: ['GET /api/users', 'GET /apo/users/:username']
    }
  });
};
