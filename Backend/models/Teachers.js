const mongoose = require('mongoose');
const TeachertSchema = new mongoose.Schema({
    institutePhoto: {
        type: String,
        default : ''
    },
    instituteName: {
        type: String,
        default : ''
    },
    teacherName: {
        type: String,
        default : ''
    },
    phoneno: {
        type: String,
        default : ''
    },
    email: {
        type: String,
        default : ''
    },
    address: {
        type: String,
        default : ''
    },
    geometry: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
    }

}, { timestamps: true })


module.exports = mongoose.model('Teacher', TeachertSchema);
