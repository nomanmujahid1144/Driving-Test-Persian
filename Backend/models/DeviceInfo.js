const mongoose = require('mongoose')


const deviceSchema = new mongoose.Schema({
    deviceId : {
        type: String,
        default : ""
    }

}, { timestamps: true })

module.exports = mongoose.model('DeviceInfo', deviceSchema)