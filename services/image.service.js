/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require("fs");
const jimp = require("jimp");
const imagesConfig = require("../config").images;
const logger = require("./logger.service")(module);
/**
 * Переименовывает файл изображения.
 * @param {string} sourceFilePath
 * @param {string} targetFilePath
 * @return {Promise<unknown>}
 * @private
 */
async function renameImage(sourceFilePath, targetFilePath) {
  return new Promise((resolve, reject) => {
    fs.rename(sourceFilePath, targetFilePath, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

/**
 * Изменяет размеры изображения и сохраняет полученный результат.
 * @param {string} sourceFilePath
 * @param {string} targetFilePath
 * @return {Promise<void>}
 * @private
 */
async function resizeImage(sourceFilePath, targetFilePath) {
  const image = await jimp.read(sourceFilePath);
  await image.resize(jimp.AUTO, 180);
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  await image.crop(
    (w - imagesConfig.thumbSize) / 2,
    (h - imagesConfig.thumbSize) / 2,
    imagesConfig.thumbSize,
    imagesConfig.thumbSize
  );
  await image.writeAsync(targetFilePath);
}

/**
 * Удаляет файл изображения.
 * @param {string} filePath
 * @return {Promise<*>}
 */
async function removeImage(filePath) {
  fs.rm(filePath, { recursive: true, force: true }, (err) => {
    if (err) {
      logger.error(err);
    }
    logger.success();
  });
}

module.exports = { renameImage, resizeImage, removeImage };
