const jwt = require("jsonwebtoken");
const { validationResult, matchedData } = require("express-validator");
const logger = require("../../../services/logger.service")(module);
const { CREATED } = require("../../../constants/http-codes");
const { generateTokens } = require("../../../helpers/token.helper");
const jwtConfig = require("../../../config").jwt;
const { BadRequest } = require("../../../constants/errors");

/**
 * PUT /refresh
 * Эндпоинт обновления токенов.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */

async function refresh(req, res) {
  logger.init("auth refresh");
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new BadRequest(errors.array()[0].msg);
    }

    const { refreshToken } = matchedData(req);
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecretKey);
    const newTokens = generateTokens(decoded.userId);
    res.status(CREATED).json(newTokens);
    logger.success();
  } catch (e) {
    throw new BadRequest(
      e.message.replace(/^./, (match) => match.toUpperCase()) ||
        "Refresh token not valid"
    );
  }
}

module.exports = { refresh };
