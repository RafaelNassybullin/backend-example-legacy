const config = require("./config.global");

config.jwt.accessSecretKey =
  process.env.ACCESSSECRETKEY;
config.jwt.refreshSecretKey =
  process.env.REFRESHSECRETKEY;
config.jwt.verify.maxAge = process.env.MAXAGE;

module.exports = config;
