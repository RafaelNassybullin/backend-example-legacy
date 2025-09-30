const { Pool } = require("postgres-pool");

// Обновленный, автоматический закрывающийся пул для Postgres, проверено в pgAdmin
const pool = new Pool({
  connectionString:
    "postgres://rafael:dgfHJJdjh%25%24%236398@localhost/taskbackend",
});

module.exports = pool;
