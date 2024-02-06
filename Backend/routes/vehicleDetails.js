const express = require('express');
const router = express.Router();
const { addVehicle } = require('../controllers/vehicledetails.controllers')
const checkAuth = require('../middleware/check-auth')



router.post('/addvehicle', addVehicle)



module.exports = router;