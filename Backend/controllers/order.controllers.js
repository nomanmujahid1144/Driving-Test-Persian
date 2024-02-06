const ErrorResponse = require("../utils/errorResponse");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Order");
const Radius = require("../models/Radius");
const Tax = require("../models/Tax");
const DeliveryPerson = require("../models/DeliveryPerson");
const dateTime = require('node-datetime');
const mongoose = require("mongoose");
const { sendFMCNotification } = require("../utils/notifications");
let date = new Date().toISOString().slice(0, 10)
let dt = dateTime.create();
let time = dt.format('H:M:S');

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

exports.placeOrder = async (req, res, next) => {
  console.log(req.body, "order Body")

  try {

    const adminRadius = await Radius.find({});

    console.log(adminRadius , 'adminRadius')
    //make order object
    const order = new Order({
      userId: req.user.data[1],
      orderid: new Date().getTime().toString(),
      details: req.body.details,
      "geometry.coordinates": req.body.geometry,
      totalProducts: req.body.totalProducts,
      restaurantID: adminRadius[0]?._id,
      subTotal: req.body.subTotal,
      deliveryType: req.body.deliveryType,
      paymentMethod: req.body.paymentMethod,
      deliveryFee: req.body.deliveryFee,
      totalPrice: req.body.totalPrice,
      address: req.body.formattedAddress,
      postalCode: req.body.postalCode,
      date: date,
      time: time
    });
    //calculating Final total

    //saving order in db
    const result = await order.save().then(order => order.populate("userId", { password: 0, __v: 0, }).populate("details.productId").execPopulate());

    if (!result) {
      return next(new ErrorResponse("Error Placing order", 200));
    }


    let source = `<!DOCTYPE html>
    <html>
    <head>
      <title>Order Details</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        table {
          font-family: Arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 20px;
        }
        #customers th { 
          padding-top: 12px;
          padding-bottom: 12px;
          text-align: left;
          background-color: #E9C95D;
          color: white;
          } 
        td, th {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        h2 {
          margin-bottom: 20px;
        }

        p {
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <h2>Order Details</h2>
      <p>Dear Customer  <strong>  ${result?.userId.fullName}   </strong> Your order has been placed on Order No# <strong>  ${order.orderid}   </strong></p> 
      <p>Order Date: ${result.date} at ${result.time}</p>
      <table id='customers'>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>`;
    order.details?.forEach(function (Item) {
      source +=
        `<tr>
                          <td>  ${Item?.productId?.name}  </td>
                          <td>  $${Item?.productId?.price}  </td>
                          <td>  ${Item?.quantity} </td>
                          <td>  $${Item?.productTotal} </td>
                      </tr>`
    })
    source += `
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Subtotal</td>
            <td>$${result.subTotal}</td>
          </tr>
          <tr>
            <td colspan="3">Shipping</td>
            <td>$${result.deliveryFee}</td>
          </tr>
          <tr>
            <td colspan="3">Total</td>
            <td>$${result.totalPrice}</td>
          </tr>
        </tfoot>
      </table>
      <p>Shipping Address: ${result.address}</p>
    </body>
    </html>
    `

    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID, // ClientID
      process.env.CLIENT_SECRET, // Client Secret
      process.env.REDIRECT_URL // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });
    const accessToken = oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    // send mail with defined transport object
    const mailOptions = {
      from: `"${process.env.SENDER_NAME}" <${process.env.EMAIL}>`, // sender address
      to: req.user.data[0], // list of receivers
      subject: 'Order Summary', // Subject line
      html: source, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail sent : %s", info.response);
      }
    });

    const socket = req.app.get('io');
    socket.emit('newOrder', { newOrder: result })


    return res.status(200).json({
      success: true,
      message: "Order Placed Successfully",
      data: null,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllOrdersById = async (req, res, next) => {
  try {
    const result = await Order.find({
      userId: mongoose.Types.ObjectId(req.user.data[1]),
    })
      .populate("userId", { password: 0, __v: 0, })
      .populate("details.productId")
      .sort({ createdAt: -1 });
    if (result.length < 1) {
      return next(new ErrorResponse("No Orders Found", 404));
    }
    console.log(result, "order found");
    return res.status(200).json({
      success: true,
      message: "Orders",
      data: result,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.getOrderById = async (req, res, next) => {
  console.log(req.query.showDetails)
  try {
    const result = await Order.find({
      _id: mongoose.Types.ObjectId(req.query.showDetails),
    })
      .populate("userId", { password: 0, __v: 0, createdAt: 0, updatedAt: 0 })
      .populate("restaurantID", { products: 0, __v: 0, createdAt: 0, updatedAt: 0 })
      .populate("details.productId");
    if (result.length < 1) {
      return next(new ErrorResponse("No Orders Found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Orders",
      data: result[0],
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.getOrderByOrderId = async (req, res, next) => {
  try {
    const result = await Order.find({
      _id: mongoose.Types.ObjectId(req.query.orderId),
    })
      .populate("userId", { password: 0, __v: 0, })
      .populate("details.productId")

      .sort({ createdAt: -1 });
    if (result.length < 1) {
      return next(new ErrorResponse("No Orders Found", 404));
    }
    console.log(result, "order found");
    return res.status(200).json({
      success: true,
      message: "Order",
      data: result,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllOrdersByPosition = async (req, res, next) => {
  try {
    const result = await Order.find({
      "geometry.coordinates": {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
          },
          $maxDistance: 9000,
        },
      },
    });

    if (result.length < 1) {
      return next(new ErrorResponse("No Orders Found", 404));
    }
    console.log(result, "order found");
    return res.status(200).json({
      success: true,
      message: "Orders",
      data: result,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const result = await Order.find({})
      .populate("details.productId")
      .sort({ createdAt: -1 });
    if (result.length < 1) {
      return next(new ErrorResponse("No Orders Found", 404));
    }
    console.log(result, "order found");
    return res.status(200).json({
      success: true,
      message: "Orders",
      data: result,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getNewOrders = async (req, res, next) => {
  try {
    const result = await Order.find({ status: 0 })
      .populate("details.productId")
      .populate('userId')
      .sort({ createdAt: -1 });
    if (result.length < 1) {
      return next(new ErrorResponse("No Orders Found", 404));
    }
    console.log(result, "order found");
    return res.status(200).json({
      success: true,
      message: "Orders",
      data: result,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllOrdersByPosition = async (req, res, next) => {
  try {
    const result = await Order.find({
      "geometry.coordinates": {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
          },
          $maxDistance: 9000,
        },
      },
    });

    if (result.length < 1) {
      return next(new ErrorResponse("No Orders Found", 404));
    }
    console.log(result, "order found");
    return res.status(200).json({
      success: true,
      message: "Orders",
      data: result,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    console.log(req.body, " :order status")
    const orderUpdate = await Order.findByIdAndUpdate(
      mongoose.Types.ObjectId(req.body.orderId),
      { status: req.body.status, driverId: req.body.driverId },
      { new: true }
    );
    console.log(orderUpdate)
    // const eventEmitter = req.app.get('eventEmitter')
    // eventEmitter.emit('orderUpdated')
    // if (orderUpdate) {
    //   let selectedOrder = orderUpdate.details.map(async (item, index) => {
    //     let total = await Product.findOne({ _id: item.productId });
    //     total.numberOfItems = item.quantity;
    //     return total;
    //   });
    //   console.log("selected order :", selectedOrder);

    const restaurant = await Radius.findOne({ _id: orderUpdate.restaurantID._id })
    restaurant.totalEarning += orderUpdate.totalPrice;
    restaurant.save();


    return res.status(200).json({
      success: true,
      message: "Order Updated",
      data: orderUpdate,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.placeManualOrder = async (req, res, next) => {
  try {
    console.log(req.body, " :order status")
    const orderUpdate = await Order.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.orderId),
      { driverId: req.body.driverId, pickUpStatus: 1 }, { new: true })
      .populate("userId", { password: 0, __v: 0, createdAt: 0, updatedAt: 0 })
      .populate("restaurantID", { products: 0, __v: 0, createdAt: 0, updatedAt: 0 })
      .populate("details.productId");

    console.log(orderUpdate + "Order Accepted By Driver")
    const driver = await DeliveryPerson.findOne({ _id: orderUpdate.driverId })
    driver.booked = 1;
    driver.save()

    const socket = req.app.get('io');
    // socket.emit('deliveryReq' , {driverId :  driver._id , orderUpdate : orderUpdate })
    socket.emit('deliveryReq', { orderUpdate: orderUpdate })

    return res.status(200).json({
      success: true,
      message: "Order Assigned to Driver",
      data: orderUpdate,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.updateOrderStatusAdmin = async (req, res, next) => {
  console.log('admin updating order')
  try {
    console.log(req.body, " :order status")
    const orderUpdate = await Order.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.query.orderId) }, { status: req.body.status },
      { new: true }
    );
    console.log(orderUpdate)
    return res.status(200).json({
      success: true,
      message: "Order Updated",
      data: orderUpdate,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.updateManualOrderStatusAdmin = async (req, res, next) => {
  console.log('admin updating order')
  try {
    console.log(req.body, " :order status")
    const orderUpdate = await Order.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.query.orderId) }, {
      status: req.body.status,
      manualOrderCompletestatus: req.body.manualOrderCompletestatus
    },
      { new: true }
    );
    console.log(orderUpdate)

    const restaurant = await Radius.findOne({ _id: orderUpdate.restaurantID._id })
    restaurant.totalEarning += orderUpdate.totalPrice;
    restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Order Updated",
      data: orderUpdate,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.declineOrder = async (req, res, next) => {
  try {
    console.log(req.body, " :order status")
    const orderUpdate = await Order.findByIdAndUpdate(mongoose.Types.ObjectId(req.query.orderId),
      { status: 7 }, { new: true })

    console.log(orderUpdate + "  Updated Order")

    return res.status(200).json({
      success: true,
      message: "Successfully Declined Order",
      data: orderUpdate,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getOrderByDriverId = async (req, res, next) => {
  console.log("got in dashboard", req.query.driverId);
  try {
    const incompleteOrder = await Order.find({
      $and: [
        { driverId: mongoose.Types.ObjectId(req.query.driverId) },
        { status: 4 },
      ],
    })
      .populate("userId")
      .populate("details.productId");
    const completeOrder = await Order.find({
      $and: [
        { driverId: mongoose.Types.ObjectId(req.query.driverId) },
        { status: 5 },
      ],
    })
      .populate("userId")
      .populate("details.productId");
    const acceptedOrder = await Order.find({
      $and: [
        { driverId: mongoose.Types.ObjectId(req.query.driverId) },
        { status: 2 },
      ],
    })
      .populate("userId")
      .populate("details.productId");
    const rejectedOrder = await Order.find({
      $and: [
        { driverId: mongoose.Types.ObjectId(req.query.driverId) },
        { status: 3 },
      ],
    })
      .populate("userId")
      .populate("details.productId");
    const pendingOrder = await Order.find({
      $and: [
        { driverId: mongoose.Types.ObjectId(req.query.driverId) },
        { status: 0 },
      ],
    })
      .populate("userId")
      .populate("details.productId");
    const approvedOrder = await Order.find({
      $and: [
        { driverId: mongoose.Types.ObjectId(req.query.driverId) },
        { status: 1 },
      ],
    })
      .populate("userId")
      .populate("details.productId");
    // const adminRadius = await Radius.find({});
    return res.status(200).json({
      success: true,
      message: "all orders driver",
      data: {
        // shopAddress: adminRadius[0].geometry.coordinates,
        incompleteOrder,
        completeOrder,
        acceptedOrder,
        rejectedOrder,
        pendingOrder,
        approvedOrder,
      },
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};


exports.getAllOrdersAdmin = async (req, res, next) => {
  try {
    const pendingOrder = await Order.find({ status: 0 })
      .populate("userId")
      .populate("details.productId");
    const approvedOrder = await Order.find({ status: 1 })
      .populate("userId")
      .populate("details.productId");
    const declinedOrder = await Order.find({ status: 7 })
      .populate("userId")
      .populate("details.productId");
    const acceptedOrder = await Order.find({ status: 2 })
      .populate("userId")
      .populate("details.productId");
    const completedOrder = await Order.find({ status: 5 })
      .populate("userId")
      .populate("details.productId")


    let drivers = []

    for (let i = 0; i < approvedOrder.length; i++) {
      let comparingCoor = await DeliveryPerson.find({
        $and: [
          {
            verified: true
          },
          {
            blocked: false
          }
        ]
      });
      console.log(comparingCoor)
      approvedOrder[i].drivers = comparingCoor
    }

    return res.status(200).json({
      success: true,
      message: "admin orders",
      data: {
        pendingOrder,
        approvedOrder,
        declinedOrder,
        acceptedOrder,
        completedOrder,
      },
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};


exports.getAllOrdersByDriverId = async (req, res, next) => {
  console.log("got in dashboard", req.query.driverId);
  console.log(req.query.driverId, 'req.query.driverId')
  try {
    const allOrders = await Order.find({ driverId: req.query.driverId })
      .populate("userId")
      .populate("details.productId");

    return res.status(200).json({
      success: true,
      message: "All Orders",
      data: allOrders,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
}; 
