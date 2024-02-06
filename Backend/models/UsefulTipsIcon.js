const mongoose = require('mongoose')
const usefulTipsIconSchema = new mongoose.Schema({
    iconImage: {
        type: String,
        default: ''
    }
}, { timestamps: true })

module.exports = mongoose.model('UsefulTipsIcon', usefulTipsIconSchema)