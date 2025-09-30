module.exports = {
  ...require("./get-one.companies.action"),
  ...require("./get-many.companies.action"),
  ...require("./add-image.companies.action"),
  ...require("./remove-image.companies.action"),
  ...require("./create-one.company.method"),
  ...require("./edit-one.companies.action"),
};
