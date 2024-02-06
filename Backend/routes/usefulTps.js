const express = require("express");

const {
    addTipsIcon,
    addTips,
    getAllTips,
    getTipsIcon,
    deleteTip,
    deleteTipIcon,
} = require("../controllers/usefulTips.controllers");
const router = express.Router();

router.post("/addtipsicon",  addTipsIcon);
router.get("/gettipsicon",  getTipsIcon);
router.delete("/deletetipicon",  deleteTipIcon);
router.post("/addtips",  addTips);
router.get("/getalltips",  getAllTips);
router.delete("/deletetip",  deleteTip);

module.exports = router;
