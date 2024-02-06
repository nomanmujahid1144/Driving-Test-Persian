const mongoose = require('mongoose');

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

const deliveryPerson = new mongoose.Schema({
    fullName: {
        type: String,
        default:''
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: [true, 'Please add email'],
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            'Please add a valid email'
        ],
        unique: [true, "This email already exists"],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: Number,
        required: [true, 'please enter phone number']
    },
    drivingLicense: {
        type: String,
        default: ''
    },
    identityCardNumber: {
        type: String,
        default: ''
    },
    vehicleNumber: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    booked: {
        type: Number,
        default: 0
    },
    fcmToken: {
        type: String
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    geometry: GeoSchema,
    deactivate: {
        type: Number,
        default: 0
    },
},
    { timestamps: true })

module.exports = mongoose.model('DeliveryPerson', deliveryPerson);
