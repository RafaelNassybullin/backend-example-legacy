const config = require("../config");

/**
 * Возвращает URL на основании указанного запроса.
 * @param {Object} req
 * @return {string}
 */
function getUrlForRequest(req) {
  const { port } = config;
  return `${req.protocol}://${req.hostname}${
    port === "80" || port === "443" ? "" : `:${port}`
  }`;
}

/**
 * Возвращает URL файла.
 * @param {Object} req
 * @param {string} fileName
 * @return {string}
 */
function getFileUrl(req, fileName) {
  const { user } = req;
  const url = getUrlForRequest(req);
  return `${url}/images/${user}/${fileName}`;
}

/**
 * Создание ссылок пагинаций.
 * @param {string} url
 * @param {string} originalUrl
 * @param {number} page
 * @param {number} totalPages
 * @param {number} limit
 * @return {Object}
 */
function paginationLinksHelper(url, originalUrl, page, totalPages, limit) {
  const link = url + originalUrl;
  const newUrl = new URL(link);
  const params = new URLSearchParams(newUrl.search);

  if (params.has("page") && !params.has("limit")) {
    params.delete("page");
  } else if (params.has("page") && params.has("limit")) {
    params.delete("page");
    params.delete("limit");
  } else if (!params.has("page") && params.has("limit")) {
    params.delete("limit");
  }
  const firstParams = new URLSearchParams([
    ["page", page],
    ["limit", limit],
    ...Array.from(params),
  ]).toString();
  const lastParams = new URLSearchParams([
    ["page", totalPages],
    ["limit", limit],
    ...Array.from(params),
  ]).toString();
  const prevParams = new URLSearchParams([
    ["page", page > 1 ? page - 1 : null],
    ["limit", limit],
    ...Array.from(params),
  ]).toString();
  const nextParams = new URLSearchParams([
    ["page", page + 1],
    ["limit", limit],
    ...Array.from(params),
  ]);
  const originalLink = url + newUrl.pathname;
  return {
    first: `${originalLink}?${firstParams}`,
    last: `${originalLink}?${lastParams}`,
    prev: page > 1 ? `${originalLink}?${prevParams}` : null,
    next: page < totalPages ? `${originalLink}?${nextParams}` : null,
  };
}
module.exports = { getUrlForRequest, getFileUrl, paginationLinksHelper };
