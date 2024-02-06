const express = require("express");

const {
  addQuestion,
  updateQuestion,
  getEnglishCategoryQuestion,
  getTestQuestions,
  getTestResults,
  getSingleTestResults,
  deleteSingleTest,
  deleteTestQuestion,
} = require("../controllers/testQuestion.controller");

const router = express.Router();


router.post("/addquestions",  addQuestion);
router.patch("/updatequestion",  updateQuestion);
router.get("/getcategoryquestions", getEnglishCategoryQuestion);
router.delete('/deleteTestQuestions', deleteTestQuestion);

router.get('/getTestResults' , getTestResults)
router.get('/getTestQuestions', getTestQuestions);
router.get('/getSingleTestResults', getSingleTestResults);
router.delete('/deleteTest', deleteSingleTest);

module.exports = router;
