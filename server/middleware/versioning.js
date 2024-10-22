import semver from "semver";

exports.versioning = (version) => {
  return (req, res, next) => {
    if (req.headers["x-version"]) {
      if (semver.eq(req.headers["x-version"], version)) {
        next();
      }
      return next("route");
    } else {
      return next("route");
    }
  };
};