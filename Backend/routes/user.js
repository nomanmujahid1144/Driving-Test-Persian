const express = require("express");
const router = express.Router();
const {
  userLogin,
  userSignup,
  userSocialSignup,
  idVerification,
  addUserNumber,
  forgetPassword,
  VerifyJWTToken,
  getSingleUser,
  checkUserMail,
  updateUserPassword,
  updateUser,
  updateUserStatus,
  afterVerification,
  getAllUsers,
  verifyLocation,
  disableAccount,
  sendContactMail,
  getDeactivateAccount,
  deactivateaccount,
} = require("../controllers/user.controllers");
const {
  checkDriverMail,
} = require("../controllers/deliveryperson.controllers");
const checkAuth = require("../middleware/check-auth");

router.post("/userlogin", userLogin);
router.post("/usersignup", userSignup);
router.post("/usersocialsignup", userSocialSignup);
router.patch("/addusernumber", checkAuth, addUserNumber);
router.patch("/updateuser", checkAuth, updateUser);
router.patch("/updateuserstatus",  updateUserStatus);

router.post("/idverification" , checkAuth  , idVerification);
router.patch("/updatepassword", updateUserPassword);


router.patch("/forgetpassword", forgetPassword);
router.patch("/verifyjwttoken", VerifyJWTToken);

router.patch("/disableaccount", checkAuth ,  disableAccount);
router.get("/getdeactivateaccount", checkAuth ,  getDeactivateAccount);
router.patch("/deactivateaccount",   deactivateaccount);

router.get("/checkemail", checkUserMail);
router.get("/getsingleuser", checkAuth, getSingleUser);
router.get("/getallusers", checkAuth ,getAllUsers);
router.post('/afterverification' , afterVerification)


router.post('/verifylocation' , verifyLocation)
router.post('/sendcontactmail' , sendContactMail)

module.exports = router;
