const mongoose = require('mongoose');
const AboutUs = new mongoose.Schema({
    heading: {
        type: String,
        default: ''
    },
    data: {
        type: String,
        default: ''
    },
},
    { timestamps: true })

module.exports = mongoose.model('AboutUs', AboutUs);
