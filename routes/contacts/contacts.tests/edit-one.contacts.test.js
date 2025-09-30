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
  BAD_REQUEST,
} = require("../../../constants/http-codes");
const requestAuth = require("../../../middleware/request-auth.middleware");
const { Unauthorized } = require("../../../constants/errors");
const {
  getRandomNumber,
  formatDates,
  patchTool,
  generateRandomEmail,
} = require("../../../helpers/test.helper");

jest.mock("../../../middleware/request-auth.middleware");

describe("PATCH CONTACT /contacts/:id", () => {
  let contactId = "";
  let expected = {};
  let existPhoneId = "";
  let existEmailId = "";
  let existPhoneValue = "";
  let existEmailValue = "";

  const updated = {
    lastname: "Browney",
    firstname: "Bredley",
  };

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
    expected = formatDates(patchTool(result[0], updated));

    const { rows: existPhone } = await pool.query(
      "INSERT INTO contacts (lastname, firstname, patronymic, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING phone, id",
      [
        "Test",
        "Test",
        "Test",
        getRandomNumber(9999999999, 99999999999),
        generateRandomEmail(),
      ]
    );

    existPhoneId = existPhone[0].id;
    existPhoneValue = existPhone[0].phone;

    const { rows: existEmail } = await pool.query(
      "INSERT INTO contacts (lastname, firstname, patronymic, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING email, id",
      [
        "Test",
        "Test",
        "Test",
        getRandomNumber(9999999999, 99999999999),
        generateRandomEmail(),
      ]
    );

    existEmailId = existEmail[0].id;
    existEmailValue = existEmail[0].email;
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    // clear test data and variable
    await pool.query("DELETE FROM contacts WHERE id = $1", [contactId]);
    contactId = "";
    expected = {};
    await pool.query("DELETE FROM contacts WHERE id = $1", [existPhoneId]);
    await pool.query("DELETE FROM contacts WHERE id = $1", [existEmailId]);
    existPhoneId = "";
    existEmailId = "";
    existPhoneValue = "";
    existEmailValue = "";
  });

  describe("With Authorization", () => {
    beforeAll(async () => {
      requestAuth.isAuthorized.mockImplementation((req, res, next) => next());
    });

    afterAll(async () => {
      jest.resetAllMocks();
    });

    test("required at least one value", async () => {
      const { status, body } = await request(app)
        .patch(`/${v}/contacts/${contactId}`)
        .send({});
      expect(status).toBe(UNPROCESSABLE_ENTITY);
      expect(body).toEqual({
        code: "UNPROCESSABLE_ENTITY",
        message: "At least one field must be provided",
      });
    });

    test("exists phone", async () => {
      const { status, body } = await request(app)
        .patch(`/${v}/contacts/${contactId}`)
        .send({
          phone: existPhoneValue,
        });
      expect(status).toEqual(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Phone already exist",
      });
    });

    test("exists email", async () => {
      const { status, body } = await request(app)
        .patch(`/${v}/contacts/${contactId}`)
        .send({
          email: existEmailValue,
        });
      expect(status).toEqual(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Email already exist",
      });
    });

    test("invalid email", async () => {
      const { status, body } = await request(app)
        .patch(`/${v}/contacts/${contactId}`)
        .send({
          email: "abc",
        });
      expect(status).toBe(UNPROCESSABLE_ENTITY);
      expect(body).toEqual({
        code: "UNPROCESSABLE_ENTITY",
        message: "Email is not valid",
      });
    });

    test("numeric phone", async () => {
      const { status, body } = await request(app)
        .patch(`/${v}/contacts/${contactId}`)
        .send({
          phone: "abc",
        });
      expect(status).toBe(UNPROCESSABLE_ENTITY);
      expect(body).toEqual({
        code: "UNPROCESSABLE_ENTITY",
        message: "Phone is numeric",
      });
    });

    test("error: 404 contact not found", async () => {
      const { status, body } = await request(app)
        .patch(`/${v}/contacts/99999999`)
        .send({
          lastname: "Browney",
        });
      expect(status).toBe(NOT_FOUND);
      expect(body).toEqual({
        code: "NOT_FOUND",
        message: "Contact not found",
      });
    });

    test("error: 422 id parameter has incorrect format", async () => {
      const { status, body } = await request(app)
        .patch(`/${v}/contacts/abc`)
        .send({
          lastname: "Browney",
        });

      expect(status).toBe(UNPROCESSABLE_ENTITY);
      expect(body).toEqual({
        code: "UNPROCESSABLE_ENTITY",
        message: "id: parameter has incorrect format",
      });
    });

    test("error: 500 internal server error", async () => {
      jest.spyOn(contactMethods, "editOne").mockImplementationOnce(() => {
        throw new Error();
      });
      const { status, body } = await request(app)
        .patch(`/${v}/contacts/${contactId}`)
        .send({
          lastname: "Browney",
        });
      expect(status).toBe(INTERNAL_ERROR);
      expect(body).toEqual({
        code: "INTERNAL_ERROR",
        message: "Internal unexpected server error",
      });
    });

    test("success", async () => {
      const { status, body } = await request(app)
        .patch(`/${v}/contacts/${contactId}`)
        .send({
          lastname: "Browney",
          firstname: "Bredley",
        });

      expect(body).toEqual(expected);
      expect(status).toEqual(OK);
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
        const { status, body } = await request(app)
          .patch(`/${v}/contacts/${contactId}`)
          .send({
            lastname: "Browney",
            firstname: "Bredley",
          });

        expect(status).toBe(UNAUTHORIZED);
        expect(body).toEqual({
          code: "UNAUTHORIZED",
          message: "Unauthorized request",
        });
      });
    });
  });
});
