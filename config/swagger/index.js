const { version, description, license } = require("../../package.json");
const config = require("..");
const commonErrors = require("./common-errors");

const servers = [
  {
    url: `${config.url}/${config.prefix}`,
    description: `${process.env.NODE_ENV} server`,
  },
];

const securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  },
};

const requestBodies = {};

const responses = {
  commonErrors,
};

const tags = [
  {
    name: "Auth",
  },
  {
    name: "Readme",
  },
  {
    name: "Contacts",
  },
  {
    name: "Companies",
  },
];

const security = [{ bearerAuth: [] }];

const swaggerOptions = {
  openapi: "3.0.0",
  info: {
    title: "Test API js backend (From Rafael Nassybullin)",
    description,
    license,
    version,
  },
  components: {
    securitySchemes,
    requestBodies,
    responses,
  },
  security,
  tags,
  servers,
  paths: {
    ...require("../../routes/auth/auth.docs"),
    ...require("../../routes/readme/readme.docs"),
    ...require("../../routes/contacts/contacts.docs"),
    ...require("../../routes/companies/companies.docs"),
  },
};

module.exports = { swaggerOptions };
