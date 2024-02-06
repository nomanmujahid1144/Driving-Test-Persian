const ErrorResponse = require("../utils/errorResponse");
const DeliveryPerson = require("../models/DeliveryPerson");
const bcrypt = require("bcrypt");
const { sendEmail } = require('../helpers/SendEmail')
const jsonwebtoken = require("jsonwebtoken");
const { uploadImage } = require('../helpers/helpers')
const mongoose = require("mongoose");
const {
  getDataFromFirebase,
  addDataToFirebase,
} = require("../utils/notifications");

var berbix = require("berbix");
var client = new berbix.Client({
  apiSecret: process.env.BERBIX_SECRET_KEY,
});
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.EMAIL_API);

exports.deliveryPersonSignup = async (req, res, next) => {
  console.log(req.body, "signup request deliveryPerson");
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let deliveryPerson = new DeliveryPerson({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hash,
      phoneNumber: req.body.phoneNumber,
      drivingLicense: req.body.drivingLicense,
    });
    const result = await deliveryPerson.save();
    if (!result) {
      return next(new ErrorResponse("Signup failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Signed Up Successfully",
      data: result,
    });
  } catch (err) {
    return next(new ErrorResponse("This email already exists", 400));
  }
};

exports.deliveryPersonSocialSignup = async (req, res, next) => {
  console.log(req.body, "signup social driver request");
  try {
    const oldUser = await DeliveryPerson.findOne({ email: req.body.email })
    if (oldUser) {
      const token = jsonwebtoken.sign(
        {
          data: [oldUser.email, oldUser._id],
          role: "driver",
        },
        process.env.JWT_SECRET
      );
      return res.status(200).json({
        success: true,
        message: "Logged in Successfully",
        data: {
          token,
          "id": oldUser._id,
        },
        "user": oldUser
      });
    }
    let user = new DeliveryPerson({
      email: req.body.email,
      fullName: req.body.fullName,
      profilePhoto: req.body.profilePhoto,
      fcmToken: req.body.fcmToken

    });
    const result = await user.save();
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Signed Up Successfully",
        data: result,
      });
    }
    else {
      return res.status(400).json({
        success: false,
        message: "Sign up failed",
        data: null,
      });
    }


  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};


