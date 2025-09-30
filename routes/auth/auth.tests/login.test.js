/* eslint-disable security/detect-non-literal-fs-filename */
const request = require("supertest");
const { app } = require("../../../app");
const v = require("../../../config").prefix;
const authMethods = require("../../../DB/psql-db/methods/auth");
const {
  NOT_FOUND,
  INTERNAL_ERROR,
  CREATED,
} = require("../../../constants/http-codes");

jest.mock("../../../middleware/request-auth.middleware");

describe("LOGIN /login", () => {
  afterAll(async () => {
    jest.resetAllMocks();
  });

  test("error: 400 username is required!", async () => {
    const { status, body } = await request(app).post(`/${v}/login`).send({
      password: "lskdmflksdm",
    });
    expect(status).toBe(400);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "Username is required!",
    });
  });
  test("error: 400 password is required!", async () => {
    const { status, body } = await request(app).post(`/${v}/login`).send({
      username: "test",
    });
    expect(status).toBe(400);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "Password is required!",
    });
  });

  test("error: 400 password is not valid!", async () => {
    const { status, body } = await request(app).post(`/${v}/login`).send({
      username: "test",
      password: "sdkjfn3pru30",
    });
    expect(status).toBe(400);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "Password is not valid!",
    });
  });

  test("error: 500 internal server error", async () => {
    jest.spyOn(authMethods, "login").mockImplementationOnce(() => {
      throw new Error();
    });
    const { status, body } = await request(app).post(`/${v}/login`).send({
      username: "username123",
      password: "password123",
    });

    expect(status).toBe(INTERNAL_ERROR);
    expect(body).toEqual({
      code: "INTERNAL_ERROR",
      message: "Internal unexpected server error",
    });
  });

  test("error: 400 user does not exist!", async () => {
    const { status, body } = await request(app).post(`/${v}/login`).send({
      username: "sdjf3424sdfsd2343",
      password: "password123",
    });

    expect(status).toBe(NOT_FOUND);
    expect(body).toEqual({
      code: "NOT_FOUND",
      message: "Username does not exist!",
    });
  });

  test("success", async () => {
    const { status, body } = await request(app).post(`/${v}/login`).send({
      username: "test",
      password: "jshdbhjbslU&6g#$55uvjhkblkjnLK",
    });

    expect(status).toEqual(CREATED);
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });
});
