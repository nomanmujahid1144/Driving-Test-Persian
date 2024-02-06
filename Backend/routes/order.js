const express = require('express');
const mongoose = require("mongoose");
const Order = require('../models/Order');
const router = express.Router();
const {
    placeOrder,
    getAllOrdersById,
    getAllOrdersByPosition,
    getAllOrders,
    updateOrderStatus,
    getOrderByDriverId,
    getOrderById,
    declineOrder,
    placeManualOrder,
    getAllOrdersByDriverId,
    getNewOrders,
    getAllOrdersAdmin,
    updateOrderStatusAdmin,
    updateManualOrderStatusAdmin,
    getOrderByOrderId
} = require('../controllers/order.controllers')
const {
    addToCart,
    decreaseExtrasQuantity,
    decreaseCartQuantity,
    getCart,
    getCartLength,
    deleteCart

} = require('../controllers/cart.controllers')
const checkAuth = require('../middleware/check-auth')

router.post('/placeorder', checkAuth, placeOrder)

router.post('/placemanualorder', placeManualOrder)

router.get('/getallordersbyid', checkAuth, getAllOrdersById)
router.get('/getOrderById', getOrderById)
router.get('/getallordersbyposition', getAllOrdersByPosition)
router.get('/getallordersadmin', checkAuth, getAllOrdersAdmin)
router.get('/getallorders', getAllOrders)
router.get('/getneworders', getNewOrders)

router.patch('/updateorderstatus', updateOrderStatus)
router.patch('/updateorderstatusadmin', updateOrderStatusAdmin)
router.patch('/updatemanualorderstatusadmin', updateManualOrderStatusAdmin)
router.delete('/declineorder', declineOrder)
router.get('/getorderbydriverid', getOrderByDriverId)
router.get('/getallordersbydriverid', getAllOrdersByDriverId)
router.get('/getorderbyorderid', getOrderByOrderId)

router.post('/addtocart', checkAuth, addToCart)
router.post('/decreasecartquantity', checkAuth, decreaseCartQuantity)
router.post('/decreaseextrasquantity', checkAuth, decreaseExtrasQuantity)
router.get('/getcart', checkAuth, getCart)
router.get('/getcartlength', checkAuth, getCartLength)
router.delete('/deletecart', checkAuth, deleteCart)


function pagenatedResults(model) {

    return async (req, res, next) => {

        console.log(req.user.data[1], " User Here")
        console.log(req.query)
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        console.log(page, limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        console.log(startIndex)
        console.log(endIndex)

        const result = {}



        totalproducts = await model.find({ userId: mongoose.Types.ObjectId(req.user.data[1]) });
        console.log(totalproducts.length)

        result.products = await model.find({ userId: mongoose.Types.ObjectId(req.user.data[1]) })
            .populate("userId")
            .populate("details.productId")
            .sort({ createdAt: -1 })
            .limit(limit).skip(startIndex).exec()

        if (endIndex < totalproducts.length) {
            result.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            result.prev = {
                page: page - 1,
                limit: limit
            }
        }


        result.totalProducts = totalproducts.length;
        result.startProductIndex = startIndex;
        result.endProductIndex = endIndex;

        console.log(result.products.length, 'Result')
        res.pagenatedResults = result;
        next()
    }
}

module.exports = router;