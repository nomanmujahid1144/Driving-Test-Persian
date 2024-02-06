const ErrorResponse = require('../utils/errorResponse');
const Video = require('../models/Video');
const { uploadImage, uploadVideo, uploadFile } = require('../helpers/helpers');
const multer = require("multer");
const path            = require('path');
const fs            = require('fs');
const sharp            = require('sharp');
const mongoose = require('mongoose');

exports.addVideo = async (req, res, next) => {
    try {
        console.log('got here success fully')
        const body = JSON.parse(req.query.values)
        console.log(body)
        console.log(req.files)

        if (!req.files) {
            return res.status(200).json({
                success: false,
                data: null,
                message: 'Upload Video'
            })
        }
        let FileUploaded;
        let document = {};
        if (req.files?.files) { 
            FileUploaded = await uploadFile(req.files?.files , next)
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


        const video = new Video({
            document: document,
            video: req.files?.video ? FileUploaded.videoPath : '',
            image: req.files?.image ? FileUploaded.photoPath : '',
            title: body.title
        })
        const addedVideo = await video.save();

        if (!addedVideo) {
            return next(new ErrorResponse('add Video failed', 400))
        }
        return res.status(200).json({
            success: true,
            data: addedVideo
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
} 


exports.getAllVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({})
        console.log(videos)
        if (videos.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No video found'
            })
        }
        return res.status(200).json({
            success: true,
            data: videos,
            message: "videos found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}


exports.deleteVideo = async (req, res, next) => {
    try {
    
        const deletedVideo = await Video.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        
        if (deletedVideo?.deletedCount === 1) {
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
