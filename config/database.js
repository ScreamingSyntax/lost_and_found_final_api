const { createPool } = require("mysql2");
require('dotenv').config()

// const pool = createPool({
//   host: "sql.freedb.tech",
//   user: "freedb_elevate",
//   password: "sf!gbUaPsUUHp7f",
//   database: "freedb_lost_and_found"
// });

const pool = createPool({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

// Attempt to get a connection from the pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  console.log("Database Connection Successfull");

  connection.release();
});

module.exports = pool;
