const mongoose = require("mongoose");

class db {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(
        `${process.env.MONGO_PROTOCOLO}${process.env.MONGO_USER}:${process.env.MONGO_PSW}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`
      )
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error({
          message: "Database connection error",
          error: err.message,
        });
      });
  }

  static getInstace() {
    if (!this.instance) {
      this.instance = new db();
    }
    return this.instance;
  }
}

module.exports = db;
