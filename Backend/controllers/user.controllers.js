const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const { uploadImage } = require('../helpers/helpers')
const { sendEmail } = require('../helpers/SendEmail')
const Radius = require("../models/Radius");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const firebase = require('firebase');
var berbix = require("berbix");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.EMAIL_API);



const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const JWT_RESET_KEY = process.env.JWT_RESET_KEY;
let client = new berbix.Client({
  apiSecret: "secret_test_hEZ5sPaWiHDPQKyv81NXMrcxXtBPBv1W",
});

exports.userSignup = async (req, res, next) => {
  console.log(req.body, "signup request");
  console.log(req.files);
  let body = req.body;
  try {
    let userInfo = await User.findOne({ email: req.body.email });
    if (userInfo) {
      success = false
      return res.status(400).json({ error: "Account with this email already exixts" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    if (req.files !== null) {
      const profilePhotoUploaded = await uploadImage(
        req.files.profilePhoto,
        next
      );
      body.profilePhoto = profilePhotoUploaded.photoPath;
    }


    let user = await new User({
      email: body.email,
      password: hash,
      phoneNumber: body.phoneNumber,
      profilePhoto: body.profilePhoto,
      fullName: body.fullName,
      deviceId : body.deviceId
    });
    const token = jsonwebtoken.sign(
      {
        data: [user.email, user._id],
        role: "user",
      },
      "" + process.env.JWT_SECRET
    );
    // console.log(token)
    try {
      const result = await user.save();


      const oauth2Client = new OAuth2(
        process.env.CLIENT_ID, // ClientID
        process.env.CLIENT_SECRET, // Client Secret
        process.env.REDIRECT_URL // Redirect URL
      );
      oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
      });
      const accessToken = oauth2Client.getAccessToken();
      // const token = jsonwebtoken.sign({ _id:  }, JWT_RESET_KEY, {
      //   expiresIn: "30m",
      // });
      // const CLIENT_URL = process.env.LOCAL_URL;
      // const CLIENT_URL = 'http://localhost:3000'; // Local
      // const CLIENT_URL = 'http://35.153.57.219'; // Local
      // const CLIENT_URL = 'https://budcars.net'; // Live

      const output = `
              <h1>Hi Codebreakers Admin</h1>
              <h4><span class="font-size : '30px'">${user.fullName ? `${user.fullName}` : 'Someone'}</span> Registered on your Platform . Please have a look onto admin panel.</h4>
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
        subject: "Registration Alert", // Subject line
        html: output, // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Mail sent : %s", info.response);
        }
      });

      const socket = req.app.get('io');
      socket.emit('newUser', { newUser : 'signUp' })

      return res.status(200).json({
        success: true,
        message: "Signed Up Successfully",
        data: result,
        token,
      })
    } catch (e) {
      return next(new ErrorResponse("Email Already Exists", 400));
    }
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.userLogin = async (req, res, next) => {
  console.log(req.query, "query");
  console.log(req.body, "Login request");
  // console.log(req.body)
  try {
    const result = await User.findOne({ email: req.body.email });
    console.log(result, 'result')
    if (!result) {
      // this means result is null
      return next(new ErrorResponse("Incorrect email address", 401));
    } else {
      // email did exist
      // so lets match password

      if (result.deviceId === req.body?.deviceId) {
        if (bcrypt.compareSync(req.body.password, result.password)) {
          // great, allow this user access
          const token = jsonwebtoken.sign(
            {
              data: [result.email, result._id],
              role: "user",
            },
            "" + process.env.JWT_SECRET
          );
          console.log(result, ":usersssssss")
          return res.status(200).json({
            success: true,
            message: "Logged In Successfully",
            data: {
              token,
              result,
  
            },
          });
        } else {
          return next(new ErrorResponse("Incorrect password", 401));
        }
      } else {
        return res.status(201).json({
          success: false,
          message: "Your account is currently logged in on another device.",
          data: null,
        });
      }

      
    }
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.userSocialSignup = async (req, res, next) => {
  console.log(req.body, "signup social user request");
  try {
    const oldUser = await User.findOne({ email: req.body.email })
    if (oldUser) {
      const token = jsonwebtoken.sign(
        {
          data: [oldUser.email, oldUser._id],
          role: "user",
        },
        process.env.JWT_SECRET
      );
      return res.status(200).json({
        success: true,
        message: "Logged In Successfully",
        data: { token, "result": oldUser },
      });;
    }
    let user = new User({
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
        data: token,
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



exports.addUserNumber = async (req, res, next) => {
  console.log(req.body.PhoneNumber, "add user number");
  try {
    // console.log(req.user.data[1]);
    const userId = req.user.data[1];
    console.log(userId, "userID");
    const updatedUser = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      { phoneNumber: req.body.PhoneNumber.toString() }
    );
    if (!updatedUser) {
      return res.status("Number Update Failed", 400);
    }
    console.log(updatedUser)
    return res.status(200).json({
      success: true,
      message: "Phone Number Added Successfully",
      data: updatedUser,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};


exports.getSingleUser = async (req, res, next) => {
  console.log(req.user.data[1], "users id");
  try {
    let user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.user.data[1]),
    });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "user found",
        data: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "user not found",
      data: user,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let user = await User.find({});
    if (user) {
      return res.status(200).json({
        success: true,
        message: "users found",
        data: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No User found",
      data: user,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};


exports.checkUserMail = async (req, res, next) => {
  try {
    let userEmail = await User.findOne({ email: req.query.email });
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
    return next(new ErrorResponse(err, 400));
  }
};

exports.forgetPassword = async (req, res, next) => {
  console.log(req.body, 'req.body')
  try {

    const email = req.body.email;
    const user = await User.findOne({ 'email': email })
    console.log(user, 'user')
    const userId = user.id;
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Not Send ",
        data: null,
      });
    } else {
      const oauth2Client = new OAuth2(
        process.env.CLIENT_ID, // ClientID
        process.env.CLIENT_SECRET, // Client Secret
        process.env.REDIRECT_URL // Redirect URL
      );
      oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
      });
      const accessToken = oauth2Client.getAccessToken();
      const token = jsonwebtoken.sign({ _id: userId }, JWT_RESET_KEY, {
        expiresIn: "30m",
      });

      // const CLIENT_URL = process.env.LOCAL_URL; // Local
      const CLIENT_URL = process.env.LIVE_URL; // Live

      const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/confirm-password/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
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
        to: email, // list of receivers
        subject: "Account Password Reset:  ✔", // Subject line
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
    }

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.VerifyJWTToken = async (req, res, next) => {
  console.log(req.body, 'req.body')
  try {
    const token = req.body.token
    jsonwebtoken.verify(token, JWT_RESET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Session Expired",
          data: null,
        });
      } else {
        const { _id } = decodedToken;
        console.log(_id)
        return res.status(200).json({
          success: true,
          message: "User Found",
          data: _id,
        });
      }
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.updateUserPassword = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt)
    let userEmail = await User.updateOne(
      { _id: req.body.id },
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

exports.idVerification = async (req, res, next) => {

  console.log(req.user.data[1] + " Id Verification User");
  console.log(req.body)
  try {
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(req.user.data[1]) }).select("_id");
    console.log(user + " Verified User ID");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Doesnt exists",
        data: null
      });
    }
    console.log(user + "Berbix User Found")
    let transactionTokens = await client.createTransaction({
      customerUid: user._id, // ID for the user in internal database
      // templateKey: req.body.type == 'web' ? "" + process.env.BERBIX_TEMPLETE_KEY_WEB : "" +process.env.BERBIX_TEMPLETE_KEY_MOBILE // Template key for this transaction
      templateKey: "tpk_m9QUQ9kt0QxVTYXWaUG6NI8xZefcLxVj" // Template key for this transaction
    });
    console.log(transactionTokens.clientToken + " Client tokens")
    const updatedDriver = await User.updateOne(
      { _id: req.user.data[1] },
      { accessToken: transactionTokens.accessToken, refreshToken: transactionTokens.refreshToken }
    );
    if (updatedDriver.nModified != 0) {
      return res.status(200).json({
        success: true,
        message: "Tokens",
        data: transactionTokens,
      });
    }
    return res.status(200).json({
      success: false,
      message: "cannot verify at this time",
      data: null,
    });

  } catch (err) {
    console.log("Error Section")
    console.log(err)
    return next(new ErrorResponse(err, 400));
  }
};


exports.afterVerification = async (req, res) => {
  console.log(req.body.customer_uid + " After Verification")
  const driver = await User.findOne({ _id: req.body.customer_uid }, { refreshToken: 1 })
  console.log(driver)
  var transactionTokens = berbix.Tokens.fromRefresh(driver.refreshToken)
  var transactionData = await client.fetchTransaction(transactionTokens)
  console.log(transactionData, " :transaction data")
  if (transactionData?.fields?.date_of_birth) {
    let dob = transactionData.fields.date_of_birth.value
    let newStr = dob.split('-', 3)
    let revDob = `${newStr[2]}-${newStr[1]}-${newStr[0]}`

    let today = new Date()
    var datesplit = revDob.split('-');
    var year = datesplit[2]
    var month = datesplit[1]
    var day = datesplit[0]
    var age = today.getFullYear() - year;
    console.log(age, "age")
    if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
      age--;
    }
    if (age >= 21) {
      const updatedUser = await User.findOneAndUpdate({ _id: transactionData.customer_uid }, { age: age, ageVerification: true })
    }
    else {
      const updatedUser = await User.findOneAndUpdate({ _id: transactionData.customer_uid }, { age: age, ageVerification: false })
    }

    return
  }
}

exports.updateUser = async (req, res, next) => {
  console.log(req.body, "update user");
  try {

    const userId = req.user.data[1];

    let body = req.body

    if (req.files) {
      const profilePhotoUploaded = await uploadImage(req.files.profilePhoto, next)
      body.profilePhoto = profilePhotoUploaded.photoPath
      console.log(body, " :new body")
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      req.body
      ,
      { new: true }
    );
    if (!updatedUser) {
      return res.status("User Update Failed", 400);
    }




    console.log(updatedUser)
    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.updateUserStatus = async (req, res, next) => {
  console.log(req.body, 'body')
  try {
    const user = await User.findOneAndUpdate(
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

    if (user.verified == true) {
      output = `
        <h3>Your account has been approved .</h3>
        <h3>You can start ordering</h3>
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



exports.verifyLocation = async (req, res, next) => {
  console.log(req.body, "order Body")

  try {
    const adminRadius = await Radius.find({ formattedAddress: req.body.formattedAddress });
    console.log(adminRadius, 'adminRadius')
    if (adminRadius.length < 1) {
      return res.status(403).json({
        success: false,
        message: "Service Not Available in Specified Area",
        data: null,
      });
    }

    //checking if User is with in location limits 
    let comparingCoor = await Radius.find({
      "geometry.coordinates": {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(req.body.geometry.coordinates[0]),
              parseFloat(req.body.geometry.coordinates[1]),
            ],
          },
          $maxDistance: parseInt(adminRadius[0].radius),
        },
      },
    });

    console.log(comparingCoor, 'comparingCoor')

    if (comparingCoor.length < 1) {
      console.log('i n here')
      return res.status(403).json({
        success: false,
        message: "Service Not Available in Specified Area ",
        data: null,
      });
    } else {

      //find distance from shop to delivery point
      const totalDistance = await Radius.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point", coordinates: [
                parseFloat(req.body.geometry.coordinates[0]),
                parseFloat(req.body.geometry.coordinates[1]),
              ]
            },
            distanceField: "dist.calculated",
            spherical: true
          }
        }
      ])

      console.log(totalDistance, 'Distance')

      return res.status(200).json({
        success: true,
        message: "haye",
        data: totalDistance[0],
      });
    }

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.disableAccount = async (req, res, next) => {
  console.log(req.body, "order Body")
  const email = req.body.email
  const name = req.body.name

  try {
    const user = await User.findOneAndUpdate({ 'email': email }, { deactivate: 1 })

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
    const user = await User.find({
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
    const user = await User.findOneAndUpdate(
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



exports.sendContactMail = async (req, res, next) => {
  console.log(req.body, "order Body")
  const userName = req.body.username;
  const phoneNumber = req.body.phone;
  const email = req.body.email;
  const message = req.body.message;

  try {

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
            <h2>From Contact Us</h2>
            <p><b>User Info: </b> ${userName} with ${email}  sends you a message.</p>
            <p>${message}</p>
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
      subject: "Contact Us Form ✔", // Subject line
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

