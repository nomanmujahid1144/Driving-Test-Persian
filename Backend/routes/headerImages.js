const express = require('express');
const router = express.Router();
const { 
    AddHeaderImage,
    GetHeaderImage,
} = require('../controllers/headerimage.controllers')
const checkAuth = require('../middleware/check-auth')

router.post('/addbannerImage' ,  AddHeaderImage)
router.get('/getbannerImages' ,  GetHeaderImage)


module.exports = router;