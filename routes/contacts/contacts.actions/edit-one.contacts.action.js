const { validationResult, matchedData } = require("express-validator");
const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const contactMethods = require("../../../DB/psql-db/methods/contact");
const {
  BadRequest,
  NotFound,
  UnprocessableEntity,
} = require("../../../constants/errors");

/**
 * POST /contacts
 * Эндпоинт создания контакта.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function editOne(req, res) {
  logger.init("edit contact");
  const { id } = req.params;

  const formData = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new UnprocessableEntity(
      Number.isNaN(Number(id))
        ? errors.array()[0].msg.message
        : errors.array()[0].msg
    );
  }

  const contact = await contactMethods.editOne(id, formData);

  if (contact === "Error phone exist") {
    throw new BadRequest("Phone already exist");
  } else if (contact === "Error email exist") {
    throw new BadRequest("Email already exist");
  } else if (contact === "Contact is not exist!") {
    throw new NotFound("Contact not found");
  }

  res.status(OK).json(contact);
  logger.success();
}

module.exports = { editOne };
