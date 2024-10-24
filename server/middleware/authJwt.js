const { expressjwt: expressJwt } = require('express-jwt');

const authJwt = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
}).unless({
  path: [
    '/users/create',
    '/users/login'
  ]
});

const handleAuthErrors = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid or missing token. Please provide a valid token or sign up.' });
  } else {
    next(err);
  }
};

module.exports = { authJwt, handleAuthErrors };