exports.deliveryPersonLogin = async (req, res, next) => {
  console.log(req.body, "Login request");
  try {
    const result = await DeliveryPerson.findOne({ email: req.body.email });
    if (!result) {
      // this means result is null
      return next(new ErrorResponse("Incorrect email address", 401));
    } else {
      // email did exist
      // so lets match password
      if (bcrypt.compareSync(req.body.password, result.password)) {
        // great, allow this user access
        const saveFcmToken = await DeliveryPerson.updateOne(
          { email: req.body.email },
          { fcmToken: req.body.fcmToken }
        );
        const token = jsonwebtoken.sign(
          {
            data: [result.email, result._id],
            role: "driver",
          },
          process.env.JWT_SECRET
        );

        return res.status(200).json({
          success: true,
          message: "Logged in Successfully",
          data: {
            token,
            id: result._id,
          },
          user: result
        });



      } else {
        return next(new ErrorResponse("Incorrect password", 401));
      }
    }
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllDeliveryPersons = async (req, res, next) => {
  try {
    const deliveryPersons = await DeliveryPerson.find({}).sort({
      createdAt: -1,
    });
    if (deliveryPersons.length === 0) {
      return res.status(200).json({
        data: null,
        message: "No drivers found",
        success: false,
      });
    }
    return res.status(200).json({
      data: deliveryPersons,
      message: "Found drivers",
      success: true,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.updateDriverStatus = async (req, res, next) => {
  try {
    const deliveryPerson = await DeliveryPerson.updateOne(
      { _id: mongoose.Types.ObjectId(req.query.id) },
      req.body
    );
    console.log(deliveryPerson);
    if (deliveryPerson.nModified !== 1) {
      return res.status(200).json({
        data: null,
        message: "update failed",
        success: false,
      });
    }
    return res.status(200).json({
      data: deliveryPerson,
      message: "Updated successfully",
      success: true,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.updateDeliveryPersonLocation = async (req, res, next) => {
  try {
    console.log("got in location route");

    const updatedCoords = await DeliveryPerson.findByIdAndUpdate(
      mongoose.Types.ObjectId(req.body.driverId),
      { "geometry.coordinates": req.body.geometry },
      { new: true }
    );
    console.log(updatedCoords);
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.checkDriverMail = async (req, res, next) => {
  try {
    let userEmail = await DeliveryPerson.findOne({ email: req.query.email });
    console.log(userEmail.email, "user email");
    if (!userEmail) {
      return res.status(200).json({
        success: false,
        message: "This user does not exist ",
        data: null,
      });
    }
    const otp = Math.floor(Math.random() * 90000) + 10000;
    const msg = {
      to: `${userEmail.email}`,
      from: process.env.EMAIL, // Change to your verified sender
      subject: "Security Check",
      text: `${otp}`,
      html: `<strong>Enter this code in application : ${otp}</strong>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        return res.status(200).json({
          success: true,
          message: "Security code has been sent to your email account",
          data: otp,
        });
      })
      .then((e) => console.log(e, "in sending error"));
  } catch (err) {
    console.log("got in catch block");
    return next(new ErrorResponse(err, 400));
  }
};

exports.updateDriverPassword = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let userEmail = await DeliveryPerson.updateOne(
      { email: req.body.email },
      { password: hash }
    );
    if (userEmail.nModified < 1) {
      return res.status(200).json({
        success: false,
        message: "Password Update Failed",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
      data: null,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.updateDriver = async (req, res, next) => {
  console.log(req.body, " :boody")
  console.log(req.files, " :files")
  try {
    const userId = req.user?.data[1];
    let body = req.body
    if (req.files) {
      if (req.files.profilePhoto) {
        const profilePhotoUploaded = await uploadImage(req.files.profilePhoto, next)
        body.profilePhoto = profilePhotoUploaded.photoPath
      }
      if (req.files.drivingLicense) {
        const licPhotoUploaded = await uploadImage(req.files.drivingLicense, next)
        body.profilePhoto = licPhotoUploaded.photoPath
      }
      console.log(body, " :new body")
    }

    const updatedUser = await DeliveryPerson.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      body
    );
    if (!updatedUser) {
      return res.status("Driver Update Failed", 400);
    }
    return res.status(200).json({
      success: true,
      message: "Driver Updated Successfully",
      data: updatedUser,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};





exports.getUnApprovedDeliveryPersons = async (req, res, next) => {
  try {
    const deliveryPersons = await DeliveryPerson.find({ $and: [{ blocked: false }, { verified: false }] }).sort({
      createdAt: -1,
    });
    if (deliveryPersons.length === 0) {
      return res.status(200).json({
        data: null,
        message: "No drivers found",
        success: false,
      });
    }
    return res.status(200).json({
      data: deliveryPersons,
      message: "Found drivers",
      success: true,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
}

exports.disableAccount = async (req, res, next) => {
  console.log(req.body, "order Body")
  const email = req.body.email
  const name = req.body.name

  try {
    const user = await DeliveryPerson.findOneAndUpdate({ 'email': email }, { deactivate: 1 })

    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID, // ClientID
      process.env.CLIENT_SECRET, // Client Secret
      process.env.REDIRECT_URL // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });
    const accessToken = oauth2Client.getAccessToken();


    const output = `
            <h2>Account Deletion Request</h2>
            <p><b>NOTE: </b>${name} with ${email} has requested to deactivate his account kindly deactivate his account from Admin Panel.</p>
            `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    // send mail with defined transport object
    const mailOptions = {
      from: `"${process.env.SENDER_NAME}" <${process.env.EMAIL}>`, // sender address
      to: process.env.EMAIL, // list of receivers
      subject: "Account Deletion Request:  ✔", // Subject line
      html: output, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail sent : %s", info.response);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Email Send to your Account.",
      data: null,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getDeactivateAccount = async (req, res, next) => {
  try {
    const user = await DeliveryPerson.find({
      $or: [
        { deactivate: 1 },
        { deactivate: 2 }
      ]
    })

    if (user.length != 0) {
      return res.status(200).json({
        success: true,
        message: "Found All Deactivated Users.",
        data: user,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "No User Found",
        data: [],
      });
    }
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.deactivateaccount = async (req, res, next) => {
  console.log(req.body, 'body')
  try {
    const user = await DeliveryPerson.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.query.id) },
      req.body,
      { new: true }
    );
    console.log(user);

    if (!user) {
      return res.status(200).json({
        data: null,
        message: "update failed",
        success: false,
      });
    }
    let output = '';

    if (user.deactivate == 2) {
      output = `
        <h3>Your account has been Deactivated by Admin.</h3>
        <h3>Feel free to contact Admin by more details</h3>
      `;
    } else if (user.deactivate == 1) {
      output = `
        <h3>Congratulations!!!<h3/>
        <h2>Your account has been Activated.</h2>
        <h2>Now you can start ordering.</h2>
      `;
    }

    await sendEmail(output, user.email, 'Account Info', next)

    return res.status(200).json({
      data: user,
      message: "Updated successfully",
      success: true,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
