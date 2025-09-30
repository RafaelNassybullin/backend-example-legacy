const { validationResult, matchedData } = require("express-validator");
const logger = require("../../../services/logger.service")(module);
const { CREATED } = require("../../../constants/http-codes");
const contactMethods = require("../../../DB/psql-db/methods/company");
const {
  BadRequest,
  NotFound,
  UnprocessableEntity,
} = require("../../../constants/errors");
/**
 * POST /companies/:id
 * Эндпоинт создания данных компании.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function createOne(req, res) {
  logger.init("create company");
  const { id } = req.params;

  const formData = matchedData(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new UnprocessableEntity(errors.array()[0].msg);
  }

  const company = await contactMethods.createOne(id, formData);

  if (company === "company exist") {
    throw new BadRequest("Company for this contact is exist");
  } else if (company === "not created") {
    throw new BadRequest("Company is not created");
  } else if (company === "Contact not exist") {
    throw new NotFound("Contact not exist");
  }

  res.status(CREATED).json(company);

  logger.success();
}

module.exports = { createOne };
