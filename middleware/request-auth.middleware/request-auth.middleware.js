const jwt = require("jsonwebtoken");
const logger = require("../../services/logger.service")(module);
const { Unauthorized, ApiError } = require("../../constants/errors");
const jwtConfig = require("../../config").jwt;

module.exports = {
  isAuthorized,
};

async function isAuthorized(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    if (!_isValidHeader(authHeader) || !_isValidHeaderValue(authHeader)) {
      throw new Unauthorized();
    }
    const token = authHeader.split(" ").pop();

    // проверяет и расшифровывает токен авторизации
    const decoded = jwt.verify(token, jwtConfig.accessSecretKey);

    req.payload = { id: decoded.userId };
  } catch (err) {
    logger.error(err.message);
    let error;
    if (err instanceof ApiError) {
      error = err;
    } else {
      error = new Unauthorized();
    }
    return res.status(error.http_code).json({
      code: error.error_code,
      message: error.message,
    });
  }
  return next();
}

function _isValidHeader(header) {
  return typeof header === "string";
}

function _isValidHeaderValue(header) {
  return header.match(/(^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$)/gi);
}
