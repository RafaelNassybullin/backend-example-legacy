const { Router } = require("express");
const multer = require("multer");
const actions = require("./contacts.actions");
const validator = require("./contacts.validator");

const multipartData = multer().none();

module.exports = Router()
  .get("/contacts/:id", ...validator.getOne, actions.getOne)
  .post("/contacts", multipartData, ...validator.createOne, actions.createOne)
  .patch("/contacts/:id", multipartData, ...validator.editOne, actions.editOne)
  .delete("/contacts/:id", ...validator.getOne, actions.deleteOne);
