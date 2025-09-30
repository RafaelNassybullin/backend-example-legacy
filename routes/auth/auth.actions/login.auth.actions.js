const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcrypt");
const logger = require("../../../services/logger.service")(module);
const { CREATED } = require("../../../constants/http-codes");
const authMethods = require("../../../DB/psql-db/methods/auth");
const { BadRequest, NotFound } = require("../../../constants/errors");
const { generateTokens } = require("../../../helpers/token.helper");

/**
 * POST /login
 * Эндпоинт логина.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function login(req, res) {
  logger.init("auth login");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array()[0].msg);
  }

  const { username, password } = matchedData(req);

  const user = await authMethods.login(username);

  if (user === null) {
    throw new NotFound("Username does not exist!");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new BadRequest("Password is not valid!");
  }

  const tokens = generateTokens(user);

  res.status(CREATED).json(tokens);

  logger.success();
}

module.exports = { login };
