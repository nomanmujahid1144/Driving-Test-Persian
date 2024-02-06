const mongoose = require('mongoose')

const allowedRadius = new mongoose.Schema({
    geometry: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
    },
    radius: {
        type: String,
        default: ''
    },
    formattedAddress:{
        type:String,
        default: ''
    },
    shopImage : {
        type : String
    },
    shopName:{
        type:String,
        default: ''
    },
    delivery:{
        type:String,
        default: 0
    },
    phoneNumber:{
        type:String
    },
    totalEarning : {
        type : Number,
        default : 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Radius', allowedRadius);