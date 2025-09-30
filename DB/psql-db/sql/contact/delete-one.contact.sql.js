const deleteContactById = `
  DELETE FROM contacts WHERE id = $1 RETURNING id;
`;

module.exports = { deleteContactById };
