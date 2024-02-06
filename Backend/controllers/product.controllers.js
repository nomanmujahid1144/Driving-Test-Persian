const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/Product');
const Product = require('../models/Product');
const { uploadImage } = require('../helpers/helpers');
const multer = require("multer");
const path            = require('path');
const fs            = require('fs');
const sharp            = require('sharp');
const mongoose = require('mongoose');


// exports.addProduct =  async (req, res , next) => {

//     try{
// 	    console.log(req.body  +  " Body Data");
//         console.log(req.file );
//       if (!req.file) {
//                   return res.status(200).json({
//                       success: false,
//                       data: null,
//                       message: 'Upload Image'
//                   })
//       }
    //   else {
    //     // console.log(req.files.productPhoto[0])
    //     console.log(req.file.filename)
    //     const { filename : filename } = req.file.filename;
    //     console.log(filename)
    //     await sharp(req.file.path)
    //       .resize(300, 300)
    //       .jpeg({ quality: 90 })
    //       .toFile(path.resolve(req.file.destination, "resized", filename));
    //     fs.unlinkSync(req.file.path);
    //   };
  
      // const body = req.body
    //   const product = new Product({
    //     name: req.body.name,
    //     type: req.body.type,
    //     category: req.body.category,
    //     description: req.body.description,
    //     subCategory: req.body.subCategory,
    //     brand: req.body.brand,
    //     price: req.body.price,
    //     effects: req.body.effects,
    //     productPhoto: req.file.filename
    // })
    // const addedProduct = await product.save()
    //     addedProduct.productPhoto = req.files.productPhoto.filename;
    //     console.log(addedProduct)
    //     if (!addedProduct) {
    //         return next(new ErrorResponse('add product failed', 400))
    //     }
    //     return res.status(200).json({
    //         success: true,
    //         data: addedProduct
    //     })
    // }catch (err){
    //   return next(new ErrorResponse(err, 400))
    // }
    // }


