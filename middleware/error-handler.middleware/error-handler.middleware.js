/* eslint-disable no-unused-vars */
const { MulterError } = require("multer");
const logger = require("../../services/logger.service")(module);
const {
  ApiError,
  InternalError,
  BadRequest,
  UnprocessableEntity,
} = require("../../constants/errors");

const errorsHandler = [
  (err, req, res, next) => {
    if (err) {
      logger.error(err);
      if (err instanceof MulterError) {
        throw new UnprocessableEntity(err.message);
      } else if (!(err instanceof ApiError)) {
        if (err.type === "entity.parse.failed") {
          throw new BadRequest();
        }
        throw new InternalError();
      }
      throw err;
    } else {
      next();
    }
  },
  (err, req, res, next) => {
    const httpCode = err.http_code;
    const respCode = err.error_code;
    const respErrMessage = err.message;
    logger.error(
      `Request finished with code "${httpCode}" error "${respCode}"`
    );
    res.header("Content-Type", "application/json").status(httpCode).send({
      code: respCode,
      message: respErrMessage,
    });
  },
];

module.exports = { errorsHandler };
