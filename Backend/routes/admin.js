const express = require("express");
const router = express.Router();
const {
  adminSignup,
  adminLogin,
  getDashboardData,
  getSingleShopById,
  updateRadius,
  updateShopById,
  getAdmin,
} = require("../controllers/admin.controllers");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.get("/getsingleshopbyid" ,getSingleShopById);
router.patch("/updateradius" ,updateRadius);
router.post("/updateshopbyid" ,updateShopById);
router.get("/getdashboarddata", checkAuth, getDashboardData);
router.get("/getadmin", getAdmin);

module.exports = router;
