const mongoose = require('mongoose');
const Vehicle = new mongoose.Schema({
    registrationNumber: {
        type: String
    },
    vehiclePhotos: [String],
    deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPerson' }
})

module.exports = mongoose.model('Vehicle', Vehicle);
