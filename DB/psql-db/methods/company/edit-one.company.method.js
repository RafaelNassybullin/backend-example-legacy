const { getCompanyById } = require("../../sql/company/index");
const pool = require("../../../../services/database.service");

/**
 * Метод частичного обновления данных компании (PATCH)
 * @param {number} id - ID компании
 * @param {Object} formData - Данные для обновления
 * @return {Promise<Object|string>}
 */
async function editOne(id, formData) {
  const client = await pool.connect();

  const {
    name,
    shortName,
    businessEntity,
    status,
    companyTypes,
    contract,
    street,
    city,
    postalCode,
    country,
  } = formData;

  try {
    const { rows: companyExist } = await client.query(
      "SELECT id FROM companies WHERE id = $1",
      [id]
    );

    if (!companyExist[0]?.id) {
      return "company not found";
    }

    await client.query("BEGIN");

    if (name || shortName || businessEntity || status) {
      await client.query(
        `UPDATE companies 
       SET name = COALESCE($1, name), 
           short_name = COALESCE($2, short_name), 
           business_entity = COALESCE($3, business_entity), 
           status = COALESCE($4, status) 
       WHERE id = $5`,
        [name, shortName, businessEntity, status, id]
      );
    }

    if (street || city || postalCode || country) {
      await client.query(
        `UPDATE address 
       SET street = COALESCE($1, street), 
           city = COALESCE($2, city), 
           postal_code = COALESCE($3, postal_code), 
           country = COALESCE($4, country) 
       WHERE company_id = $5`,
        [street, city, postalCode, country, id]
      );
    }

    if (companyTypes) {
      await client.query(`DELETE FROM company_types WHERE company_id = $1`, [
        id,
      ]);
      const compTypesValues = companyTypes
        .split(",")
        .map((type) => `(${id}, '${type.trim()}')`)
        .join(", ");
      await client.query(
        `INSERT INTO company_types (company_id, type) VALUES ${compTypesValues}`
      );
    }

    if (contract) {
      await client.query(
        `UPDATE contracts 
       SET contract_no = COALESCE($1, contract_no) 
       WHERE company_id = $2`,
        [contract, id]
      );
    }

    const { rows: result } = await client.query(getCompanyById, [id]);

    await client.query("COMMIT");

    return result.length ? result[0] : "update failed";
  } finally {
    client.release();
  }
}

module.exports = { editOne };
