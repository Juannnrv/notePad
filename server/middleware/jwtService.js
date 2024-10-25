const jwt = require("jsonwebtoken");
const fs = require("fs");
const secret = fs.readFileSync("certificate.csr", "utf8");

class JwtService {
  static generateToken(payload) {
    const expiresIn = 30 * 60 * 1000;
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verifyToken(token) {
    return jwt.verify(token, secret);
  }
}

module.exports = JwtService;