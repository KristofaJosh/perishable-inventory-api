import express from "express";
const item = express.Router();
const itemController = require("../controllers/itemController");

item.post("/:item/add", itemController.add);
item.post("/:item/sell", itemController.sell);
item.get("/:item/quantity", itemController.quantity);

module.exports = item;
