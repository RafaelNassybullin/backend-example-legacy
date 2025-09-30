const {
  INTERNAL_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
} = require("../../../constants/http-codes");
const {
  internalError,
  notFound,
  badRequest,
} = require("../../../config/swagger/common-errors");

module.exports = {
  "/register": {
    post: {
      summary: "Creating a new user",
      description: `Сreating a new user required fields: name, username and password!`,
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "username", "password"],
              properties: {
                name: { type: "string", example: "Robert" },
                username: { type: "string", example: "IronManMk43" },
                password: {
                  type: "string",
                  example: "gfgj6y45hgfnduku%RGH##%%8764",
                },
              },
            },
          },
        },
      },
      responses: {
        [CREATED]: {
          description: "Displayed if successfully registered!",
          content: {
            "application/json": {
              example: {
                message: "User registered",
                userId: 1,
              },
            },
          },
        },
        [BAD_REQUEST]: badRequest,
        [NOT_FOUND]: notFound,
        [INTERNAL_ERROR]: internalError,
      },
    },
  },
  "/login": {
    post: {
      summary: "Auth login with username and password!",
      description: "Auth Login with username and password to generate tokens!",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "IronManMk43" },
                password: {
                  type: "string",
                  example: "gfgj6y45hgfnduku%RGH##%%8764",
                },
              },
            },
          },
        },
      },
      responses: {
        [CREATED]: {
          description: "Displayed if successfully logged!",
          content: {
            "application/json": {
              example: {
                accessToken:
                  "eyJhbGcidfgOiJIUdfgzI1NiIsInRgdfg5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJdfgpYXQiOjE3NDdsfgdfEzMzA5NdfgDEsImV4cCI6MTc0MTMzMzY0MX0.ZdY2Nt5_yi0dFKjeLXcb8Nk9dfg09SAR-Z2ECKmlm9m_vg",
                refreshToken:
                  "eyJhbGcidfgOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQdfgiOjE3NDEzMzA5NDEsImV4cCI6MTc0MdfgTkzNTc0MX0.7yP6lwA1GdfgkhCivg_DPLj4dfgdgfKQBQDUbNdfgKemUadfgd6oeeFmcO8",
              },
            },
          },
        },
        [BAD_REQUEST]: badRequest,
        [NOT_FOUND]: notFound,
        [INTERNAL_ERROR]: internalError,
      },
    },
  },
  "/refresh": {
    put: {
      summary: "Update tokens!",
      description: "Update tokens by refreshtoken!",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  example:
                    "eyJhbGcidfgOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQdfgiOjE3NDEzMzA5NDEsImV4cCI6MTc0MdfgTkzNTc0MX0.7yP6lwA1GdfgkhCivg_DPLj4df",
                },
              },
            },
          },
        },
      },
      responses: {
        [CREATED]: {
          description: "Displayed if successfully token refreshed!",
          content: {
            "application/json": {
              example: {
                accessToken:
                  "eyJhbGcidfgOiJIUdfgzI1NiIsInRgdfg5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJdfgpYXQiOjE3NDdsfgdfEzMzA5NdfgDEsImV4cCI6MTc0MTMzMzY0MX0.ZdY2Nt5_yi0dFKjeLXcb8Nk9dfg09SAR-Z2ECKmlm9m_vg",
                refreshToken:
                  "eyJhbGcidfgOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQdfgiOjE3NDEzMzA5NDEsImV4cCI6MTc0MdfgTkzNTc0MX0.7yP6lwA1GdfgkhCivg_DPLj4dfgdgfKQBQDUbNdfgKemUadfgd6oeeFmcO8",
              },
            },
          },
        },
        [BAD_REQUEST]: badRequest,
        [NOT_FOUND]: notFound,
        [INTERNAL_ERROR]: internalError,
      },
    },
  },
};
