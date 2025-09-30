/* eslint-disable security/detect-non-literal-fs-filename */
const request = require("supertest");
const { app } = require("../../../app");
const v = require("../../../config").prefix;
const contactMethods = require("../../../DB/psql-db/methods/contact");
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
  formatDates,
  generateRandomEmail,
} = require("../../../helpers/test.helper");

jest.mock("../../../middleware/request-auth.middleware");

describe("GET ONE CONTACT /contacts/:id", () => {
  let contactId = "";
  let expected = {};

  beforeAll(async () => {
    //ping dataDase
    const responce = await database.pingDatabase();
    if (responce !== "pong") {
      throw new Error("database error");
    }
    // create test contact in dataBase
    const { rows: result } = await pool.query(
      "INSERT INTO contacts (lastname, firstname, patronymic, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        "Test",
        "Test",
        "Test",
        getRandomNumber(9999999999, 99999999999),
        generateRandomEmail(),
      ]
    );
    contactId = result[0].id;
    expected = formatDates(result[0]);
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    // clear test data and variable
    await pool.query("DELETE FROM contacts WHERE id = $1", [contactId]);
    contactId = "";
    expected = {};
  });

  describe("With Authorization", () => {
    beforeAll(async () => {
      requestAuth.isAuthorized.mockImplementation((req, res, next) => next());
    });

    afterAll(async () => {
      jest.resetAllMocks();
    });

    test("error: 404 contact not found", async () => {
      const { status, body } = await request(app).get(
        `/${v}/contacts/99999999`
      );
      expect(status).toBe(NOT_FOUND);
      expect(body).toEqual({
        code: "NOT_FOUND",
        message: "Contact not found",
      });
    });

    test("error: 422 id parameter has incorrect format", async () => {
      const { status, body } = await request(app).get(`/${v}/contacts/abc`);

      expect(status).toBe(UNPROCESSABLE_ENTITY);
      expect(body).toEqual({
        code: "UNPROCESSABLE_ENTITY",
        message: "id: parameter has incorrect format",
      });
    });

    test("error: 500 internal server error", async () => {
      jest.spyOn(contactMethods, "getOne").mockImplementationOnce(() => {
        throw new Error();
      });
      const { status, body } = await request(app).get(
        `/${v}/contacts/${contactId}`
      );
      expect(status).toBe(INTERNAL_ERROR);
      expect(body).toEqual({
        code: "INTERNAL_ERROR",
        message: "Internal unexpected server error",
      });
    });

    test("success", async () => {
      const { status, body } = await request(app).get(
        `/${v}/contacts/${contactId}`
      );
      expect(body).toEqual(expected);
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
        `/${v}/contacts/${contactId}`
      );
      expect(status).toBe(UNAUTHORIZED);
      expect(body).toEqual({
        code: "UNAUTHORIZED",
        message: "Unauthorized request",
      });
    });
  });
});
