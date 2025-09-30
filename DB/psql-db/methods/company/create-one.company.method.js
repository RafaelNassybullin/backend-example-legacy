const { getCompanyById } = require("../../sql/company/index");
const pool = require("../../../../services/database.service");

/**
 * Метод создания компании по существующему контакту contact_id
 * @param {number} id - ID контакта contact_id
 * @param {Object} formData - Данные для добавления
 * @return {Promise<Object|string>}
 */
async function createOne(id, formData) {
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
      "SELECT id FROM companies WHERE contact_id = $1",
      [id]
    );

    const { rows: contactNotExist } = await client.query(
      "SELECT id FROM contacts WHERE id = $1",
      [id]
    );

    if (!contactNotExist.length) {
      return "Contact not exist";
    }

    if (companyExist[0]?.id) {
      return "company exist";
    }

    await client.query("BEGIN");
    const { rows: companies } = await client.query(
      `INSERT INTO companies (contact_id, name, short_name, business_entity, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [id, name, shortName, businessEntity, status]
    );
    const companyId = companies[0].id;
    await client.query(
      `INSERT INTO address (company_id, street, city, postal_code, country) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [companyId, street, city, postalCode, country]
    );

    const compTypesArray = companyTypes
      .split(",")
      .filter((type) => type.trim() !== "");
    if (compTypesArray.length === 0) {
      return;
    }

    const values = compTypesArray.map((_, i) => `($1, $${i + 2})`).join(", ");
    const query = `INSERT INTO company_types (company_id, type) VALUES ${values} RETURNING *`;

    await client.query(query, [companyId, ...compTypesArray]);

    await client.query(
      `INSERT INTO contracts (company_id, contract_no) VALUES ($1, $2) RETURNING *`,
      [companyId, contract]
    );

    const { rows: result } = await client.query(getCompanyById, [companyId]);

    await client.query("COMMIT");

    if (!result.length) {
      return "not created";
    }

    return result[0];
  } finally {
    client.release();
  }
}

module.exports = { createOne };
