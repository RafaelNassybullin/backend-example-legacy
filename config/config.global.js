const config = {};
const path = require("path");

// APP SETTINGS
config.port = process.env.PORT;
config.prefix = process.env.PREF;
config.url = process.env.URL;

// ENV
config.env = {};
config.env.dev = process.env.NODE_ENV === "dev";
config.env.production = process.env.NODE_ENV === "production";
config.env.test = process.env.NODE_ENV === "test";

// DB SETTINGS
config.dbs = {};
config.dbs.sample_db = {};
config.dbs.sample_db.uri = process.env.DBURI;
config.dbs.sample_db.database = process.env.DATABASE;
config.dbs.sample_db.id = process.env.DB;

// LOG SETTINGS
config.log = {};
config.log.errorlog = path.resolve("log/errors.log");
config.log.combined = path.resolve("log/combined.log");

config.log.console = config.env.dev || config.env.test;
config.log.debug = config.env.dev || config.env.test;

// CORS SETTINGS
config.cors = {};
config.cors.credentials = true;
config.cors.origin = true;
config.cors.methods = [
  "GET",
  "PUT",
  "POST",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
];
config.cors.allowedHeaders = ["Content-Type", "Authorization"];
config.cors.exposedHeaders = ["X-Total-Count", "Content-Type", "Authorization"];

// JWT SERVICE SETTINGS
config.jwt = {};
config.jwt.accessSecretKey =
  process.env.ACCESSSECRETKEY;
config.jwt.refreshSecretKey =
  process.env.REFRESHSECRETKEY;
config.jwt.sign = {};
config.jwt.sign.issuer = "Test API js backend";
config.jwt.sign.audience = "";
config.jwt.verify = {};

// UPLOAD IMAGE SETTINGS
config.images = {};
config.images.uploadsDir = "./uploads";
config.images.imagesDir = "public/images/";
config.images.thumbSize = 160;

module.exports = config;
