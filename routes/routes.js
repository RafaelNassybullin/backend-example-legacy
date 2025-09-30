const { Router } = require("express");
const { NotFound } = require("../constants/errors");
const { isAuthorized } = require("../middleware/request-auth.middleware");

module.exports = Router()
  .use(require("./auth"))
  .use(require("./readme"))
  .use(isAuthorized)
  .use(require("./companies"))
  .use(require("./contacts"))
  .use(() => {
    throw new NotFound();
  });
