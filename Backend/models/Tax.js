const mongoose = require('mongoose')
const taxSchema = new mongoose.Schema({

    totalTax: {
        type: Number
    },
    pricePerMile: {
        type: Number
    }

}, { timestamps: true })

module.exports = mongoose.model('Tax', taxSchema)