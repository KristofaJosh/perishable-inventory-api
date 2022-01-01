import express from "express";
const router = express.Router();

const itemRoutes = require("./item")

// create routes here
router.use('/', itemRoutes);

module.exports = router
