const ErrorResponse = require('../utils/errorResponse');
const { uploadImage } = require('../helpers/helpers');
const Delivery = require('../models/Delivery');
const mongoose = require('mongoose');



exports.AddDelivery = async (req, res, next) => {
  try {

    let body = req.body;
    console.log(body, 'body')

    const finddelivery = await Delivery.find({})

    let delivery;

    if (finddelivery.length != 0) {
      delivery = await Delivery.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(finddelivery[0]._id) }, body)
    } else {
      const about = new Delivery({
        heading: body.heading,
        data: body.data
      });

      delivery = about.save();
    }

    if (!delivery) {
      return next(new ErrorResponse("Add Delivery Data failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Added Delivery Data",
      data: delivery,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.GetDelivery = async (req, res, next) => {

  try {
    const delivery = await Delivery.find({})

    if (!delivery) {
      return next(new ErrorResponse("Delivery Data Getting Failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Get Delivery Data",
      data: delivery,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
