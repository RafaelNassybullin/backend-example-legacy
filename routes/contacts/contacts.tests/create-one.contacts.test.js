/* eslint-disable security/detect-non-literal-fs-filename */
const request = require("supertest");
const { app } = require("../../../app");
const v = require("../../../config").prefix;
const database = require("../../../DB/psql-db/methods/model");
const pool = require("../../../services/database.service");
const contactMethods = require("../../../DB/psql-db/methods/contact");
const {
  INTERNAL_ERROR,
  UNAUTHORIZED,
  BAD_REQUEST,
  CREATED,
} = require("../../../constants/http-codes");
const requestAuth = require("../../../middleware/request-auth.middleware");
const { Unauthorized } = require("../../../constants/errors");
const {
  getRandomNumber,
  generateRandomEmail,
} = require("../../../helpers/test.helper");

jest.mock("../../../middleware/request-auth.middleware");

describe("CREATE CONTACT /contacts", () => {
  let successId = "";
  let existPhoneId = "";
  let existEmailId = "";
  let existPhoneValue = "";
  let existEmailValue = "";

  beforeAll(async () => {
    //ping dataDase
    const responce = await database.pingDatabase();
    if (responce !== "pong") {
      throw new Error("database error");
    }

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
    await pool.query("DELETE FROM contacts WHERE id = $1", [successId]);
    await pool.query("DELETE FROM contacts WHERE id = $1", [existPhoneId]);
    await pool.query("DELETE FROM contacts WHERE id = $1", [existEmailId]);
    successId = "";
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
    test("required lastname", async () => {
      const { status, body } = await request(app).post(`/${v}/contacts`).send({
        firstname: "Robert",
        patronymic: "Jr",
        phone: "1234567891011",
        email: "exidst@mail.com",
      });

      expect(status).toBe(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Lastname is required",
      });
    });
    test("required firstname", async () => {
      const { status, body } = await request(app).post(`/${v}/contacts`).send({
        lastname: "Downey",
        patronymic: "Jr",
        phone: "1234567891011",
        email: "exidst@mail.com",
      });

      expect(status).toBe(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Firstname is required",
      });
    });
    test("required patronymic", async () => {
      const { status, body } = await request(app).post(`/${v}/contacts`).send({
        lastname: "Downey",
        firstname: "Robert",
        phone: "1234567891011",
        email: "exidst@mail.com",
      });

      expect(status).toBe(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Patronymic is required",
      });
    });
    test("required phone", async () => {
      const { status, body } = await request(app).post(`/${v}/contacts`).send({
        lastname: "Downey",
        firstname: "Robert",
        patronymic: "Jr",
        email: "exidst@mail.com",
      });

      expect(status).toBe(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Phone is required",
      });
    });
    test("required email", async () => {
      const { status, body } = await request(app).post(`/${v}/contacts`).send({
        lastname: "Downey",
        firstname: "Robert",
        patronymic: "Jr",
        phone: "1234567891011",
      });

      expect(status).toBe(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Email is required",
      });
    });

    test("error: 500 internal server error", async () => {
      jest.spyOn(contactMethods, "createOne").mockImplementationOnce(() => {
        throw new Error();
      });
      const { status, body } = await request(app)
        .post(`/${v}/contacts`)
        .send({
          lastname: "Downey",
          firstname: "Robert",
          patronymic: "Jr",
          phone: getRandomNumber(9999999999, 99999999999),
          email: generateRandomEmail(),
        });
      expect(status).toBe(INTERNAL_ERROR);
      expect(body).toEqual({
        code: "INTERNAL_ERROR",
        message: "Internal unexpected server error",
      });
    });

    test("exists phone", async () => {
      const { status, body } = await request(app).post(`/${v}/contacts`).send({
        lastname: "Downey",
        firstname: "Robert",
        patronymic: "Jr",
        phone: existPhoneValue,
        email: generateRandomEmail(),
      });
      expect(status).toEqual(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Phone already exist",
      });
    });

    test("exists email", async () => {
      const { status, body } = await request(app)
        .post(`/${v}/contacts`)
        .send({
          lastname: "Downey",
          firstname: "Robert",
          patronymic: "Jr",
          phone: getRandomNumber(9999999999, 99999999999),
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
        .post(`/${v}/contacts`)
        .send({
          lastname: "Downey",
          firstname: "Robert",
          patronymic: "Jr",
          phone: getRandomNumber(9999999999, 99999999999),
          email: "abc",
        });
      expect(status).toEqual(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Email is not valid",
      });
    });
    test("numeric phone", async () => {
      const { status, body } = await request(app).post(`/${v}/contacts`).send({
        lastname: "Downey",
        firstname: "Robert",
        patronymic: "Jr",
        phone: "abc",
        email: generateRandomEmail(),
      });
      expect(status).toEqual(BAD_REQUEST);
      expect(body).toEqual({
        code: "BAD_REQUEST",
        message: "Phone is numeric",
      });
    });

    test("success", async () => {
      const { status, body } = await request(app)
        .post(`/${v}/contacts`)
        .send({
          lastname: "Downey",
          firstname: "Robert",
          patronymic: "Jr",
          phone: getRandomNumber(9999999999, 99999999999),
          email: generateRandomEmail(),
        });
      successId = body.id;

      expect(body.id).toBeDefined();
      expect(body.lastname).toBeDefined();
      expect(body.firstname).toBeDefined();
      expect(body.patronymic).toBeDefined();
      expect(body.phone).toBeDefined();
      expect(body.email).toBeDefined();
      expect(body.created_at).toBeDefined();
      expect(body.updated_at).toBeDefined();
      expect(status).toEqual(CREATED);
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
          .post(`/${v}/contacts`)
          .send({
            lastname: "Downey",
            firstname: "Robert",
            patronymic: "Jr",
            phone: getRandomNumber(9999999999, 99999999999),
            email: generateRandomEmail(),
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
