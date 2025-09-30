/* eslint-disable consistent-return */
const express = require("express");
require("express-async-errors");
const httpContext = require("express-http-context");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const useragent = require("express-useragent");
const config = require("./config");
const logger = require("./services/logger.service")(module);
const { errorsHandler } = require("./middleware/error-handler.middleware");
const { OK } = require("./constants/http-codes");

const app = express();

app.set("json replacer", (k, v) => (v === null ? undefined : v));
app.disable("x-powered-by");
app.enable("trust proxy");

app.use(useragent.express());

// http context
app.use(httpContext.middleware);
app.use((req, res, next) => {
  const proto =
    req.headers["x-forwarded-proto"] || req.socket.encrypted ? "https" : "http";
  const url = `${proto}://${req.get("Host")}`;
  httpContext.ns.bindEmitter(req);
  httpContext.ns.bindEmitter(res);
  httpContext.set("method", req?.method);
  httpContext.set("path", req?.url);
  httpContext.set("url", url);
  next();
});

if (config.env.dev) {
  // swagger
  const { swaggerOptions } = require("./config/swagger");
  const swaggerRoute = `/${config.prefix}/docs`;
  app.use(swaggerRoute, swaggerUI.serve, swaggerUI.setup(swaggerOptions));

  app.get(`/${config.prefix}/swagger.json`, (_, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(OK).json(swaggerOptions);
  });

  logger.info(`For swagger doc visit: ${config.url}${swaggerRoute}`);
}

// log every request
app.use((req, res, next) => {
  logger.debug();
  next();
});

// cors
app.use(cors(config.cors));

// body parsing
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/static", express.static("public"));

app.use(express.json());

// routes
app.use(`/${config.prefix}/`, require("./routes"));

// error handling
app.use(...errorsHandler);

module.exports = { app };
