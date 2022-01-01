const { Sequelize } = require("sequelize");

const isDev = () => {
  let env = process.env.NODE_ENV || "development";
  return env !== "development"
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};
};

module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  ssl: true,
  ...isDev(),
});
