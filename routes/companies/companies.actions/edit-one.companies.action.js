const { validationResult, matchedData } = require("express-validator");
const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const companyMethods = require("../../../DB/psql-db/methods/company");
const {
  BadRequest,
  UnprocessableEntity,
  NotFound,
} = require("../../../constants/errors");
const { getUrlForRequest } = require("../../../helpers/url.helper");
const { parseOne } = require("../companies.service");

/**
 * POST /companies/:id
 * Эндпоинт редактирования компании.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function editOne(req, res) {
  logger.init("edit company");
  const { id } = req.params;

  const formData = matchedData(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new UnprocessableEntity(errors.array()[0].msg);
  }

  const company = await companyMethods.editOne(id, formData);

  if (company === "company not found") {
    throw new NotFound("Company is not found");
  } else if (company === "update failed") {
    throw new BadRequest("Update failed");
  }

  const photoUrl = getUrlForRequest(req);
  res.status(OK).json(parseOne(company, photoUrl));
  logger.success();
}

module.exports = { editOne };
