const { validationResult, matchedData } = require("express-validator");
const logger = require("../../../services/logger.service")(module);
const { CREATED } = require("../../../constants/http-codes");
const contactMethods = require("../../../DB/psql-db/methods/contact");
const { BadRequest } = require("../../../constants/errors");

/**
 * POST /contacts
 * Эндпоинт создания контакта.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function createOne(req, res) {
  logger.init("create contact");

  const formData = matchedData(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array()[0].msg);
  }

  const contact = await contactMethods.createOne(formData);

  if (contact === "Error phone exist") {
    throw new BadRequest("Phone already exist");
  } else if (contact === "Error email exist") {
    throw new BadRequest("Email already exist");
  } else if (!contact) {
    throw new BadRequest("Contact is not created");
  }

  res.status(CREATED).json(contact);
  logger.success();
}

module.exports = { createOne };
