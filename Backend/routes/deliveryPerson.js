const express = require('express');
const router = express.Router();
const { deliveryPersonLogin,
    deliveryPersonSignup,
    deliveryPersonSocialSignup,
    getAllDeliveryPersons,
    updateDriverStatus,
    updateDriver,
    updateDeliveryPersonLocation,
    updateDriverPassword,
    checkDriverMail,
    getUnApprovedDeliveryPersons,
    disableAccount,
    getDeactivateAccount,
    deactivateaccount,
} = require('../controllers/deliveryperson.controllers')
const checkAuth = require('../middleware/check-auth')

router.post('/driverlogin', deliveryPersonLogin)
router.post('/driversignup', deliveryPersonSignup)
router.post('/driversocialsignup', deliveryPersonSocialSignup)
router.get('/getalldrivers', getAllDeliveryPersons)
router.get('/getallunapproveddrivers', getUnApprovedDeliveryPersons)
router.patch('/updatedriverstatus', updateDriverStatus)
router.patch('/updatedriverslocation', updateDeliveryPersonLocation)
router.patch('/updatepassword', updateDriverPassword)
router.patch("/updatedriver", checkAuth, updateDriver);
router.get('/checkemail', checkDriverMail)

router.patch("/disableaccount", checkAuth ,  disableAccount);
router.get("/getdeactivateaccount", checkAuth ,  getDeactivateAccount);
router.patch("/deactivateaccount",   deactivateaccount);

module.exports = router;