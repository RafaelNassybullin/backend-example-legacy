/**
 * Обработчик query параметров для сортировки name и created_at.
 * @param {string} sortBy
 * @return {string}
 */

function sortCompaniesHelper(sortBy) {
  if (sortBy === "name-asc") {
    return "ORDER BY company.name ASC";
  }
  if (sortBy === "name-desc") {
    return "ORDER BY company.name DESC";
  }
  if (sortBy === "created-desc") {
    return "ORDER BY company.created_at DESC";
  }
  if (sortBy === "created-asc") {
    return "ORDER BY company.created_at ASC";
  }
  if (sortBy === "name-desc_created-desc") {
    return "ORDER BY company.name DESC, company.created_at DESC";
  }
  if (sortBy === "name-asc_created-desc") {
    return "ORDER BY company.name ASC, company.created_at DESC";
  }
  if (sortBy === "name-desc_created-asc") {
    return "ORDER BY company.name DESC, company.created_at ASC";
  }
  if (sortBy === "name-asc_created-asc") {
    return "ORDER BY company.name ASC, company.created_at ASC";
  }
  if (sortBy === "created-desc_name-desc") {
    return "ORDER BY company.created_at DESC, company.name DESC";
  }
  if (sortBy === "created-asc_name-desc") {
    return "ORDER BY company.created_at ASC, company.name DESC";
  }
  if (sortBy === "created-desc_name-asc") {
    return "ORDER BY company.created_at DESC, company.name ASC";
  }
  if (sortBy === "created-asc_name-asc") {
    return "ORDER BY company.created_at ASC, company.name ASC";
  }
  return "";
}

module.exports = { sortCompaniesHelper };
