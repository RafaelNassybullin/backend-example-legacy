const { validationResult } = require("express-validator");
const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const companyMethods = require("../../../DB/psql-db/methods/company");
const {
  getUrlForRequest,
  paginationLinksHelper,
} = require("../../../helpers/url.helper");
const { sortCompaniesHelper } = require("../../../helpers/sort.helper");
const { NotFound, BadRequest } = require("../../../constants/errors");
const { parseOne } = require("../companies.service");

/**
 * Эндпоинт получения списка данных компаний c пагинацией, сортировкой по имени и дате создания и/или фильтрации
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function getMany(req, res) {
  logger.init("get companies");

  let { page = 1, limit = 10 } = req.query;
  const { status, types, sortBy } = req.query;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequest(errors.array()[0].msg);
  }

  page = Math.max(1, parseInt(page, 10));
  limit = Math.max(1, Math.min(50, parseInt(limit, 10))); // ограничение до 50 записей

  const offset = Math.abs(((Number(page) || 0) - 1) * limit);
  const url = getUrlForRequest(req);

  // Сортировка по дате и/или имени компании
  const sort = sortCompaniesHelper(sortBy);

  const { count, rows } = await companyMethods.getMany(
    limit,
    offset,
    sort,
    types,
    status
  );

  const totalPages = Math.ceil(Number(parseInt(count, 10)) / limit);

  // Генерация ссылок пагинаций
  const links = paginationLinksHelper(
    url,
    req.originalUrl,
    page,
    totalPages,
    limit
  );

  // Проверка на пустоту данных и query параметров page и limit
  if (!rows.length && !Number.isNaN(page) && !Number.isNaN(limit)) {
    throw new NotFound("Companies not found");
  }

  // Прямые ссылки для photo
  const data = rows.map((company) => parseOne(company, url));

  res.status(OK).json({
    data,
    meta: {
      totalItems: Number(parseInt(count, 10)),
      totalPages,
      currentPage: page,
      limit,
    },
    links,
  });

  logger.success();
}

module.exports = { getMany };
