const ErrorResponse = require('../utils/errorResponse');
const Answers = require('../models/Answers');
const TestAnswers = require('../models/TestAnswers');



exports.AddDeviceId = async (req, res, next) => {
  try {

    let body = req.body;
    let deviceInfo;
    let testdeviceInfo;

    Answers.findOne({ deviceId: body.deviceId }, function (err, deviceId) {
      if (err) {
        return next(new ErrorResponse(err, 400));
      } else {
        if (!deviceId) {
          const deviceId = new Answers({
              deviceId : body.deviceId
          });
          deviceInfo = deviceId.save();

          TestAnswers.findOne({ deviceId: body.deviceId }, function (err, testdeviceId) {
            if (!testdeviceId) {
              const testdeviceId = new TestAnswers({
                deviceId : body.deviceId
              });
              testdeviceInfo = testdeviceId.save();
              return res.status(200).json({
                success: true,
                message: "Device-Id Successfully Added",
                data: deviceInfo,
              });
            } else {
              return res.status(200).json({
                success: true,
                message: "Device-Id Already Added",
                data: deviceInfo,
              });
            }
          })

        } else {
          TestAnswers.findOne({ deviceId: body.deviceId }, function (err, testdeviceId) {
            if (!testdeviceId) {
              const testdeviceId = new TestAnswers({
                deviceId : body.deviceId
              });
              testdeviceInfo = testdeviceId.save();
              return res.status(200).json({
                success: true,
                message: "Device-Id Already Added",
                data: deviceInfo,
              });
            } else {
              return res.status(200).json({
                success: true,
                message: "Device-Id Already Added",
                data: deviceInfo,
              });
            }
          })
      }
      }
    })

    

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

