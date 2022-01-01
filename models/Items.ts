const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Items = db.define("items", {
  lot: {
    type: DataTypes.STRING,
  },
  expires: {
    type: DataTypes.BIGINT,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Items;
