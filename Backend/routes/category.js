const express = require("express");
const multer = require("multer");
const path            = require('path');
const fs            = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/Product');

const {
  addCategory,
  getAllCategories,
  getSingleCategory,
  getAllTestCategories,
  getCategories,
  getAllStatisticesOfCategories,
  getAllStatisticesOfTestCategories,
  getSingleBrand,
  deleteCategories,
  updateCategory,
  getAllProductsClientSide,
} = require("../controllers/category.controller");
const router = express.Router();


router.post("/addcategory",  addCategory);
router.get("/getcategoriesall", getCategories);
router.get("/getcategories", getAllCategories);
router.get("/getsinglecategory", getSingleCategory);
router.get("/gettestcategories", getAllTestCategories);
router.get("/getstatistics", getAllStatisticesOfCategories);
router.get("/getteststatistics", getAllStatisticesOfTestCategories);


router.get("/getsinglebrand", getSingleBrand);


router.get("/getproductsclient", getAllProductsClientSide);
router.delete("/deletecategories", deleteCategories);
router.patch("/updatecategory", updateCategory);

module.exports = router;
