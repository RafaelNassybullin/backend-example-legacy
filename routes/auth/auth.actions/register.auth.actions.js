const bcrypt = require("bcrypt");
const { validationResult, matchedData } = require("express-validator");
const logger = require("../../../services/logger.service")(module);
const { CREATED } = require("../../../constants/http-codes");
const authMethods = require("../../../DB/psql-db/methods/auth");
const { BadRequest } = require("../../../constants/errors");

/**
 * POST /register
 * Эндпоинт создания данных компании.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function register(req, res) {
  logger.init("auth register");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array()[0].msg);
  }

  const { name, username, password } = matchedData(req);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authMethods.register(name, username, hashedPassword);

  if (user === "username exist") {
    throw new BadRequest("User with this username is already exist");
  } else if (user === null) {
    throw new BadRequest("Register failed");
  }

  res.status(CREATED).json({ message: "User registered", userId: user.id });
  logger.success();
}

module.exports = { register };
