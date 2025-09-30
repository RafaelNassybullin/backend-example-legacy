/* eslint-disable consistent-return */
const http = require("http");
const config = require("./config");
const logger = require("./services/logger.service")(module);
const { app } = require("./app");

const PORT = config.port;

function startServer() {
  http.createServer(app).listen(PORT, () => {
    logger.info(`App has been started on port ${PORT}...`);
  });
}

module.exports = {
  startServer,
};
