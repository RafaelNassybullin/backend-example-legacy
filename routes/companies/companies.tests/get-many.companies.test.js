/* eslint-disable security/detect-non-literal-fs-filename */
const request = require("supertest");
const { app } = require("../../../app");
const v = require("../../../config").prefix;
const companyMethods = require("../../../DB/psql-db/methods/company");
const database = require("../../../DB/psql-db/methods/model");
const {
  OK,
  INTERNAL_ERROR,
  UNAUTHORIZED,
} = require("../../../constants/http-codes");
const requestAuth = require("../../../middleware/request-auth.middleware");
const { Unauthorized } = require("../../../constants/errors");

jest.mock("../../../middleware/request-auth.middleware");

describe("GET MANY COMPANY /company", () => {
  beforeAll(async () => {
    //ping dataDase
    const responce = await database.pingDatabase();
    if (responce !== "pong") {
      throw new Error("database error");
    }
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe("With Authorization", () => {
    beforeAll(async () => {
      requestAuth.isAuthorized.mockImplementation((req, res, next) => next());
    });

    afterAll(async () => {
      jest.resetAllMocks();
    });

    test("error: 500 internal server error", async () => {
      jest.spyOn(companyMethods, "getMany").mockImplementationOnce(() => {
        throw new Error();
      });
      const { status, body } = await request(app)
        .get(`/${v}/companies`)
        .query({ page: 2 });

      expect(status).toEqual(INTERNAL_ERROR);
      expect(body).toEqual({
        code: "INTERNAL_ERROR",
        message: "Internal unexpected server error",
      });
    });

    test("success", async () => {
      const { status, body } = await request(app)
        .get(`/${v}/companies`)
        .query({ page: 2 });
      expect(body.data).toBeDefined();
      expect(body.meta).toBeDefined();
      expect(body.links).toBeDefined();
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
      const { status, body } = await request(app).get(`/${v}/companies`);
      expect(status).toBe(UNAUTHORIZED);
      expect(body).toEqual({
        code: "UNAUTHORIZED",
        message: "Unauthorized request",
      });
    });
  });
});
