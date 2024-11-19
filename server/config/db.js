const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'api',
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};