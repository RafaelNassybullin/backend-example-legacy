const multer = require("multer");
const { Router } = require("express");
const actions = require("./companies.actions");
const validator = require("./companies.validator");
const config = require("../../config");

const multipartData = multer().none();
const fileHandler = multer({ dest: config.images.uploadsDir });

module.exports = Router()
  .get("/companies/:id", ...validator.getOne, actions.getOne)
  .get("/companies", ...validator.getMany, actions.getMany)
  .post(
    "/companies/:id",
    multipartData,
    ...validator.createOne,
    actions.createOne
  )
  .patch("/companies/:id", multipartData, ...validator.editOne, actions.editOne)
  .post(
    "/companies/:id/image",
    fileHandler.fields([{ name: "file", maxCount: 1 }]),
    ...validator.addImage,
    actions.addImage
  )
  .delete(
    "/companies/:id/image",
    ...validator.removeImage,
    actions.removeImage
  );
