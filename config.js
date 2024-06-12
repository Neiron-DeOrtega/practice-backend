const mysql = require("mysql2");
  
const config = mysql.createConnection({
  host: "localhost",
  user: "inomanager",
  database: "inodo",
  password: "Twudrin2"
});

// const config = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "inodo",
//   password: ""
// });

module.exports = config