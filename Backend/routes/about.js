const express = require('express');
const router = express.Router();
const {
    AddAboutUs,
    GetAboutUs,
} = require('../controllers/aboutus.controllers')

router.post('/addaboutus', AddAboutUs)
router.get('/getaboutus', GetAboutUs)


module.exports = router;