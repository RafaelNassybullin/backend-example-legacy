/* eslint-disable security/detect-non-literal-require */
/* eslint-disable import/no-dynamic-require */
const env = process.env.NODE_ENV || "dev";
const cfg = require(`./config.${env}`);

module.exports = cfg;
