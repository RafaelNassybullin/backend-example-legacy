/**
 * Обрабатывает данные компании и возвращает результат.
 * @param {Object} item
 * @param {string} photoUrl
 * @return {Object}
 */
function parseOne(item, photoUrl) {
  return {
    ...item,
    photos: item.photos.map((photo) => ({
      ...photo,
      name: `${photoUrl}/static/images/${photo.name}`,
      thumbpath: `${photoUrl}/static/images/${photo.thumbpath}`,
    })),
  };
}

module.exports = { parseOne };
