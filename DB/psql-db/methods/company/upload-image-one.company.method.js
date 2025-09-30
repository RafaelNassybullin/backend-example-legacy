const pool = require("../../../../services/database.service");

/**
 * Метод сохрания названий изображений после загрузки изображений по ID.
 * @param {object} image - обьект с данными изображения.
 * @return {Promise<Object|null>} Данные компании или `null`, если компания не найдена.
 */
async function saveImage(id, image) {
  const { name, filepath, thumbpath } = image;

  const { rows: photos } = await pool.query(
    `INSERT INTO photos (company_id, name, filepath, thumbpath) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [id, name, filepath, thumbpath]
  );

  return photos.length ? photos[0] : "Save image failed";
}

module.exports = { saveImage };
