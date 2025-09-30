const pool = require("../../../../services/database.service");
/**
 * Возвращает pong если ping
 * @return {Promise<object>}
 */
async function pingDatabase() {
  const client = await pool.connect();
  try {
    await client.query("SELECT id FROM users LIMIT 1");
    return "pong";
  } catch {
    return "untouchable";
  } finally {
    client.release();
  }
}

module.exports = { pingDatabase };
