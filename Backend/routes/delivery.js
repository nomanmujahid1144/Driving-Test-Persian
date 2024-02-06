const express = require('express');
const router = express.Router();
const {
    AddDelivery,
    GetDelivery,
} = require('../controllers/delivery.controllers')

router.post('/adddelivery', AddDelivery)
router.get('/getdelivery', GetDelivery)


module.exports = router;