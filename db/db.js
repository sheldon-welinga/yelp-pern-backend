const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});

pool.connect((err) => {
  if (err) {
    console.log("An error occurred while connecting to database", err.message);
  } else {
    console.log("Database connected successfully!");
  }
});

module.exports = { pool };
