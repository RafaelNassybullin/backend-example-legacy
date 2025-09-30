const {
  OK,
  INTERNAL_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  UNAUTHORIZED,
} = require("../../../constants/http-codes");
const {
  internalError,
  notFound,
  badRequest,
  unauthorized,
} = require("../../../config/swagger/common-errors");

module.exports = {
  "/companies": {
    get: {
      summary: "Getting a list companies!",
      security: [{ bearerAuth: [] }],
      description:
        "Getting a list of companies, with pagination, sorting and filtering!",
      tags: ["Companies"],
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", example: 1 },
          description: "Pagination page",
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", example: 10 },
          description: "Limit for items in page",
        },
        {
          name: "sortBy",
          in: "query",
          required: false,
          schema: { type: "string", example: "created-desc" },
          description:
            "name-desc | name-asc | created-desc | created-asc | name-desc_created-desc | name-asc_created-desc | name-desc_created-asc | name-asc_created-asc | created-desc_name-desc | created-asc_name-desc | created-desc_name-asc | created-asc_name-asc",
        },
        {
          name: "types",
          in: "query",
          required: false,
          schema: {
            type: "string",
            example: "importer,consultant,distributor",
          },
          description:
            "manufacturer, wholesaler, distributor, retailer, subcontractor, vendor, consultant, service provider, broker, reseller, franchisee, integrator, agent, exporter, importer",
        },
        {
          name: "status",
          in: "query",
          required: false,
          schema: { type: "string", example: "active" },
          description: "active | inactive",
        },
      ],
      responses: {
        [OK]: {
          description: "If the list of companies was received successfully!",
          content: {
            "application/json": {
              example: {
                data: [
                  {
                    id: "1",
                    contact_id: "1",
                    name: "LLP «BlueSky Innovation»",
                    short_name: "BlueSky Innovations",
                    business_entity: "LLP",
                    status: "active",
                    created_at: "2025-01-07T02:11:34.657Z",
                    updated_at: "2024-11-30T09:09:28.557Z",
                    contract: {
                      no: "242342",
                      issue_date: "2021-10-10T06:47:22.875+05:00",
                    },
                    type: ["broker", "franchisee", "retailer"],
                    photos: [
                      {
                        name: "http://domain.com/static/images/0b8fc462dcabf7610a91.png",
                        filepath: "0b8fc462dcabf7610a91.png",
                        thumbpath:
                          "http://domain.com/static/images/0b8fc462dcabf7610a91_160x160.png",
                      },
                    ],
                    address: {
                      city: "Atlantic",
                      street: "Brodway",
                      country: "USA",
                      postal_code: "YT5 HJ9",
                    },
                  },
                ],
                meta: {
                  totalItems: 133,
                  totalPages: 14,
                  currentPage: 1,
                  limit: 10,
                },
                links: {
                  first:
                    "http://domain.com/v1/companies?page=1&limit=10&sortBy=created-desc&types=importer%2Cconsultant%2Cdistributor&status=inactive",
                  last: "http://domain.com/v1/companies?page=14&limit=10&sortBy=created-desc&types=importer%2Cconsultant%2Cdistributor&status=inactive",
                  prev: "http://domain.com/v1/companies?page=1&limit=10&sortBy=created-desc&types=importer%2Cconsultant%2Cdistributor&status=inactive",
                  next: "http://domain.com/v1/companies?page=2&limit=10&sortBy=created-desc&types=importer%2Cconsultant%2Cdistributor&status=inactive",
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
  "/companies/{id}": {
    get: {
      summary: "Getting one company!",
      security: [{ bearerAuth: [] }],
      description: "Getting one company by ID!",
      tags: ["Companies"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Company ID",
        },
      ],
      responses: {
        [OK]: {
          description: "If one company was received successfully!",
          content: {
            "application/json": {
              example: {
                id: "1",
                contact_id: "1",
                name: "LLP «BlueSky Innovation»",
                short_name: "BlueSky Innovations",
                business_entity: "LLP",
                status: "active",
                created_at: "2025-01-07T02:11:34.657Z",
                updated_at: "2024-11-30T09:09:28.557Z",
                contract: {
                  no: "242342",
                  issue_date: "2021-10-10T06:47:22.875+05:00",
                },
                type: ["broker", "franchisee", "retailer"],
                photos: [
                  {
                    name: "http://domain.com/static/images/0b8fc462dcabf7610a91.png",
                    filepath: "0b8fc462dcabf7610a91.png",
                    thumbpath:
                      "http://domain.com/static/images/0b8fc462dcabf7610a91_160x160.png",
                  },
                ],
                address: {
                  city: "Atlantic",
                  street: "Brodway",
                  country: "USA",
                  postal_code: "YT5 HJ9",
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
    post: {
      summary: "Saving a company!",
      security: [{ bearerAuth: [] }],
      description: "Saving a company record using an existing contact_id!",
      tags: ["Companies"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Contact id",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "name",
                "shortName",
                "businessEntity",
                "status",
                "companyTypes",
                "contract",
                "street",
                "city",
                "postalCode",
                "country",
              ],
              properties: {
                name: { type: "string", example: "LLP «BlueSky Innovations»" },
                shortName: { type: "string", example: "BlueSky Innovations" },
                businessEntity: { type: "string", example: "LLP" },
                status: { type: "string", example: "active" },
                companyTypes: {
                  type: "string",
                  example: "broker,franchisee,retailer",
                },
                contract: { type: "string", example: "24829" },
                street: { type: "string", example: "street" },
                city: { type: "string", example: "city" },
                postalCode: { type: "string", example: "postalCode" },
                country: { type: "string", example: "country" },
              },
            },
          },
        },
      },
      responses: {
        [CREATED]: {
          description: "If company was created successfully!",
          content: {
            "application/json": {
              example: {
                id: "1",
                contact_id: "1",
                name: "LLP «BlueSky Innovation»",
                short_name: "BlueSky Innovations",
                business_entity: "LLP",
                status: "active",
                created_at: "2025-01-07T02:11:34.657Z",
                updated_at: "2024-11-30T09:09:28.557Z",
                contract: {
                  no: "242342",
                  issue_date: "2021-10-10T06:47:22.875+05:00",
                },
                type: ["broker", "franchisee", "retailer"],
                photos: [],
                address: {
                  city: "Atlantic",
                  street: "Brodway",
                  country: "USA",
                  postal_code: "YT5 HJ9",
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
    patch: {
      summary: "Update company details!",
      security: [{ bearerAuth: [] }],
      description:
        "Partially update company details. At least one field must be provided!",
      tags: ["Companies"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Company ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "LLP «BlueSky Innovations»" },
                shortName: { type: "string", example: "BlueSky Innovations" },
                businessEntity: { type: "string", example: "LLP" },
                status: { type: "string", example: "active" },
                companyTypes: {
                  type: "string",
                  example: "broker,franchisee,retailer",
                },
                contract: { type: "string", example: "24829" },
                street: { type: "string", example: "Brodway" },
                city: { type: "string", example: "Atlantic" },
                postalCode: { type: "string", example: "YT5 HJ9" },
                country: { type: "string", example: "USA" },
              },
              anyOf: [
                { required: ["name"] },
                { required: ["shortName"] },
                { required: ["businessEntity"] },
                { required: ["status"] },
                { required: ["companyTypes"] },
                { required: ["contract"] },
                { required: ["street"] },
                { required: ["city"] },
                { required: ["postalCode"] },
                { required: ["country"] },
              ],
            },
          },
        },
      },
      responses: {
        [OK]: {
          description: "If the company is updated successfully!",
          content: {
            "application/json": {
              example: {
                id: "1",
                contact_id: "1",
                name: "LLP «BlueSky Innovation»",
                short_name: "BlueSky Innovations",
                business_entity: "LLP",
                status: "active",
                created_at: "2025-01-07T02:11:34.657Z",
                updated_at: "2024-11-30T09:09:28.557Z",
                contract: {
                  no: "242342",
                  issue_date: "2021-10-10T06:47:22.875+05:00",
                },
                type: ["broker", "franchisee", "retailer"],
                photos: [
                  {
                    name: "http://domain.com/static/images/0b8fc462dcabf7610a91.png",
                    filepath: "0b8fc462dcabf7610a91.png",
                    thumbpath:
                      "http://domain.com/static/images/0b8fc462dcabf7610a91_160x160.png",
                  },
                ],
                address: {
                  city: "Atlantic",
                  street: "Brodway",
                  country: "USA",
                  postal_code: "YT5 HJ9",
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
  "/companies/{id}/image": {
    post: {
      summary: "Uploading an image by ID!",
      security: [{ bearerAuth: [] }],
      description:
        "Uploading an image for a company and creating a photo field!",
      tags: ["Companies"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Company ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary",
                  description: "Image file to upload",
                },
              },
            },
          },
        },
      },
      responses: {
        [CREATED]: {
          description: "If the image is successfully loaded!",
          content: {
            "application/json": {
              example: {
                name: "499d9366f906d63ebc84.jpeg",
                filepath: "499d9366f906d63ebc84.jpeg",
                thumbpath: "499d9366f906d63ebc84_160x160.jpeg",
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
      summary: "Removing image by ID!",
      security: [{ bearerAuth: [] }],
      description: "Removing a company image by ID!",
      tags: ["Companies"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Company ID",
        },
      ],
      responses: {
        [OK]: {
          description: "If the image is successfully deleted!",
          content: {
            "application/json": {
              example: {
                message: "Image with company_id: 1 successfully deleted",
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
