const express = require("express");

const {
    addVideo,
    getAllVideos,
    deleteVideo,
} = require("../controllers/video.controllers");
const router = express.Router();

router.post("/addvideo",  addVideo);
router.get("/getvideos",  getAllVideos);
router.delete("/deletevideo",  deleteVideo);

module.exports = router;
