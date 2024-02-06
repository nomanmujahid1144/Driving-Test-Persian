const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    details: [{
        _id: false,
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productTotal : {type : Number , default : 0},
        quantity: {
            type: Number
        },
        extras : {
            type : Array
        },
    }],
    checkedOut: {
        type: Boolean,
        default: false
    },
    totalProducts : {
        type: Number,
        default : 0
    },
    subTotal :{
        type: Number,
        default : 0
    },
    totalPrice: {
        type: Number,
        default : 0
    },
    deliveryFee: {
        type: Number,
        default : 0
    },
    
   

}, { timestamps: true })

module.exports = mongoose.model('Cart', cartSchema)