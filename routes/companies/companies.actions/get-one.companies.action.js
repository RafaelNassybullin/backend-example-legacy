const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const companyMethods = require("../../../DB/psql-db/methods/company");
const { getUrlForRequest } = require("../../../helpers/url.helper");
const { NotFound } = require("../../../constants/errors");
const { parseOne } = require("../companies.service");

/**
 * GET /companies
 * Эндпоинт получения данных компании.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function getOne(req, res) {
  logger.init("get company");
  const { id } = req.params;
  const company = await companyMethods.getOne(id);
  if (!company) {
    throw new NotFound("Company not found");
  }
  const photoUrl = getUrlForRequest(req);
  res.status(OK).json(parseOne(company, photoUrl));
  logger.success();
}

module.exports = { getOne };
