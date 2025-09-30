const crypto = require("crypto");
const path = require("path");
const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const imagesConfig = require("../../../config").images;
const imageService = require("../../../services/image.service");
const companyMethods = require("../../../DB/psql-db/methods/company");
const { NotFound, BadRequest } = require("../../../constants/errors");

/**
 * POST /companies/:id/image
 * Эндпоинт загрузки изображения компании.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function addImage(req, res) {
  logger.init("add company image");
  const { id } = req.params;
  const file = req.files.file[0];

  const company = await companyMethods.getOne(id);

  if (!company) {
    throw new NotFound("Company not found");
  }
  if (company.photos.length) {
    throw new BadRequest("Photos is exist");
  }

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileName = crypto.randomBytes(10).toString("hex");

  const uploadedFileName = fileName + fileExtension;
  const uploadedFileThumbName = `${fileName}_${imagesConfig.thumbSize}x${imagesConfig.thumbSize}${fileExtension}`;

  const tempFilePath = file.path;
  const targetFilePath = path.resolve(
    `${imagesConfig.imagesDir}/${uploadedFileName}`
  );
  const targetThumbPath = path.resolve(
    `${imagesConfig.imagesDir}/${uploadedFileThumbName}`
  );

  await imageService.resizeImage(tempFilePath, targetThumbPath);
  await imageService.renameImage(tempFilePath, targetFilePath);

  const uploadedImage = {
    name: uploadedFileName,
    filepath: uploadedFileName,
    thumbpath: uploadedFileThumbName,
  };

  const savedImages = await companyMethods.saveImage(id, uploadedImage);

  if (savedImages === "Save image failed") {
    throw new BadRequest(savedImages);
  }

  res.status(OK).json(uploadedImage);
  logger.success();
}

module.exports = {
  addImage,
};
