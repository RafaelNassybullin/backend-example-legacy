const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const readmeService = require("../readme.service");

/**
 * GET /
 * Эндпоинт просмотра HTML с описанием тестового задания.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function getHtml(req, res) {
  logger.init("get readme html");
  const file = fs.readFileSync(path.resolve("README.md"), "utf8");
  const pageContent = marked(file.toString());
  res.status(OK).send(readmeService.renderPage(pageContent));
  logger.success();
}

module.exports = {
  getHtml,
};
