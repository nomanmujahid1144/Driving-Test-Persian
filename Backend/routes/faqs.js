const express = require('express');
const router = express.Router();
const {
    AddFaqs,
    GetFaqs,
} = require('../controllers/faqs.controllers')

router.post('/addfaqs', AddFaqs)
router.get('/getfaqs', GetFaqs)


module.exports = router;