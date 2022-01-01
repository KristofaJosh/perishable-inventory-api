const { Sequelize } = require("sequelize");

let env = process.env.NODE_ENV || "development";

const sequelizeProduction = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const sequelizeDev = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
});

const sequelizeTest = new Sequelize("testDB", process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
});

module.exports = env === "production" ? sequelizeProduction : env === "development" ? sequelizeDev : sequelizeTest;
