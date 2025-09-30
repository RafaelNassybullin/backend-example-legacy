const createContact = `
  INSERT INTO contacts (lastname, firstname, patronymic, phone, email)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

module.exports = { createContact };
