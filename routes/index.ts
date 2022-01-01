import express from "express";
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("../docs/apidoc");

// import routes here
const itemRoutes = require("./item");

// initialize routes here
router.use("/", itemRoutes);

const options = { explorer: true };
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));

module.exports = router;
