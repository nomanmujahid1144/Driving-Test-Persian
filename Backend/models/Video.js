const mongoose = require('mongoose');
const VideoSchema = new mongoose.Schema({
    document: {
        type: Object
    },
    video: {
        type: String,
        default : ''
    },
    image: {
        type: String,
        default : ''
    },
    title: {
        type: String,
        default : ''
    },

}, { timestamps: true })


module.exports = mongoose.model('Video', VideoSchema);
