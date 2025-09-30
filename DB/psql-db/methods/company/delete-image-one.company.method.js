const pool = require("../../../../services/database.service");
/**
 * Метод удаления названий изображений компаний по id
 * @param {object} id - id компаниии.
 * @return {Promise<Object|string>}
 */
async function deleteImage(id) {
  const { rows: deleted } = await pool.query(
    `DELETE FROM photos WHERE company_id = $1 RETURNING *;`,
    [id]
  );

  return deleted.length ? deleted[0] : "Delete image failed";
}

module.exports = { deleteImage };
