const { createContact } = require("../../sql/contact/index");
const pool = require("../../../../services/database.service");

/**
 * Метод сохранения контакта
 * @param {Object} formData - Данные контакта
 * @return {Promise<Object|null>}
 */
async function createOne(formData) {
  const { lastname, firstname, patronymic, phone, email } = formData;
  const { rows: existPhone } = await pool.query(
    `SELECT phone FROM contacts WHERE phone = $1`,
    [phone]
  );
  const { rows: existEmail } = await pool.query(
    `SELECT email FROM contacts WHERE email = $1`,
    [email]
  );
  if (existPhone[0]?.phone) {
    return "Error phone exist";
  }
  if (existEmail[0]?.email) {
    return "Error email exist";
  }
  const { rows } = await pool.query(createContact, [
    lastname,
    firstname,
    patronymic,
    phone,
    email,
  ]);
  return rows[0];
}

module.exports = { createOne };
