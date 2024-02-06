const express = require("express");

const {
  addAnswers,
  getEachDeviceData,
  getResult,
  deleteCategoryResult,
} = require("../controllers/answers.controllers");

const router = express.Router();


router.post("/addanswer",  addAnswers);
router.get("/getresult",  getResult);
router.get('/geteachdevice', getEachDeviceData);
router.delete('/deletecategoryresult' , deleteCategoryResult)

module.exports = router;
