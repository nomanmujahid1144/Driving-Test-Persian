const express = require('express');
const router = express.Router();
const {
    AddAnnouncement,
    GetAnnouncement,
} = require('../controllers/announcement.controllers')

router.post('/addannouncement', AddAnnouncement)
router.get('/getannouncement', GetAnnouncement)


module.exports = router;