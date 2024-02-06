const express = require("express");

const {
  addQuestion,
  updateQuestion,
  getEnglishCategoryQuestion,
  getPersianCategoryQuestion,
  deleteQuestion
} = require("../controllers/question.controller");

const router = express.Router();


router.post("/addquestions",  addQuestion);
router.patch("/updatequestion",  updateQuestion);
router.get("/getcategoryquestions",  getEnglishCategoryQuestion);
router.get("/getpersiancategoryquestions", getPersianCategoryQuestion);
router.delete('/deleteQuestions', deleteQuestion);


module.exports = router;
