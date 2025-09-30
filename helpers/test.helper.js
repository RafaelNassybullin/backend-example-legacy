// const { DateTime } = require("luxon");

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const formatDates = (contact) => ({
  ...contact,
  created_at: contact.created_at.toISOString(),
  updated_at: contact.updated_at.toISOString(),
});

const patchTool = (contact, updatedContactValues) => ({
  ...contact,
  lastname: updatedContactValues.lastname,
  firstname: updatedContactValues.firstname,
});

function generateRandomEmail() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const domain = "mail.com";
  const randomString = Array.from(
    { length: 10 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${randomString}@${domain}`;
}

function transformData(company, address, contract, companyType, photos) {
  return {
    id: company.id,
    contact_id: company.contact_id,
    name: company.name,
    short_name: company.short_name,
    business_entity: company.business_entity,
    status: company.status,
    created_at: company.created_at.toISOString(),
    updated_at: company.updated_at.toISOString(),
    contract: contract
      ? {
          no: contract.contract_no,
          issue_date: contract.issue_date,
        }
      : null,
    type: companyType ? [companyType.type] : [],
    photos: photos.photo || [],
    address: {
      city: address.city,
      street: address.street,
      country: address.country,
      postal_code: address.postal_code,
    },
  };
}

module.exports = {
  getRandomNumber,
  transformData,
  formatDates,
  patchTool,
  generateRandomEmail,
};
