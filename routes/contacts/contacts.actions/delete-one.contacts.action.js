const path = require("path");
const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const contactMethods = require("../../../DB/psql-db/methods/contact");
const { NotFound } = require("../../../constants/errors");
const imageService = require("../../../services/image.service");

/**
 * DELETE /contacts/:id
 * Эндпоинт удаления контакта.
 * @param {Object} req
 * @param {Object} res
 * @return {Promise<void>}
 */
async function deleteOne(req, res) {
  logger.init("delete contact");
  const { id } = req.params;
  const deleted = await contactMethods.deleteOne(id);

  if (!deleted?.id) {
    throw new NotFound("Contact is not found");
  }

  if (deleted?.filepath) {
    await imageService.removeImage(
      path.join(process.cwd(), "public/images", deleted?.filepath)
    );
  }

  if (deleted?.thumbpath) {
    await imageService.removeImage(
      path.join(process.cwd(), "public/images", deleted?.thumbpath)
    );
  }

  res.status(OK).json({
    success: true,
    message: "Contact deleted successfully",
    deletedId: deleted.id,
  });
  logger.success();
}

module.exports = { deleteOne };
