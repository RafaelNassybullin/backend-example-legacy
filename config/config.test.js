const config = require("./config.global");

config.log.console = true;
config.log.debug = true;

config.sample_db = "";

config.jwt.secretKey = "";
config.jwt.verify.maxAge = 604800;

module.exports = config;
