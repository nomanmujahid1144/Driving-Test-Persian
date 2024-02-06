const fs = require("fs");
const ErrorResponse = require("../utils/errorResponse");

exports.uploadImage = async (image, next) => {
  console.log("i was called");
  return new Promise((resolve, reject) => {
    if (!image.mimetype.startsWith("image") && !image.mimetype.startsWith("application")) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    const path = `${process.env.FILE_UPLOAD_PATH}/${Math.floor(
      Math.random() * 100000 + 1
    )}.${image.name.replace(/\s/g, "")}`;
    image.mv(path, (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 400)); // next func error response
      }
      resolve({
        photoPath: path.slice(8),
      });
    });
  });
}

exports.uploadVideo = async (video, next) => {
  console.log("I was called");
  return new Promise((resolve, reject) => {
    if (!video.mimetype.startsWith("video")) {
      return next(new ErrorResponse("Please upload a video file", 400));
    }

    const path = `${process.env.FILE_UPLOAD_PATH}/${Math.floor(Math.random() * 100000 + 1)}.${video.name.replace(/\s/g, "")}`;
    video.mv(path, (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse("Problem with video upload", 400));
      }
      resolve({
        videoPath: path.slice(8),
      });
    });
  });
};


exports.uploadFile = async (file, next) => {
  return new Promise((resolve, reject) => {

    console.log('File:', file);
    console.log('File Mimetype:', file.mimetype);

    if (!file.mimetype.startsWith("application") && !file.mimetype.startsWith("pdf")  && !file.mimetype.startsWith("text") ) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const path = `${process.env.FILES_UPLOAD_PATH}/${Math.floor(
      Math.random() * 100000 + 1
    )}.${file.name.replace(/\s/g, "")}`;
    file.mv(path, (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 400)); // next func error response
      }
      resolve({
        photoPath: path.slice(8),
      });
    });
  });
}

