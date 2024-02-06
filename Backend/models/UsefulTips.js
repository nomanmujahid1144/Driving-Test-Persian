const mongoose = require('mongoose')
const usefulTipsSchema = new mongoose.Schema({
    document: {
        type: Object
    },
    video: {
        type: String
    },
    image: {
        type: String
    },
    tips: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model('UsefulTips', usefulTipsSchema)