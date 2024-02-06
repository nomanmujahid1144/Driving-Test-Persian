const ErrorResponse = require('../utils/errorResponse');
const VehicleDetails = require('../models/VehicleDetails');
const mongoose = require('mongoose')

exports.addVehicle = async (req, res, next) => {
    try {
        const vehicle = new VehicleDetails({
            registrationNumber: req.body.registrationNumber,
            deliveryPerson: mongoose.Types.ObjectId(req.body.id)
        })
        const result = await vehicle.save();
        if (!result) {
            return next(new ErrorResponse('vehicle addition failed', 400))
        }
        return res.status(200).json({
            success: true,
            data: result
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}








