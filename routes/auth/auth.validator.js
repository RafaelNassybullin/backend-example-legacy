const { body } = require("express-validator");

const login = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required!")
    .isString(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!")
    .isString(),
];

const register = [
  body("name").trim().notEmpty().withMessage("Name is require!").isString(),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required!")
    .isString(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!")
    .isStrongPassword()
    .withMessage("You should use a stronger password!"),
];

const refresh = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("RefreshToken is required!")
    .isString(),
];

module.exports = { login, register, refresh };
