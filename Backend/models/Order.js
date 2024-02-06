const mongoose = require('mongoose')

const GeoSchema = new mongoose.Schema({
    _id: false,
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
});

const orderSchema = new mongoose.Schema({
    orderid: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPerson' },
    details: [{
        _id: false,
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productTotal: { type: Number, default: 0 },
        quantity: {
            type: String
        }
    }],
    restaurantID :  {type: mongoose.Schema.Types.ObjectId , ref : 'Radius'},
    status: {
        type: Number,
        default: 0
    },
    manualOrderCompletestatus: {
        type: Number,
        default: 0
    },
    pickUpStatus: {
        type: Number,
        default: 0
    },
    geometry: GeoSchema,
    totalPrice: {
        type: Number,
        default: 0
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    totalTax: {
        type: Number,
        default: 0
    },
    totalProducts: {
        type: Number,
        default: 0
    },
    subTotal: {
        type: Number,
        default: 0
    },
    city: {
        type: String,
        default: 0
    },
    address: {
        type: String,
        default: 0
    },
    shopAddress: {
        type: String,
        default: ''
    },
    deliveryType: {
        type: String,
        default: ''
    },
    paymentMethod: {
        type: String,
        default: ''
    },
    postalCode: {
        type: String,
    },
    drivers: {
        type: Array,
        default: []
    },
    date: {
        type: String
    },
    time: {
        type: String
    },

}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)