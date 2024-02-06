const ErrorResponse = require("../utils/errorResponse");
const Cart = require("../models/Cart");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.addToCart = async (req, res, next) => {
    console.log(req.body, "order fcm")

    try {
        let obj;
        if (req.body?.extras) {
            if (req.body.extras?.length != 0) {
                // it means user just order extra
                obj = {
                    productId: req.body.productId,
                    quantity: 0,
                    extras: req.body.extras ? req.body.extras : []
                }
            } else {
                // it means actual product
                obj = {
                    productId: req.body.productId,
                    quantity: 1,
                    extras: req.body.extras ? req.body.extras : []
                }
            }
        } else {
            // it means actual product
            obj = {
                productId: req.body.productId,
                quantity: 1,
                extras: req.body.extras ? req.body.extras : []
            }
        }


        const userCart = await Cart.findOne({ userId: req.user.data[1] })
        if (userCart) {
            if (userCart.details.length == 0) {
                userCart.details.push(obj)
            } else {
                let match = '';
                let index = 0;

                for (let i = 0; i < userCart.details.length; i++) {
                    if (userCart.details[i].productId == req.body.productId) {
                        match = 'same'
                        index = i
                        break
                    } else {
                        match = 'diff'
                    }
                }
                if (match == 'same') {
                    if (obj.extras.length != 0) {
                        let matchExtraIndex = 0;
                        let matchExtra = ''
                        if (userCart.details[index]?.extras?.length != 0) {
                            for (let i = 0; i < userCart.details[index]?.extras.length; i++) {
                                //  EXTRA PRODUCT MATCH'S WITH EXTRES WHICH IS IN CART
                                // break;
                                if (userCart.details[index]?.extras[i]?.productName == req.body.extras[0].productName) {
                                    matchExtraIndex = i;
                                    matchExtra = 'match'
                                    break;
                                }
                            }
                            if (matchExtra != '') { // IT MEANS EXTRA MATCHS AT INDEX 'i' AND i MAY BE 0 OR SOMETHING ELSE
                                console.log(matchExtraIndex)
                                let preQty = userCart.details[index]?.extras[matchExtraIndex]?.quantity;
                                preQty += 1
                                let obj = {
                                    productName: userCart.details[index]?.extras[matchExtraIndex]?.productName,
                                    cost: userCart.details[index]?.extras[matchExtraIndex]?.cost,
                                    quantity: preQty
                                }
                                userCart.details[index]?.extras.splice(matchExtraIndex, 1);
                                userCart.details[index]?.extras.splice(matchExtraIndex, 0, obj);
                            } else {
                                userCart.details[index]?.extras?.push(req.body.extras ? req.body.extras[0] : [])
                            }
                        } else {
                            userCart.details[index]?.extras?.push(req.body.extras ? req.body.extras[0] : [])
                        }

                    } else {
                        let count = userCart.details[index].quantity
                        count += 1;
                        userCart.details[index].quantity = count
                    }
                } else {
                    userCart.details.push(obj)
                }

            }
            const result = await userCart.save();
            return res.status(200).json({
                success: true,
                message: "added to cart Successfully",
                data: result,
            });
        } else {
            const cart = new Cart({
                userId: req.user.data[1],
                details: obj,
            });
            const result = await cart.save();
            return res.status(200).json({
                success: true,
                message: "added to cart Successfully",
                data: result,
            });
        }
    }
    catch (err) {
        return next(new ErrorResponse(err, 400));
    }
}

exports.decreaseCartQuantity = async (req, res, next) => {
    console.log(req.body, "order fcm")

    try {

        const userCart = await Cart.findOne({ userId: req.user.data[1] })
        console.log(userCart)
        if (userCart) {
            let index = 0;
            let quantity = 0;

            for (let i = 0; i < userCart.details.length; i++) {
                console.log(userCart.details[i].productId)
                if (userCart.details[i].productId == req.body.productId) {
                    index = i
                    quantity = userCart.details[i].quantity
                    break
                }
            }
            console.log(" at Index " + index)

            if (quantity == 1) {
                let count = userCart.details[index].quantity
                count = count - 1;
                userCart.details[index].quantity = count
                // CHECK IF THE QUANTITY AND EXTRAS IS "0" THEN EMPTY THE "DETAILS" LIST
                if (userCart.details[index].quantity == 0 && userCart.details[index]?.extras?.length == 0) {
                    const indexOfObject = userCart.details.findIndex(object => {
                        return object.quantity == 0;
                    });
                    userCart.details.splice(indexOfObject, 1);
                }
            } else if (quantity != 0) {
                let count = userCart.details[index].quantity
                count = count - 1;
                userCart.details[index].quantity = count
            }


            const result = await userCart.save();
            return res.status(200).json({
                success: true,
                message: "added to cart Successfully",
                data: result,
            });
        } else {
            const cart = new Cart({
                userId: req.user.data[1],
                details: obj,
            });
            const result = await cart.save();
            return res.status(200).json({
                success: true,
                message: "added to cart Successfully",
                data: result,
            });
        }
    }
    catch (err) {
        return next(new ErrorResponse(err, 400));
    }
}

