const request = require("supertest");
const { app } = require("../../../../app");
const { prefix } = require("../../../../config");
const readmeService = require("../../readme.service");
const { OK, INTERNAL_ERROR } = require("../../../../constants/http-codes");

describe(`GET README /v1`, () => {
  test("error: 500 internal server error", async () => {
    jest.spyOn(readmeService, "renderPage").mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await request(app).get(`/${prefix}`);
    const { status, body } = response;

    expect(status).toBe(INTERNAL_ERROR);
    expect(body).toEqual({
      code: "INTERNAL_ERROR",
      message: "Internal unexpected server error",
    });
  });

  test("success: 200 ok", async () => {
    const response = await request(app).get(`/${prefix}`);
    const { status, text } = response;
    expect(status).toEqual(OK);
    expect(text).toMatch(/<html>.+/gi);
  });
});
