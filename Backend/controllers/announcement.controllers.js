const ErrorResponse = require('../utils/errorResponse');
const AboutUs = require('../models/Announcement');
const mongoose = require('mongoose');



exports.AddAnnouncement = async (req, res, next) => {
    try {

        let body = req.body;
        console.log(body, 'body')

        const findAboutUs = await AboutUs.find({})

        let aboutUs;

        if (findAboutUs.length != 0) {
            aboutUs = await AboutUs.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(findAboutUs[0]._id) }, body)
        } else {
            const about = new AboutUs({
                announcement: body.announcement,
                announcementList: body.announcementList
            });

            aboutUs = about.save();
        }

        if (!aboutUs) {
            return next(new ErrorResponse("add About Us failed", 400));
        }
        return res.status(200).json({
            success: true,
            message: "Successfully Added Announcement Message",
            data: aboutUs,
        });

    } catch (err) {
        return next(new ErrorResponse(err, 400));
    }
};

exports.GetAnnouncement = async (req, res, next) => {

    try {
        const aboutus = await AboutUs.find({})

        if (!aboutus) {
            return next(new ErrorResponse("About Us Getting Failed", 400));
        }
        return res.status(200).json({
            success: true,
            message: "Successfully Get Announcement Message",
            data: aboutus,
        });
    } catch (err) {
        return next(new ErrorResponse(err, 400));
    }
};
