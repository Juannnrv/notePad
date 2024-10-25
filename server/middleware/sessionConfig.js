const session = require('express-session');
const fs = require("fs");
const secret = fs.readFileSync("certificate.csr", "utf8");

class SessionService {
  static initializeSession(app) {
    app.use(
      session({
        secret: secret,
        resave: false,
        saveUninitialized: false, 
        cookie: {
          secure: false, 
          httpOnly: true, 
          maxAge: 30 * 60 * 1000,
          sameSite: 'lax'
        },
      })
    );
  }

  static setSession(req, key, value) {
    req.session[key] = value;
  }

  static getSession(req, key) {
    return req.session[key];
  }

  static destroySession(req) {
    req.session.destroy();
  }
}

module.exports = SessionService;