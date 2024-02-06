const ErrorResponse = require('../utils/errorResponse');
const Admin = require('../models/Admin');
const Radius = require('../models/Radius');
const { uploadImage } = require('../helpers/helpers');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const Category = require('../models/Category')
const Answers = require('../models/Answers')
const Question = require('../models/Question')
const Product = require('../models/Product');

exports.adminSignup = async (req, res, next) => {
    try {
        console.log(req.body)
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)

        let admin = new Admin({
            name : req.body.name,
            email: req.body.email,
            password: hash 
        })
        const token =  jsonwebtoken.sign(
            {
              data: [admin.email, admin._id],
              role: "admin",
            },
            "" + process.env.JWT_SECRET
          );
        const result = await admin.save();
        if (!result) {
            return next(new ErrorResponse('Signup failed', 400))
        }
        return res.status(200).json({
            success: true,
            message: "Signup successfull",
            token
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}

exports.adminLogin = async (req, res, next) => {
    try {
        const result = await Admin.findOne({ email: req.body.email });
        if (!result) {
            // this means result is null
            return next(new ErrorResponse('Incorrect email address', 200))
        } else {
            // email did exist
            // so lets match password
            if (bcrypt.compareSync(req.body.password, result.password)) {
                // great, allow this user access
                const token = jsonwebtoken.sign({
                    data: [result.email, result._id],
                    role: 'admin'
                }, "" + process.env.JWT_SECRET);
                console.log(token);
                return res.status(200).json({
                    success: true,
                    message: 'Successfully Logged in',
                    token: token
                });
            }
            else {
                return next(new ErrorResponse('Incorrect password', 200))
            }
        }
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}


exports.getAdmin = async (req, res, next) => {

    try {
        const alreadyPresent = await Admin.findOne({})
        console.log(alreadyPresent)
        if (alreadyPresent) {
            return res.status(200).json({
                success: true,
                message: 'Got Admin Successfully',
                data: alreadyPresent
            });

        }
        return res.status(200).json({
            success: false,
            message: 'No Admin Found',
            data: null
        });


    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}

exports.getDashboardData = async (req, res, next) => {

    try {
        let AllCategory = await Category.find({});
        let AllDevices = await Answers.find({}).populate('categoryAnswers.questionId');
        let AllQuestions = await Question.find({});
        let totalQuestions = 0;
        let totalTestTakens = 0;

        // console.log(AllDevices.categoryAnswers ,'AllDevices')
        AllDevices.forEach((ans) => {
            if (ans.categoryAnswers.length !== 0) {
                ans.categoryAnswers.forEach((singleAnswer) => {
                    if (singleAnswer.answers.length !== 0) {
                        if (singleAnswer.answers.length === singleAnswer.questionId.questions.length) {
                            totalTestTakens++;
                        }
                    }
                })
            }
        })

        AllQuestions.forEach(question => {
            totalQuestions += question.questions.length
        })

        console.log(totalTestTakens)

        return res.status(200).json({
            success: true,
            message: 'Got Dashboard Data Successfully',
            data: {
                totalCategories : AllCategory.length,
                totalUsers: AllDevices.length,
                totalQuestions: totalQuestions,
                totalTestTaken : totalTestTakens
            }
        });
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}

exports.getSingleShopById = async (req, res, next) => {
    console.log(req.query.restaurantId + " Query Request")
    try {
        const alreadyPresent = await Radius.findOne({ _id: req.query.restaurantId }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
            .populate('products.productIds')

        console.log(alreadyPresent)
        if (alreadyPresent) {
            return res.status(200).json({
                success: true,
                message: 'Got Radius Successfully',
                data: alreadyPresent
            });

        }
        return res.status(200).json({
            success: false,
            message: 'No Radius Found',
            data: []
        });


    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}
exports.updateRadius = async (req, res, next) => {

    console.log(req.body.restaurantId + " Restaurant ID")
    console.log(req.body.verify + " verify ")
    console.log(mongoose.Types.ObjectId(req.body.restaurantId))

    const verification = {
        verifyStatus: 1
    }
    try {
        const restaurantId = await Radius.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.restaurantId) }, verification)

        console.log(restaurantId + " Registered Restaurant")
        Product.find({}, function (err, product) {
            if (err) {
                console.log(err)
            } else {
                console.log(product)
                restaurantId.products.productIds = product;
                restaurantId.save();
            }
        })
        if (restaurantId) {
            return res.status(200).json({
                success: true,
                message: 'Update Registration Radius Successfully',
                data: restaurantId
            });

        }
        return res.status(200).json({
            success: false,
            message: 'No Radius Found',
            data: []
        });


    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}
exports.updateShopById = async (req, res, next) => {

    console.log(req.query.restaurantId + " Restaurant ID")
    console.log(req.body)
    console.log(req.files)

    const body = req.body

    try {

        if (req.files?.restaurantImage) {
            const toBeUpdated = await Radius.findOne({ _id: mongoose.Types.ObjectId(req.query.restaurantId) }).select('shopImage')
            fs.unlink(`${process.env.FILE_DELETE_PATH}${toBeUpdated.restaurantImage}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });
            const uploadedPath = await uploadImage(req.files?.restaurantImage, next)
            body.shopImage = uploadedPath.photoPath
        }

        const restaurantId = await Radius.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.query.restaurantId) }, req.body, { new: true })

        if (restaurantId) {
            return res.status(200).json({
                success: true,
                message: 'Update Registration Successfully',
                data: restaurantId
            });
        }
        return res.status(200).json({
            success: false,
            message: 'No Radius Found',
            data: []
        });
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}