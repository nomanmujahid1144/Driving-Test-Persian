const express = require('express');
const router = express.Router();
const { 
    AddDeviceId,
} = require('../controllers/deviceinfo.controllers')
const checkAuth = require('../middleware/check-auth')

router.post('/adddeviceid' ,  AddDeviceId)


module.exports = router;