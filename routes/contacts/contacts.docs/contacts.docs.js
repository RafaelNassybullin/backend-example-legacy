const {
  OK,
  INTERNAL_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} = require("../../../constants/http-codes");
const {
  internalError,
  notFound,
  badRequest,
  unauthorized,
  unprocessableEntity,
} = require("../../../config/swagger/common-errors");

module.exports = {
  "/contacts": {
    post: {
      summary: "Creating a new contact!",
      security: [{ bearerAuth: [] }],
      description: `Creating a contact element by lastname, firstname, patronymic, phone and email fields
(phone and email) must be unique! All fields are required!`,
      tags: ["Contacts"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["lastname", "firstname", "phone", "email"],
              properties: {
                lastname: { type: "string", example: "Downey" },
                firstname: { type: "string", example: "Robert" },
                patronymic: { type: "string", example: "Jr" },
                phone: { type: "string", example: "12345678" },
                email: {
                  type: "string",
                  format: "email",
                  example: "email@mail.com",
                },
              },
            },
          },
        },
      },
      responses: {
        [CREATED]: {
          description: "Displayed if contact successfully created!",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string", example: "1" },
                  lastname: { type: "string", example: "Downey" },
                  firstname: { type: "string", example: "Robert" },
                  patronymic: { type: "string", example: "Jr" },
                  phone: { type: "string", example: "12345678" },
                  email: { type: "string", example: "email@mail.com" },
                  created_at: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-06T06:49:38.638Z",
                  },
                  updated_at: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-06T06:49:38.638Z",
                  },
                },
              },
            },
          },
        },
        [UNAUTHORIZED]: unauthorized,
        [BAD_REQUEST]: badRequest,
        [NOT_FOUND]: notFound,
        [INTERNAL_ERROR]: internalError,
      },
    },
  },
  "/contacts/{id}": {
    get: {
      summary: "Getting a contact by ID!",
      security: [{ bearerAuth: [] }],
      description:
        "Contact ID must be a number, and there must be a contact with that ID!",
      tags: ["Contacts"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
          description: "Enter contact ID here!",
        },
      ],
      responses: {
        [OK]: {
          description:
            "If a contact with such an ID exists, then we successfully receive the data!",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string", example: "1" },
                  lastname: { type: "string", example: "Downey" },
                  firstname: { type: "string", example: "Robert" },
                  patronymic: { type: "string", example: "Jr" },
                  phone: { type: "string", example: "12345678" },
                  email: { type: "string", example: "email@mail.com" },
                  created_at: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-06T06:49:38.638Z",
                  },
                  updated_at: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-06T06:49:38.638Z",
                  },
                },
              },
            },
          },
        },
        [UNAUTHORIZED]: unauthorized,
        [BAD_REQUEST]: badRequest,
        [UNPROCESSABLE_ENTITY]: unprocessableEntity,
        [NOT_FOUND]: notFound,
        [INTERNAL_ERROR]: internalError,
      },
    },
    patch: {
      summary: "Editing a contact by ID!",
      security: [{ bearerAuth: [] }],
      description:
        "Editing a contact by unique ID! Enter only the data you want to change!",
      tags: ["Contacts"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Unique ID for editing contact!",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                lastname: { type: "string", example: "Downey" },
                firstname: { type: "string", example: "Robert" },
                patronymic: { type: "string", example: "Jr" },
                phone: { type: "string", example: "12345678" },
                email: {
                  type: "string",
                  format: "email",
                  example: "email@mail.com",
                },
              },
              anyOf: [
                { required: ["lastname"] },
                { required: ["firstname"] },
                { required: ["patronymic"] },
                { required: ["phone"] },
                { required: ["email"] },
              ],
            },
          },
        },
      },
      responses: {
        [OK]: {
          description:
            "Will be displayed if the contact is edited successfully!",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string", example: "1" },
                  lastname: { type: "string", example: "Downey" },
                  firstname: { type: "string", example: "Robert" },
                  patronymic: { type: "string", example: "Jr" },
                  phone: { type: "string", example: "12345678" },
                  email: { type: "string", example: "email@mail.com" },
                  created_at: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-06T06:49:38.638Z",
                  },
                  updated_at: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-06T06:49:38.638Z",
                  },
                },
              },
            },
          },
        },
        [UNAUTHORIZED]: unauthorized,
        [BAD_REQUEST]: badRequest,
        [NOT_FOUND]: notFound,
        [INTERNAL_ERROR]: internalError,
      },
    },
    delete: {
      summary: "Deleting contact by ID!",
      security: [{ bearerAuth: [] }],
      description:
        "Deleting a contact by ID, when deleting a contact, the company is also deleted from the database via cascade and the image file if the company has one!",
      tags: ["Contacts"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Unique ID of the contact to be deleted!",
        },
      ],
      responses: {
        [OK]: {
          description:
            "Will be displayed if the contact is successfully deleted!",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Contact deleted successfully!",
                  },
                  deletedId: { type: "integer", example: 18 },
                },
              },
            },
          },
        },
        [UNAUTHORIZED]: unauthorized,
        [BAD_REQUEST]: badRequest,
        [NOT_FOUND]: notFound,
        [INTERNAL_ERROR]: internalError,
      },
    },
  },
};
