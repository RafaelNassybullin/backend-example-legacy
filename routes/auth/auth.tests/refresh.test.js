/* eslint-disable security/detect-non-literal-fs-filename */
const request = require("supertest");
const { app } = require("../../../app");
const v = require("../../../config").prefix;
const { BAD_REQUEST } = require("../../../constants/http-codes");

jest.mock("../../../middleware/request-auth.middleware");

describe("REFRESH /refresh", () => {
  afterAll(async () => {
    jest.resetAllMocks();
  });

  test("error: 400 token is not valid!", async () => {
    const { status, body } = await request(app).put(`/${v}/refresh`).send({
      refreshToken: "lskdmflksdm",
    });
    expect(status).toBe(BAD_REQUEST);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "Jwt malformed",
    });
  });

  test("error: 400 refreshToken is required!", async () => {
    const { status, body } = await request(app).put(`/${v}/refresh`).send({});
    expect(status).toBe(BAD_REQUEST);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "RefreshToken is required!",
    });
  });
});
