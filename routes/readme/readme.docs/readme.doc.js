const {
  OK,
  INTERNAL_ERROR,
  NOT_FOUND,
} = require("../../../constants/http-codes");
const {
  internalError,
  notFound,
} = require("../../../config/swagger/common-errors");

module.exports = {
  "/": {
    get: {
      description: "Get README html",
      tags: ["Readme"],
      responses: {
        [OK]: {
          description: "README html page",
          content: {
            "text/html": {},
          },
        },
        [INTERNAL_ERROR]: internalError,
        [NOT_FOUND]: notFound,
      },
    },
  },
};
