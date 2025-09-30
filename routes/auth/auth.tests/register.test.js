/* eslint-disable security/detect-non-literal-fs-filename */
const request = require("supertest");
const { app } = require("../../../app");
const v = require("../../../config").prefix;
const authMethods = require("../../../DB/psql-db/methods/auth");
const { CREATED, BAD_REQUEST } = require("../../../constants/http-codes");
const pool = require("../../../services/database.service");

jest.mock("../../../middleware/request-auth.middleware");

function generatePassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateLettersSet(length = 9) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

describe("REGISTER /register", () => {
  let idForDelete = "";
  afterAll(async () => {
    jest.resetAllMocks();
    await pool.query(`DELETE FROM users WHERE id = $1`, [idForDelete]);
    idForDelete = "";
  });

  test("error: 400 name is required!", async () => {
    const { status, body } = await request(app).post(`/${v}/register`).send({
      username: "namesfsd",
      password: "lskdmflksdm",
    });
    expect(status).toBe(BAD_REQUEST);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "Name is require!",
    });
  });

  test("error: 400 username is required!", async () => {
    const { status, body } = await request(app).post(`/${v}/register`).send({
      name: "name",
      password: "lskdmflksdm",
    });
    expect(status).toBe(400);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "Username is required!",
    });
  });

  test("error: 400 password is required!", async () => {
    const { status, body } = await request(app).post(`/${v}/register`).send({
      name: "name",
      username: "test",
    });
    expect(status).toBe(400);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "Password is required!",
    });
  });

  test("error: 400 use hard password!", async () => {
    const { status, body } = await request(app).post(`/${v}/register`).send({
      name: "name",
      username: "test",
      password: "1234",
    });
    expect(status).toBe(400);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "You should use a stronger password!",
    });
  });

  test("error: 500 internal server error", async () => {
    jest.spyOn(authMethods, "register").mockImplementationOnce(() => {
      throw new Error();
    });
    const { status, body } = await request(app).post(`/${v}/register`).send({
      name: "name",
      username: "username123",
      password: "passkjf8$%^JJ8798word123",
    });

    expect(status).toBe(500);
    expect(body).toEqual({
      code: "INTERNAL_ERROR",
      message: "Internal unexpected server error",
    });
  });

  test("error: 400 username is exist!", async () => {
    const { status, body } = await request(app).post(`/${v}/register`).send({
      name: "name",
      username: "testjsdfkbkj",
      password: "passkjf8$%^JJ8798word123",
    });

    expect(status).toBe(BAD_REQUEST);
    expect(body).toEqual({
      code: "BAD_REQUEST",
      message: "User with this username is already exist",
    });
  });

  test("success", async () => {
    const { status, body } = await request(app)
      .post(`/${v}/register`)
      .send({
        name: "name",
        username: "test" + generateLettersSet(19),
        password: generatePassword(12),
      });

    idForDelete = body.userId;
    expect(status).toEqual(CREATED);
    expect(body.message).toBeDefined();
    expect(body.userId).toBeDefined();
  });
});
