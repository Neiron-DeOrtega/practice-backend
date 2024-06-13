const mysql = require("mysql2");
require('dotenv').config()
  
const config = mysql.createConnection({
  host: process.env.CONFIG_HOST,
  user: process.env.CONFIG_USER,
  database: process.env.CONFIG_DATABASE,
  password: process.env.CONFIG_PASSWORD
});

module.exports = config