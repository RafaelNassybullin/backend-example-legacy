/**
 * Возвращает HTML страницу с указанным содержанием.
 * @param {string} content
 * @return {string}
 */
function renderPage(content) {
  return `<html><head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="static/github-markdown.css">
      </head>
      <body>
        <article class="markdown-body">${content}</article>
      </body>
    </html>`;
}

module.exports = { renderPage };
