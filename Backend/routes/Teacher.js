const express = require("express");

const {
    addTeacher,
    updateTeacher,
    getAllTeachers,
    deleteTeachers,
} = require("../controllers/teacher.controllers");
const router = express.Router();

router.post("/addteacher",  addTeacher);
router.patch("/updateteacher", updateTeacher);
router.get("/getteachers", getAllTeachers);
router.delete("/deleteteachers", deleteTeachers);

module.exports = router;
