const pool = require("../../../../services/database.service");

/**
 * Метод редактировая контакта по ID
 * @param {string} id - идентификатор контакта
 * @param {Object} formData
 * @return {Promise<Object|string>}
 */
async function editOne(id, formData) {
  const { phone, email } = formData;
  const client = await pool.connect();

  try {
    const { rows: existContact } = await client.query(
      `SELECT id FROM contacts WHERE id = $1`,
      [id]
    );

    if (existContact.length === 0) {
      return "Contact is not exist!";
    }

    const { rows: existPhone } = await client.query(
      `SELECT phone FROM contacts WHERE phone = $1 AND id != $2`,
      [phone, id]
    );

    const { rows: existEmail } = await client.query(
      `SELECT email FROM contacts WHERE email = $1 AND id != $2`,
      [email, id]
    );

    if (existPhone[0]?.phone) {
      return "Error phone exist";
    }
    if (existEmail[0]?.email) {
      return "Error email exist";
    }
    const patchFields = Object.keys(formData)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const patchValues = Object.values(formData);
    const { rows } = await client.query(
      `UPDATE contacts SET ${patchFields} WHERE id = $${
        patchValues.length + 1
      } RETURNING *;`,
      [...patchValues, id]
    );
    return rows[0];
  } finally {
    client.release();
  }
}

module.exports = { editOne };
