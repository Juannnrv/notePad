const semver = require("semver");

exports.versioning = (version) => {
  return (req, res, next) => {
    if (req.headers["x-version"]) {
      if (semver.eq(req.headers["x-version"], version)) {
        next();
      } else {
        return next("route");
      }
    } else {
      return next("route");
    }
  };
};