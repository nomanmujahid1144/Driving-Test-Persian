const ErrorResponse = require('../utils/errorResponse');
const usefulTips = require('../models/UsefulTips');
const UsefulTipsIcon = require('../models/UsefulTipsIcon');
const { uploadFile, uploadVideo, uploadImage } = require('../helpers/helpers');
const multer = require("multer");
const path            = require('path');
const fs            = require('fs');
const sharp            = require('sharp');
const mongoose = require('mongoose');

exports.addTipsIcon = async (req, res, next) => {
    try {
        console.log('got here success fully')
        const body = JSON.parse(req.query.values)
        console.log(body)

        if (!req.files) {
            return res.status(200).json({
                success: false,
                data: null,
                message: 'Upload File'
            })
        }

        let FileUploaded;

        if (req.files?.iconImage) {
            FileUploaded = await uploadImage(req.files.iconImage, next)
        }

        const tipsIcon = new UsefulTipsIcon({
            iconImage: req.files?.iconImage ? FileUploaded.photoPath : '',
        })

        const addedTips = await tipsIcon.save();
        console.log(addedTips)

        if (!addedTips) {
            return next(new ErrorResponse('add Tips Icon failed', 400))
        }
        return res.status(200).json({
            success: true,
            data: addedTips
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
} 

exports.getTipsIcon = async (req, res, next) => {
    try {
        const allTips = await UsefulTipsIcon.find({})
    
        if (allTips.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Tip Found",
                data: [],
            });
        }

        
        if (!allTips) {
          return next(new ErrorResponse("Tips Getting Failed", 400));
        }

        return res.status(200).json({
          success: true,
          message: "Successfully Get Tips",
          data: allTips.length > 0 ? allTips[0] : {},
        });
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}

exports.deleteTipIcon = async (req, res, next) => {
    try {
    
        const deletedTip = await UsefulTipsIcon.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        
        if (deletedTip?.deletedCount === 1) {
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
      catch (err) {
          return next(new ErrorResponse(err, 400))
      }
}

exports.addTips = async (req, res, next) => {
    try {
        console.log('got here success fully')
        const body = JSON.parse(req.query.values)
        console.log(body)

        if (!req.files) {
            return res.status(200).json({
                success: false,
                data: null,
                message: 'Upload File'
            })
        }

        let FileUploaded;
        let document = {};
        // console.log(req.files?.files, 'req.files?.files')
        console.log(req.files, 'files')
        if (req.files?.files) { 
            FileUploaded = await uploadFile(req.files?.files, next)
            document = {
                path: FileUploaded.photoPath,
                name: req.files.files.name,
                size: req.files.files.size
            }
        } else if(req.files?.video){
            FileUploaded = await uploadVideo(req.files.video, next)
        } else {
            FileUploaded = await uploadImage(req.files.image, next)
        }

        console.log(document)

        const tips = new usefulTips({
            tips : body.tips,
            document: document,
            video: req.files?.video ? FileUploaded.videoPath : '',
            image: req.files?.image ? FileUploaded.photoPath : '',
        })
        const addedTips = await tips.save();
        console.log(addedTips)

        if (!addedTips) {
            return next(new ErrorResponse('add Tips failed', 400))
        }
        return res.status(200).json({
            success: true,
            data: addedTips
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
} 

exports.getAllTips = async (req, res, next) => {
    try {
        const allTips = await usefulTips.find({})
    
        if (allTips.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Tip Found",
                data: [],
            });
        }

        
        if (!allTips) {
          return next(new ErrorResponse("Tips Getting Failed", 400));
        }

        return res.status(200).json({
          success: true,
          message: "Successfully Get Tips",
          data: allTips,
        });
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}


exports.deleteTip = async (req, res, next) => {
    try {
    
        const deletedTip = await usefulTips.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        
        if (deletedTip?.deletedCount === 1) {
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
      catch (err) {
          return next(new ErrorResponse(err, 400))
      }
}