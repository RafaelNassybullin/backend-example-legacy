const httpContext = require("express-http-context");
const log4js = require("log4js");
const path = require("path");
const config = require("../config").log;

const log4jsLogger = _configure();
const log4jsCombinedLogger = log4jsLogger.getLogger("combined");
const log4jsErrorLogger = log4jsLogger.getLogger("error");

const stack = [];

module.exports = (callingModule) => {
  const parts = callingModule.filename.split(path.sep);
  const moduleFilename = parts[parts.length - 1];
  const moduleLabel =
    moduleFilename === "index.js"
      ? parts[parts.length - 2]
      : parts[parts.length - 1];
  return {
    params: { module: moduleLabel },
    init(str) {
      this.params.context = str;
      stack.push(this.params.context);
      log4jsCombinedLogger.info(_formatMessage(this.params, "started"));
    },
    info(message) {
      log4jsCombinedLogger.info(_formatMessage(this.params, message));
    },
    warn(message) {
      log4jsCombinedLogger.warn(_formatMessage(this.params, message));
    },
    error(message) {
      log4jsCombinedLogger.error(_formatMessage(this.params, message));
      log4jsErrorLogger.error(_formatMessage(this.params, message));
    },
    debug(message) {
      if (config.debug) {
        log4jsCombinedLogger.debug(_formatMessage(this.params, message));
      }
    },
    success() {
      this.params.context = stack.pop() || [];
      log4jsCombinedLogger.info(_formatMessage(this.params, "succeed"));
    },
    shutdown(cb) {
      log4js.shutdown(cb);
    },
  };
};

function _formatMessage(params, message) {
  const reqMethod = httpContext.get("method");
  const reqPath = httpContext.get("path");
  const userId = httpContext.get("user");

  const messageArr = [
    ...(params.module ? [`[${params.module}]`] : []),
    ...(reqMethod ? [reqMethod] : []),
    ...(reqPath ? [reqPath] : []),
    ...(userId ? [userId] : []),
    ...(params.context ? [params.context] : []),
  ];

  if (config.debug && message instanceof Error) {
    messageArr.push(`${message.message} ${message.stack}`);
  } else if (message instanceof Error) {
    messageArr.push(message.message);
  } else {
    messageArr.push(message);
  }

  return messageArr.join(" ");
}

function _configure() {
  const logAppenders = {
    error: { type: "file", filename: config.errorlog },
    combined: { type: "file", filename: config.combined },
  };

  if (config.console) {
    logAppenders.console = { type: "console" };
  }

  const combinedAppenders = [
    "combined",
    ...(config.console ? ["console"] : []),
  ];

  log4js.configure({
    appenders: logAppenders,
    categories: {
      error: { appenders: ["error"], level: "ERROR" },
      combined: { appenders: combinedAppenders, level: "ALL" },
      default: { appenders: Object.keys(logAppenders), level: "ALL" },
    },
    disableClustering: true,
  });

  return log4js;
}
