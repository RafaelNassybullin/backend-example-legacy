const pool = require("../../../../services/database.service");
const { getCompanyById } = require("../../sql/company/index");
/**
 * Возвращает данные компании с указанным идентификатором.
 * @param {string} id - Идентификатор компании.
 * @return {Promise<Object|null>} Данные компании или `null`, если компания не найдена.
 */
async function getOne(id) {
  const { rows } = await pool.query(getCompanyById, [id]);
  return parseInt(id, 10) === Number(rows[0]?.id) ? rows[0] : null;
}

module.exports = { getOne };
