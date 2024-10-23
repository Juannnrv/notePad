const { expressjwt: expressJwt } = require('express-jwt');


const authJwt = expressJwt({
  secret: `${process.env.JWT_SECRET}`,
  algorithms: ['HS256']
});

module.exports = authJwt;