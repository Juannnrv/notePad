const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  const token = req.session.authToken;
  if (!token) {
    return res.status(401).json({ status: 401, message: 'Session expired.' });
  }
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: 'Invalid token.' });
  }
};

module.exports = verifyJwt;