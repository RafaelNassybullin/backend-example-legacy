/* eslint-disable security/detect-non-literal-fs-filename */
const request = require("supertest");
const { app } = require("../../../app");
const v = require("../../../config").prefix;
const database = require("../../../DB/psql-db/methods/model");
const pool = require("../../../services/database.service");
const contactMethods = require("../../../DB/psql-db/methods/contact");
const {
  OK,
  NOT_FOUND,
  INTERNAL_ERROR,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
} = require("../../../constants/http-codes");
const requestAuth = require("../../../middleware/request-auth.middleware");
const { Unauthorized } = require("../../../constants/errors");
const {
  getRandomNumber,
  generateRandomEmail,
} = require("../../../helpers/test.helper");

jest.mock("../../../middleware/request-auth.middleware");

describe("DELETE CONTACT /contacts/:id", () => {
  let contactId = "";

  beforeAll(async () => {
    //ping dataDase
    const responce = await database.pingDatabase();
    if (responce !== "pong") {
      throw new Error("database error");
    }

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
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    contactId = "";
  });

  describe("With Authorization", () => {
    beforeAll(async () => {
      requestAuth.isAuthorized.mockImplementation((req, res, next) => next());
    });

    afterAll(async () => {
      jest.resetAllMocks();
    });

    test("error: 404 contact not found", async () => {
      const { status, body } = await request(app).delete(
        `/${v}/contacts/99999999`
      );

      expect(status).toBe(NOT_FOUND);
      expect(body).toEqual({
        code: "NOT_FOUND",
        message: "Contact is not found",
      });
    });

    test("error: 422 id parameter has incorrect format", async () => {
      const { status, body } = await request(app).delete(`/${v}/contacts/abc`);

      expect(status).toBe(UNPROCESSABLE_ENTITY);
      expect(body).toEqual({
        code: "UNPROCESSABLE_ENTITY",
        message: "id: parameter has incorrect format",
      });
    });

    test("error: 500 internal server error", async () => {
      jest.spyOn(contactMethods, "deleteOne").mockImplementationOnce(() => {
        throw new Error();
      });
      const { status, body } = await request(app).delete(
        `/${v}/contacts/${contactId}`
      );

      expect(status).toBe(INTERNAL_ERROR);
      expect(body).toEqual({
        code: "INTERNAL_ERROR",
        message: "Internal unexpected server error",
      });
    });

    test("success", async () => {
      const { status, body } = await request(app).delete(
        `/${v}/contacts/${contactId}`
      );

      expect(status).toEqual(OK);
      expect(body).toEqual({
        success: true,
        message: "Contact deleted successfully",
        deletedId: contactId,
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
        const { status, body } = await request(app).delete(
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
});
