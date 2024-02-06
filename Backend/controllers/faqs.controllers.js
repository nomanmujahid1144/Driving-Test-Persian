const ErrorResponse = require('../utils/errorResponse');
const Faqs = require('../models/Faqs');
const mongoose = require('mongoose');



exports.AddFaqs = async (req, res, next) => {
  try {

    console.log(req.body)
    let body = req.body;

    const FrequentAskQuestions = await Faqs.find({})

    let FAQS;

    if (FrequentAskQuestions.length != 0) {
      FAQS = await Faqs.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(FrequentAskQuestions[0]._id) }, body)
    } else {
      const about = new Faqs({
        Faqs: body.faqs,
      });

      FAQS = about.save();
    }

    if (!FAQS) {
      return next(new ErrorResponse("add About Us failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Added FAQS",
      data: FAQS,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.GetFaqs = async (req, res, next) => {

  try {
    const FAQS = await Faqs.find({})

    if (!FAQS) {
      return next(new ErrorResponse("About Us Getting Failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Get",
      data: FAQS,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
