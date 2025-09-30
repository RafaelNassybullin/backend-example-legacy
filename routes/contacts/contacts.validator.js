const { check, body } = require("express-validator");
const { UnprocessableEntity } = require("../../constants/errors");
const validate = require("../../middleware/validation.middleware");

const getOne = [
  check("id").isNumeric().withMessage({
    code: UnprocessableEntity,
    message: "id: parameter has incorrect format",
  }),
  validate,
];

const createOne = [
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Lastname is required")
    .isString(),
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("Firstname is required")
    .isString(),
  body("patronymic")
    .trim()
    .notEmpty()
    .withMessage("Patronymic is required")
    .isString(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isNumeric()
    .withMessage("Phone is numeric")
    .isLength({ min: 7 })
    .withMessage("Phone must be min 7 numbers"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
];

const editAllowedFields = [
  "lastname",
  "firstname",
  "patronymic",
  "phone",
  "email",
];

const editOne = [
  check("id").isNumeric().withMessage({
    code: UnprocessableEntity,
    message: "id: parameter has incorrect format",
  }),
  body().custom((value, { req }) => {
    if (!value || typeof value !== "object") {
      throw new Error("Invalid data!");
    }

    const keys = Object.keys(value);

    if (keys.length === 0) {
      throw new Error("At least one field must be provided");
    }
    const invalidKeys = keys.filter((key) => !editAllowedFields.includes(key));
    if (invalidKeys.length) {
      throw new Error(
        `Detected invalid keys and values: ${invalidKeys.join(", ")}`
      );
    }
    return true;
  }),
  body("lastname").trim().optional().isString(),
  body("firstname").trim().optional().isString(),
  body("patronymic").trim().optional().isString(),
  body("phone")
    .trim()
    .optional()
    .isNumeric()
    .withMessage("Phone is numeric")
    .isLength({ min: 7 })
    .withMessage("Phone must be min 7 numbers"),
  body("email").trim().optional().isEmail().withMessage("Email is not valid"),
];

module.exports = { getOne, editOne, createOne };
