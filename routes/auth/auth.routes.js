const multer = require("multer");
const { Router } = require("express");
const actions = require("./auth.actions");
const validator = require("./auth.validator");

const multipartData = multer().none();

module.exports = Router()
  .post("/register", multipartData, ...validator.register, actions.register)
  .post("/login", multipartData, ...validator.login, actions.login)
  .put("/refresh", multipartData, ...validator.refresh, actions.refresh);
