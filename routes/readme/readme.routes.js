const { Router } = require("express");
const actions = require("./readme.actions");

module.exports = Router().get("/", actions.getHtml);
