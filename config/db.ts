const { Sequelize } = require("sequelize");

module.exports = new Sequelize("pinventory_db", "postgres", "1234", {
  host: "localhost",
  dialect: "postgres",
  // pool:{}
});
