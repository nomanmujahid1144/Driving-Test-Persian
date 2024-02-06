const ErrorResponse = require('../utils/errorResponse');
const Teacher = require('../models/Teachers');
const { uploadImage } = require('../helpers/helpers');
const multer = require("multer");
const path            = require('path');
const fs            = require('fs');
const sharp            = require('sharp');
const mongoose = require('mongoose');

exports.addTeacher = async (req, res, next) => {
    try {
        console.log('got here success fully')
        const body = JSON.parse(req.query.values)
        console.log(body)

        if (!req.files) {
            return res.status(200).json({
                success: false,
                data: null,
                message: 'Upload Image'
            })
        }

        const uploadedPath = await uploadImage(req.files.institutePhoto , next)
        console.log(uploadedPath, 'path')


        const teacher = new Teacher({
            instituteName: body.instituteName,
            teacherName: body.teacherName,
            phoneno: body.phoneno,
            email: body.email,
            address: body.address,
            institutePhoto: uploadedPath.photoPath
        })
        const addedTeacher = await teacher.save();
        console.log(addedTeacher)

        if (!addedTeacher) {
            return next(new ErrorResponse('add Teacher failed', 400))
        }
        return res.status(200).json({
            success: true,
            data: addedTeacher
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
} 

exports.updateTeacher = async (req, res, next) => {
    try {
        let body = JSON.parse(req.query.values)
        console.log(body, 'body')
        
        const id = req.query.id

        if (req.files) {
            const toBeUpdated = await Teacher.findOne({ _id: mongoose.Types.ObjectId(id) }).select('institutePhoto')
            fs.unlink(`${process.env.FILE_DELETE_PATH}${toBeUpdated.institutePhoto}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });
            const uploadedPath = await uploadImage(req.files.institutePhoto, next)
            body.institutePhoto = uploadedPath.photoPath
        }

        const updatedteacher = await Teacher.updateOne({ _id: mongoose.Types.ObjectId(id) }, body)
        if (updatedteacher.nModified !== 1) {
            return res.status(200).json({
                data: null,
                message: 'update failed',
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            data: null,
            message: 'Teacher Updated Successfully'
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}


exports.getAllTeachers = async (req, res, next) => {
    try {
        const teachers = await Teacher.find({})
        console.log(teachers)
        if (teachers.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No Teachers found'
            })
        }
        return res.status(200).json({
            success: true,
            data: teachers,
            message: "Teachers found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}

exports.deleteTeachers = async (req, res, next) => {
    try {
        console.log(req.query.IDS)
        let deletedCount = 0
        Promise.all(req.query.IDS.map(async (element) => {
            const photoPath = await Teacher.findOne({ _id: mongoose.Types.ObjectId(element) }).select('institutePhoto')
            fs.unlink(`${process.env.FILE_DELETE_PATH}${photoPath.institutePhoto}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });
            const deletedTeachers = await Teacher.deleteOne({ _id: mongoose.Types.ObjectId(element) })
            console.log(deletedTeachers)
            if (deletedTeachers.n >= 1) {
                deletedCount = deletedCount + 1
            }
            console.log(deletedCount, "inside map deleted count")
        })).then(
            () => {
                console.log('deleted count', deletedCount)
                if (req.query.IDS.length === deletedCount) {
                    return res.status(200).json({
                        success: true,
                        message: "Deleted Successfully",
                        data: null
                    })
                }
                else {
                    return res.status(400).json({
                        success: false,
                        data: null,
                        message: 'deletion failed'
                    })
                }

            }

        );

    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}