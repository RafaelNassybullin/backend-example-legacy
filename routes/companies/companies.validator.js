const path = require("path");
const { body, check, query } = require("express-validator");
const { UnprocessableEntity } = require("../../constants/errors");
const validate = require("../../middleware/validation.middleware");
const logger = require("../../services/logger.service")(module);
const imageService = require("../../services/image.service");

const getOne = [
  check("id").isNumeric().withMessage({
    code: UnprocessableEntity,
    message: "id: parameter has incorrect format",
  }),
  validate,
];
const getMany = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 5, max: 50 })
    .withMessage("Limit min 5 and max 50, must be an integer"),
  query("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage('Status must be either "active" or "inactive"'),
  query("types").optional().isString().withMessage("Types must be a string"),
  query("sortBy")
    .optional()
    .isIn([
      "name-asc",
      "name-desc",
      "created-desc",
      "created-asc",
      "name-desc_created-desc",
      "name-asc_created-desc",
      "name-desc_created-asc",
      "name-asc_created-asc",
      "created-desc_name-desc",
      "created-asc_name-desc",
      "created-desc_name-asc",
      "created-asc_name-asc",
    ])
    .withMessage(
      'Status must be one of "name-asc", "name-desc", "created-desc", "created-asc", "name-desc_created-desc", "name-asc_created-desc", "name-desc_created-asc", "name-asc_created-asc", "created-desc_name-desc", "created-asc_name-desc", "created-desc_name-asc", "created-asc_name-asc" items'
    ),
];

const editOne = [
  check("id").isNumeric().withMessage("id: parameter has incorrect format"),
  body().custom((body) => {
    if (!Object.keys(body).length) {
      throw new Error("At least one field must be provided");
    }
    return true;
  }),
  body("name").trim().optional().isString(),
  body("shortName").trim().optional().isString(),
  body("businessEntity").optional().trim().isString(),
  body("status").trim().optional().isString(),
  body("companyTypes").trim().optional().isString(),
  body("contract")
    .trim()
    .optional()
    .isNumeric()
    .withMessage("contract is numeric"),
  body("street").trim().optional().isString(),
  body("city").trim().optional().isString(),
  body("postalCode").trim().optional().isString(),
  body("country").trim().optional().isString(),
];

const createOne = [
  check("id").isNumeric().withMessage("id: parameter has incorrect format"),
  body("name").trim().isString().notEmpty().withMessage("name is required"),
  body("shortName")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("shortName is required"),
  body("businessEntity")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("businessEntity is required"),
  body("status").trim().isString().notEmpty().withMessage("status is required"),
  body("companyTypes")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("companyTypes is required"),
  body("contract")
    .trim()
    .isNumeric()
    .withMessage("contract is numeric")
    .notEmpty()
    .withMessage("contract is required"),
  body("street").trim().isString().notEmpty().withMessage("street is required"),
  body("city").trim().isString().notEmpty().withMessage("city is required"),
  body("postalCode")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("postalCode is required"),
  body("country")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("country is required"),
];

const addImage = [
  check("id").isNumeric().withMessage({
    code: UnprocessableEntity,
    message: "id: parameter has incorrect format",
  }),
  body()
    .custom((_, { req }) => req.files?.file[0])
    .withMessage({
      code: UnprocessableEntity,
      message: "file: parameter is required",
    })
    .bail()
    .custom(async (_, { req }) => {
      const file = req.files.file[0];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const tempFilePath = file.path;

      const isAllowedExtension = [".png", ".jpg", ".jpeg"].includes(
        fileExtension
      );
      if (!isAllowedExtension) {
        await imageService
          .removeImage(tempFilePath)
          .catch((err) => logger.error(err));
      }
      return isAllowedExtension;
    })
    .withMessage({
      code: UnprocessableEntity,
      message: "files.file: only image files are allowed to upload",
    }),
  validate,
];

const removeImage = [
  check("id").isNumeric().withMessage({
    code: UnprocessableEntity,
    message: "id: parameter has incorrect format",
  }),
  validate,
];

module.exports = { getOne, editOne, createOne, getMany, addImage, removeImage };
