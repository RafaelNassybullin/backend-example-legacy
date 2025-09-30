const getContactById = `
  SELECT 
    id,
    lastname,
    firstname,
    patronymic,
    phone,
    email,
    created_at,
    updated_at
  FROM 
    contacts
  WHERE id = $1
  LIMIT 1;
`;

module.exports = { getContactById };
