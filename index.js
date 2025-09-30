const { startServer } = require("./server");
const logger = require("./services/logger.service")(module);

(async () => {
  try {
    startServer();
  } catch (error) {
    logger.error(error.message);
    logger.shutdown(() => process.exit(1));
  }
})();

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, async () => {
    logger.info(`Caught signal ${signal}`);
    logger.shutdown(() => process.exit(0));
  })
);

process.on("uncaughtException", async (error) => {
  logger.error(`Uncaught exception! ${error.message}`);
  logger.shutdown(() => process.exit(1));
});
