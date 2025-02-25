// database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'tmc-app-user',
  password: process.env.DB_PASSWORD || 'hYdmyj-qohcab-1povvu',
  database: process.env.DB_NAME || 'recipe_plan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;