const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-mysql", "root", "12345", {
  dialect: "mysql",
  host: "127.0.0.1",
});

module.exports = sequelize;
