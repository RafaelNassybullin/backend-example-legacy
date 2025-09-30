const path = require("path");
const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const imageService = require("../../../services/image.service");
const { NotFound, BadRequest } = require("../../../constants/errors");
const companyMethods = require("../../../DB/psql-db/methods/company");

/**
 * DELETE /companies/:id/image
 * Эндпоинт удаления изображения компании.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function removeImage(req, res) {
  logger.init("remove company image");
  const { id } = req.params;

  const company = await companyMethods.getOne(id);
  if (!company) {
    throw new NotFound("Company not found");
  }

  if (!company.photos?.length) {
    throw new BadRequest("Photos is not exist");
  }

  const deleted = await companyMethods.deleteImage(id);

  if (deleted === "Delete image failed") {
    throw new BadRequest(deleted);
  }

  if (deleted?.filepath || deleted?.thumbpath || deleted?.company_id) {
    await imageService.removeImage(
      path.join(process.cwd(), "public/images", deleted?.filepath)
    );
    await imageService.removeImage(
      path.join(process.cwd(), "public/images", deleted?.thumbpath)
    );
  }

  res.status(OK).json({
    message: `Image with company_id: ${deleted?.company_id} successfully deleted`,
  });

  logger.success();
}

module.exports = {
  removeImage,
};
