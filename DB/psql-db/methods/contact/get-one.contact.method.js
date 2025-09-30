const pool = require("../../../../services/database.service");
const { getContactById } = require("../../sql/contact/index");

/**
 * Возвращает данные контакта с указанным идентификатором.
 * @param {string} id - идентификатор контакта
 * @return {Promise<Object|null>}
 */
async function getOne(id) {
  const { rows } = await pool.query(getContactById, [id]);
  return parseInt(id, 10) === Number(rows[0]?.id) ? rows[0] : null;
}

module.exports = { getOne };
