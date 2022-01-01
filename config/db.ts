import * as Process from "process";

const { Sequelize } = require("sequelize");

module.exports = new Sequelize(Process.env.DB_NAME, process.env.DB_USER, process.env.DB_PORT, {
  host: Process.env.DB_HOST,
  dialect: "postgres",
  // pool:{}
});
