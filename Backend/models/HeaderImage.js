const mongoose = require('mongoose');
const HeaderImages = new mongoose.Schema({
    headerPhoto: {
        type: String,
        default: ''
    },
},
    { timestamps: true })

module.exports = mongoose.model('headerImages', HeaderImages);