exports.addProduct = async (req, res, next) => {
    try {
        console.log('got here success fully')
        const body = JSON.parse(req.query.values)
        console.log(body)
        const count = JSON.parse(req.query.count)
        console.log(count , 'count here iskdjasnkdjsnadkjnsdkjasndjsan')
        let extras = [];

        if(body.productName_1 && body.cost_1 !== ''){
            for(let i = 1 ; i <= count ; i++ ){
                let storedString = JSON.parse(`{
                            "extras${i}" : {
                                "productName" : "${eval(`body.productName_${i.toString()}`) ? eval(`body.productName_${i.toString()}`) : '' }",
                                "cost" : "${eval(`body.cost_${i.toString()}`) ? eval(`body.cost_${i.toString()}`) : ''}"
                            }
                        }`)
                    console.log(storedString , 'storedString')
                extras.push(storedString);
            }
        }
        

        
        if (!req.files) {
            return res.status(200).json({
                success: false,
                data: null,
                message: 'Upload Image'
            })
        }
        const uploadedPath = await uploadImage(req.files.image, next)
        console.log(uploadedPath, 'path')
        const product = new Product({
            name: body.name,
            shopid: body.shopid,
            type: body.type,
            category: body.category,
            description: body.description,
            subCategory: body.subCategory,
            featureProduct: body.featureProduct,
            brand: body.brand,
            price: body.price,
            effects: body.effects,
            extras : extras,
            productPhoto: uploadedPath.photoPath
        })
        const addedProduct = await product.save()
        console.log(addedProduct)
        if (!addedProduct) {
            return next(new ErrorResponse('add product failed', 400))
        }
        return res.status(200).json({
            success: true,
            data: addedProduct
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
} 
exports.updateProduct = async (req, res, next) => {
    try {
        let body = JSON.parse(req.query.values)
        console.log(body , 'body')
        const count = JSON.parse(req.query.count)
        console.log(count , 'count here iskdjasnkdjsnadkjnsdkjasndjsan')
        let extras = [];

        const id = req.query.id
        if (req.files) {
            const toBeUpdated = await Product.findOne({ _id: mongoose.Types.ObjectId(id) }).select('productPhoto')
            fs.unlink(`${process.env.FILE_DELETE_PATH}${toBeUpdated.productPhoto}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });
            const uploadedPath = await uploadImage(req.files.image, next)
            body.productPhoto = uploadedPath.photoPath
        }

        if(body.productName_1 && body.cost_1 !== ''){
            for(let i = 1 ; i <= count ; i++ ){
                let storedString = JSON.parse(`{
                            "extras${i}" : {
                                "productName" : "${eval(`body.productName_${i.toString()}`) ? eval(`body.productName_${i.toString()}`) : '' }",
                                "cost" : "${eval(`body.cost_${i.toString()}`) ? eval(`body.cost_${i.toString()}`) : ''}"
                            }
                        }`)
                extras.push(storedString);
            }
            body.extras = extras
        }


        const updatedProduct = await Product.updateOne({ _id: mongoose.Types.ObjectId(id) }, body)
        if (updatedProduct.nModified !== 1) {
            return res.status(200).json({
                data: null,
                message: 'update failed',
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            data: null,
            message: 'Product Updated Successfully'
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}


exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({})
        console.log(products)
        if (products.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No products found'
            })
        }
        return res.status(200).json({
            success: true,
            data: products,
            message: "Products found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}
exports.getFeatureProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ featureProduct : true})
        console.log(products)
        if (products.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No products found'
            })
        }
        return res.status(200).json({
            success: true,
            data: products,
            message: "Products found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}
exports.getdiscountproducts = async (req, res, next) => {
    try {
        const products = await Product.find({ price: { $lt: 40 } })
        console.log(products)
        if (products.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No products found'
            })
        }
        return res.status(200).json({
            success: true,
            data: products,
            message: "Products found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}
exports.getdiscountproducts = async (req, res, next) => {
    try {
        const products = await Product.find({ price: { $lt: 40 } })
        console.log(products)
        if (products.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No products found'
            })
        }
        return res.status(200).json({
            success: true,
            data: products,
            message: "Products found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}
exports.getProductByBrand = async (req, res, next) => {
    console.log(req.query , "Brand")
    try {
        const products = await Product.find({'brand' :  req.query.brand})
        console.log(products)
        if (products.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No products found'
            })
        }
        return res.status(200).json({
            success: true,
            data: products,
            message: "Products found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}
exports.getProductByBrandWithCategory = async (req, res, next) => {
    console.log(req.query.brand , "Brand")
    console.log(req.query.category , "category")
    console.log(req.query.subCategory , "category")
    console.log(req.query.type , "category")
    
    let obj = {} ; 
    let inner = [{ brand: req.query.brand }];
    if(req.query.category != ''){
        inner.push({category: req.query.category})
    }
    if(req.query.subCategory != ''){
        inner.push({subCategory: req.query.subCategory})
    }
    if(req.query.type != ''){
        inner.push({type: req.query.type})
    }
    obj = { $and : inner}
    try {
        const products = await Product.find(obj)
        console.log(products)
        if (products.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No products found'
            })
        }
        return res.status(200).json({
            success: true,
            data: products,
            message: "Products found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}

exports.getAllProductsClientSide = async (req, res, next) => {
    try {
        const products = await Product.find({})
        if (products.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No products found'
            })
        }
        let resArray = []
        products.forEach(element => {
            let newObj = {
                category: element.category,
                item: element
            }
            resArray.push(newObj)
        });
        return res.status(200).json({
            success: true,
            data: resArray,
            message: "Products found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}

exports.deleteProducts = async (req, res, next) => {
    try {
        console.log(req.query.IDS)
        let deletedCount = 0
        Promise.all(req.query.IDS.map(async (element) => {
            const photoPath = await Product.findOne({ _id: mongoose.Types.ObjectId(element) }).select('productPhoto')
            fs.unlink(`${process.env.FILE_DELETE_PATH}${photoPath.productPhoto}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });
            const deletedProducts = await Product.deleteOne({ _id: mongoose.Types.ObjectId(element) })
            console.log(deletedProducts)
            if (deletedProducts.n >= 1) {
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


exports.addToFavourite = async (req, res, next) => {
    try {
        const body = req.body.favoutite

        const favourites = {
            favourite : body
        }
        const id = req.body.id

        const updatedProduct = await Product.updateOne({ _id: mongoose.Types.ObjectId(id) }, favourites)
        if (updatedProduct.nModified !== 1) {
            return res.status(200).json({
                data: null,
                message: 'update failed',
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            data: null,
            message: 'Product Updated Successfully'
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}

exports.getAllFavourites = async (req, res, next) => {
    try {
        const products = await Product.find({'favourite' : true})
        console.log(products)
        if (products.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No Favourite product found'
            })
        }
        return res.status(200).json({
            success: true,
            data: products,
            message: "All Favourite Products found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}