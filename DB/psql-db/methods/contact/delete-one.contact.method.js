const pool = require("../../../../services/database.service");
const { deleteContactById } = require("../../sql/contact/index");

/**
 * Метод удаления контакта
 * @param {string} id - идентификатор контакта
 * @return {Promise<object>}
 */
async function deleteOne(id) {
  const { rows: companyId } = await pool.query(
    `SELECT id FROM companies WHERE contact_id = $1`,
    [id]
  );
  const { rows: imagePaths } = await pool.query(
    `SELECT filepath, thumbpath FROM photos WHERE company_id = $1`,
    [companyId.length ? companyId[0].id : null]
  );
  const { rows: deletedId } = await pool.query(deleteContactById, [id]);
  return {
    id: deletedId[0]?.id,
    filepath: imagePaths[0]?.filepath,
    thumbpath: imagePaths[0]?.thumbpath,
  };
}

module.exports = { deleteOne };
