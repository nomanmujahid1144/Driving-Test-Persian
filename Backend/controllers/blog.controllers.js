const ErrorResponse = require('../utils/errorResponse');
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const { uploadImage } = require('../helpers/helpers');



exports.AddBlog = async (req, res, next) => {
  try {

    let body = req.body;
    console.log(body, 'body')
    console.log(req.files, 'files')

    if (!req.files) {
      return res.status(200).json({
          success: false,
          data: null,
          message: 'Upload Image'
      })
  }
  const uploadedPath = await uploadImage(req.files.blogImage, next)
    console.log(uploadedPath, 'path')
    body.blogImage = uploadedPath.photoPath
    
  const product = new Blog({
    data: body.data,
    blogHeading: body.blogHeading,
    blogImage: body.blogImage,
    
  })
  
  const addedProduct = await product.save()
    
  if (!addedProduct) {
      return next(new ErrorResponse('add product failed', 400))
  }
  return res.status(200).json({
      success: true,
      data: addedProduct
  })

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.GetBlog = async (req, res, next) => {

  try {
    const allblogs = await Blog.find({})

    if (!allblogs) {
      return next(new ErrorResponse("Blogs Getting Failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Get Blogs",
      data: allblogs,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.GetBlogById = async (req, res, next) => {

  try {
    const singleblog = await Blog.findById({_id : mongoose.Types.ObjectId(req.query.id)})

    if (!singleblog) {
      return next(new ErrorResponse("Blogs Getting Failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Get Blog",
      data: singleblog,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.AddBlogImage = async (req, res, next) => {
  try {
    console.log(req.files, 'Files Image')

    if (!req.files) {
      return res.status(200).json({
          success: false,
          data: null,
          message: 'Upload Image'
      })
  }
  const uploadedPath = await uploadImage(req.files.image, next)
    console.log(process.env.LIVE_SERVER_URL + uploadedPath , 'path')

    const path = process.env.LIVE_SERVER_URL + uploadedPath?.photoPath;
  return res.status(200).json({
      success: true,
      url: path,
      message : 'Successfully Uploaded Image'
  })

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};


exports.deleteBlog = async (req, res, next) => {
  try {
    
    const deletedProducts = await Blog.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) })
    
    if (deletedProducts?.deletedCount === 1) {
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


exports.updateBlog = async (req, res, next) => {
  try {

    let body = req.body;
    const id = req.query.id
    console.log(id, 'body')
    console.log(body, 'body')
    console.log(req.files, 'files')
    
    if (req.files) {
      const uploadedPath = await uploadImage(req.files.blogImage, next)
      console.log(uploadedPath, 'path')
      body.blogImage = uploadedPath.photoPath
    }
    
    
    
    const updatedBlog = await Blog.updateOne({ _id: mongoose.Types.ObjectId(id) }, body)
    if (updatedBlog.nModified !== 1) {
        return res.status(200).json({
            data: null,
            message: 'update failed',
            success: false
        })
    }

    return res.status(200).json({
        success: true,
        data: null,
        message: 'Blog Updated Successfully'
    })

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
}