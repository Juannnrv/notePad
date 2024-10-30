const jwt = require("jsonwebtoken");

class JwtService {
  static generateToken(payload) {
    const expiresIn = 30 * 60 * 1000;
    return jwt.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn });
  }

  static verifyToken(token) {
    return jwt.verify(token, `${process.env.JWT_SECRET}`);
  }
}

module.exports = JwtService;