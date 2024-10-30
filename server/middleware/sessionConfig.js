const session = require('express-session');

class SessionService {
  static initializeSession(app) {
    app.use(
      session({
        secret: `${process.env.JWT_SECRET}`,
        resave: false,
        saveUninitialized: false, 
        cookie: {
          secure: true, 
          httpOnly: true,
          maxAge: 30 * 60 * 1000,
          sameSite: 'None' 
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