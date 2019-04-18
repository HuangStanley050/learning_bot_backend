const express = require("express");
const router = express.Router();
const botController = require("../controllers/bot");

router
  .post("/text", botController.textQuery)
  .post("/event", botController.eventQuery)
  .post("/fulfillment", botController.fulfillment);

module.exports = router;
