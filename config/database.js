const { createPool } = require("mysql2");
require('dotenv').config()


const pool = createPool({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log(
    "Database Connected"
  )
  connection.release();
});

module.exports = pool;
