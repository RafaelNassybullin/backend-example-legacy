const pool = require("../../../../services/database.service");

/**
 * Метод логина и нахождения существующего пользователя
 * @param {string} username - имя пользователья
 * @return {Promise<Object|null>}
 */
async function login(username) {
  const { rows: user } = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  return user.length ? user[0] : null;
}

module.exports = { login };
