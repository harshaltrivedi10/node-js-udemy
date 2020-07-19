const mysql = require("mysql2");

//  create connection pool
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  database: "node-mysql",
  password: "12345",
});

module.exports = pool.promise();
