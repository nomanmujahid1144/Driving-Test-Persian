const express = require("express");

const {
  addAnswers,
} = require("../controllers/testAnswers.controllers");

const router = express.Router();


router.post("/addanswer",  addAnswers);

module.exports = router;