exports.decreaseExtrasQuantity = async (req, res, next) => {
    console.log(req.body, "Decrease Extras fcm")

    try {
        let obj = {
            productId: req.body.productId,
            extras: req.body.extras ? req.body.extras : []
        }

        const userCart = await Cart.findOne({ userId: req.user.data[1] })

        if (userCart) {

            let match = '';
            let index = 0;

            for (let i = 0; i < userCart.details.length; i++) {
                if (userCart.details[i].productId == req.body.productId) {
                    match = 'same'
                    index = i
                    break
                } else {
                    match = 'diff'
                }
            }
            if (match == 'same') {
                if (obj.extras?.length != 0) {
                    let matchExtraIndex = 0;
                    let matchExtra = ''
                    for (let i = 0; i < userCart.details[index]?.extras?.length; i++) {
                        //  EXTRA PRODUCT MATCH'S WITH EXTRES WHICH IS IN CART
                        if (userCart.details[index]?.extras[i]?.productName == req.body.extras[0]?.productName) {
                            console.log('Same Extra Product')
                            matchExtraIndex = i;
                            matchExtra = 'match'
                            break;
                        }
                    }
                    if (matchExtra != '') { // IT MEANS EXTRA MATCHS AT INDEX 'i' AND i MAY BE 0 OR SOMETHING ELSE
                        let preQty = userCart.details[index]?.extras[matchExtraIndex]?.quantity;
                        // IF MATCHES THE CHECK ITS QUANTITY IF IT IS NOT ZEZO THEN DECREASE ITS QUANTITY AND IF ITS ZERO THEN REMOVE IT FROM CART
                        if ((preQty - 1) != 0) {
                            preQty = preQty - 1
                            let obj = {
                                productName: userCart.details[index]?.extras[matchExtraIndex]?.productName,
                                cost: userCart.details[index]?.extras[matchExtraIndex]?.cost,
                                quantity: preQty
                            }
                            userCart.details[index]?.extras.splice(matchExtraIndex, 1);
                            userCart.details[index]?.extras.splice(matchExtraIndex, 0, obj);

                        } else {
                            userCart.details[index]?.extras.splice(matchExtraIndex, 1);
                            // CHECK IF THE QUANTITY AND EXTRAS IS "0" THEN EMPTY THE "DETAILS" LIST
                            if (userCart.details[index]?.quantity == 0 && userCart.details[index]?.extras?.length == 0) {
                                console.log('Delete Here')
                                const indexOfObject = userCart.details.findIndex(object => {
                                    return object.quantity == 0;
                                });
                                userCart.details.splice(indexOfObject, 1);
                            }
                        }
                    }
                }
            }


            const result = await userCart.save();
            return res.status(200).json({
                success: true,
                message: "Decrease Extra from cart Successfully",
                data: result,
            });

        } else {

            return res.status(200).json({
                success: true,
                message: "Cart Does not Exist",
                data: [],
            });

        }
    } catch {

    }

}


exports.getCart = async (req, res, next) => {
    console.log(req.user, 'User Data')

    try {
        const cart = await Cart.findOne({ userId: req.user.data[1] }).populate('userId').populate({
            path: 'details',
            populate: {
                path: 'productId',
                model: 'Product',
            }
        })

        cart.totalProducts = cart.details.length;

        cart.details.forEach((product, index) => {
            console.log(product, 'product')

            if (product.extras.length == 0) {
                product.productTotal = product.productId.price * product.quantity;
            } else if (product.quantity == 0) {
                let tot = 0;
                product.extras?.forEach((extra, index) => {
                    let exTotal = parseInt(extra.cost) * extra.quantity
                    tot += exTotal;
                })
                product.productTotal = tot;
            } else {
                let tot = 0;
                product.extras?.forEach((extra, index) => {
                    let exTotal = parseInt(extra.cost) * extra.quantity
                    tot += exTotal;
                })
                console.log(tot)
                let proTotal = product.productId.price * product.quantity
                product.productTotal = (tot + proTotal);
            }

            cart.subTotal += product.productTotal;

        })

        cart.totalPrice += cart.subTotal + cart.deliveryFee;

        return res.status(200).json({
            success: true,
            message: "Gotten cart Successfully",
            data: cart,
        });
    }
    catch (err) {
        return next(new ErrorResponse(err, 400));
    }
}
exports.getCartLength = async (req, res, next) => {
    console.log(req.user, 'User Data')

    try {
        const cart = await Cart.findOne({ userId: req.user.data[1] }).populate('userId').populate({
            path: 'details',
            populate: {
                path: 'productId',
                model: 'Product',
            }
        })

        const totalProducts = cart.details.length;

        return res.status(200).json({
            success: true,
            message: "Gotten cart Successfully",
            data: totalProducts,
        });
    }
    catch (err) {
        return next(new ErrorResponse(err, 400));
    }
}
exports.deleteCart = async (req, res, next) => {
    console.log(req.user, 'User Data')
    try {
        await Cart.findOneAndDelete({ userId: req.user.data[1] }, (err, success) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    success: false,
                    message: "Something Went Wrong",
                    data: [],
                });
            } else {
                console.log(success)
                return res.status(200).json({
                    success: true,
                    message: "Cart Empty",
                    data: [],
                });
            }
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400));
    }
}