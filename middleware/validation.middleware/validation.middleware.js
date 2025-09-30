const expressValidator = require("express-validator");
const logger = require("../../services/logger.service")(module);

const { validationResult } = expressValidator;

const { UnprocessableEntity } = require("../../constants/errors");

module.exports = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errorsToLog = [];
    const errorsToReturn = [];
    validationErrors.array().forEach((error) => {
      if (error.msg?.message) {
        errorsToReturn.push(error.msg?.message);
      }

      errorsToLog.push(
        `${error.msg?.message ? error.msg.message : error.msg} ${
          error.param
        } ${JSON.stringify(error.value)}`
      );
    });
    logger.error(errorsToLog.join(", "));
    const errorMsg = errorsToReturn.length
      ? errorsToReturn.join(",")
      : undefined;
    throw new UnprocessableEntity(errorMsg);
  }
  next();
};
