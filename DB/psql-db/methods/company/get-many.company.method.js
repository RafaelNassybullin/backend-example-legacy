const { getCompanies, countQuery } = require("../../sql/company/index");
const pool = require("../../../../services/database.service");

/**
 * Метод получения списка компаний
 * @param {number} limit - лимит получаемых компаний
 * @param {number} offset - пропуск данных для пагинации
 * @param {string} sort - данные для сортировки по дате создания и/или имени
 * @param {string} types - типы компаний
 * @param {string} status - статус "active" или "inactive"
 * @return {Promise<Object|null>} Данные компании или `null`, если компания не найдена.
 */
async function getMany(limit, offset, sort, types, status) {
  const typesArray = types?.split(",").length ? types?.split(",") : null;
  const sqlQuery = getCompanies(sort);
  const { rows } = await pool.query(sqlQuery, [
    limit,
    offset,
    status,
    typesArray,
  ]);
  const { rows: countRows } = await pool.query(countQuery, [
    status,
    typesArray,
  ]);
  return { count: countRows[0].count, rows };
}

module.exports = { getMany };
