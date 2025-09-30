const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const contactMethods = require("../../../DB/psql-db/methods/contact");
const { NotFound } = require("../../../constants/errors");

/**
 * GET /contacts/:id
 * Эндпоинт получения данных контакта.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function getOne(req, res) {
  logger.init("get contact");
  const { id } = req.params;
  const contact = await contactMethods.getOne(id);
  if (!contact) {
    throw new NotFound("Contact not found");
  }
  res.status(OK).json(contact);
  logger.success();
}

module.exports = { getOne };
