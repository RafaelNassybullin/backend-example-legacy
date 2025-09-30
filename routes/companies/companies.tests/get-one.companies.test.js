/* eslint-disable security/detect-non-literal-fs-filename */
const request = require("supertest");
const { app } = require("../../../app");
const v = require("../../../config").prefix;
const companyMethods = require("../../../DB/psql-db/methods/company");
const database = require("../../../DB/psql-db/methods/model");
const {
  OK,
  NOT_FOUND,
  INTERNAL_ERROR,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
} = require("../../../constants/http-codes");
const requestAuth = require("../../../middleware/request-auth.middleware");
const { Unauthorized } = require("../../../constants/errors");
const pool = require("../../../services/database.service");
const {
  getRandomNumber,
  transformData,
  generateRandomEmail,
} = require("../../../helpers/test.helper");

jest.mock("../../../middleware/request-auth.middleware");

describe("GET ONE COMPANY /company/:id", () => {
  let companyId = "";
  let expectedCompany = {};

  beforeAll(async () => {
    //ping dataDase
    const client = await pool.connect();

    try {
      const responce = await database.pingDatabase();
      if (responce !== "pong") {
        throw new Error("database error");
      }

      const { rows: contacts } = await client.query(
        "INSERT INTO contacts (lastname, firstname, patronymic, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [
          "Test",
          "Test",
          "Test",
          getRandomNumber(9999999999, 99999999999),
          generateRandomEmail(),
        ]
      );

      const { rows: company } = await client.query(
        `INSERT INTO companies (contact_id, name, short_name, business_entity, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [contacts[0].id, `LLP «Test Company»`, "Test Company", "LLP", "active"]
      );

      const { rows: address } = await client.query(
        `INSERT INTO address (company_id, street, city, postal_code, country) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [company[0].id, `Boley Ben St`, "Arkham", "HY6 8JY", "Teststan"]
      );

      const { rows: contracts } = await client.query(
        `INSERT INTO contracts (company_id, contract_no) VALUES ($1, $2) RETURNING *`,
        [company[0].id, `${getRandomNumber(99999, 999999)}`]
      );

      const { rows: types } = await client.query(
        `INSERT INTO company_types (company_id, type) VALUES ($1, $2) RETURNING *`,
        [company[0].id, "broker"]
      );

      const data = transformData(
        company[0],
        address[0],
        contracts[0],
        types[0],
        { photo: [] }
      );

      companyId = data.id;
      expectedCompany = data;
    } catch (e) {
      throw new Error(e);
    } finally {
      client.release();
    }
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    // clear test data and variable
    await pool.query("DELETE FROM contacts WHERE id = $1", [
      expectedCompany.contact_id,
    ]);
    companyId = "";
    expectedCompany = {};
  });

  describe("With Authorization", () => {
    beforeAll(async () => {
      requestAuth.isAuthorized.mockImplementation((req, res, next) => next());
    });

    afterAll(async () => {
      jest.resetAllMocks();
    });

    test("error: 404 company not found", async () => {
      const { status, body } = await request(app).get(
        `/${v}/companies/99999999`
      );
      expect(status).toBe(NOT_FOUND);
      expect(body).toEqual({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    });

    test("error: 422 id parameter has incorrect format", async () => {
      const { status, body } = await request(app).get(`/${v}/companies/abc`);
      expect(status).toBe(UNPROCESSABLE_ENTITY);
      expect(body).toEqual({
        code: "UNPROCESSABLE_ENTITY",
        message: "id: parameter has incorrect format",
      });
    });

    test("error: 500 internal server error", async () => {
      jest.spyOn(companyMethods, "getOne").mockImplementationOnce(() => {
        throw new Error();
      });
      const { status, body } = await request(app).get(
        `/${v}/companies/${companyId}`
      );
      expect(status).toBe(INTERNAL_ERROR);
      expect(body).toEqual({
        code: "INTERNAL_ERROR",
        message: "Internal unexpected server error",
      });
    });

    test("success", async () => {
      const { status, body } = await request(app).get(
        `/${v}/companies/${companyId}`
      );
      expect(body.id).toEqual(expectedCompany.id);
      expect(body.contract.no).toEqual(expectedCompany.contract.no);
      expect(body.address).toEqual(expectedCompany.address);
      expect(status).toEqual(OK);
    });
  });

  describe("Without Authorization", () => {
    beforeAll(() => {
      requestAuth.isAuthorized.mockImplementation((req, res, next) =>
        next(new Unauthorized())
      );
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    test("error: 401 unauthorized", async () => {
      const { status, body } = await request(app).get(
        `/${v}/companies/${companyId}`
      );
      expect(status).toBe(UNAUTHORIZED);
      expect(body).toEqual({
        code: "UNAUTHORIZED",
        message: "Unauthorized request",
      });
    });
  });
});
