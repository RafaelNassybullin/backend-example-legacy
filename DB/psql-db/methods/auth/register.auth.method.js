const pool = require("../../../../services/database.service");
/**
 * Метод регистрации и нахождения существующего пользователя
 * @param {string} name - имя
 * @param {string} username - имя пользователья
 * @param {string} hashedPassword - хэш пароль пользователья
 * @return {Promise<Object|null>}
 */
async function register(name, username, hashedPassword) {
  const client = await pool.connect();

  try {
    const { rows: exist } = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (exist.length) {
      return "username exist";
    }

    const { rows: user } = await pool.query(
      "INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING *",
      [name, username, hashedPassword]
    );

    return user.length ? user[0] : null;
  } finally {
    client.release();
  }
}

module.exports = { register };
