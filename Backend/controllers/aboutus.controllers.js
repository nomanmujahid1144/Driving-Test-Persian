const ErrorResponse = require('../utils/errorResponse');
const AboutUs = require('../models/AboutUs');
const mongoose = require('mongoose');



exports.AddAboutUs = async (req, res, next) => {
  try {

    let body = req.body;
    console.log(body, 'body')

    const findAboutUs = await AboutUs.find({})

    let aboutUs;

    if (findAboutUs.length != 0) {
      aboutUs = await AboutUs.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(findAboutUs[0]._id) }, body)
    } else {
      const about = new AboutUs({
        heading: body.heading,
        data: body.data
      });

      aboutUs = about.save();
    }

    if (!aboutUs) {
      return next(new ErrorResponse("add About Us failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Added About Us",
      data: aboutUs,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.GetAboutUs = async (req, res, next) => {

  try {
    const aboutus = await AboutUs.find({})

    if (!aboutus) {
      return next(new ErrorResponse("About Us Getting Failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Get",
      data: aboutus,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
