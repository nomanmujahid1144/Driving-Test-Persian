const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
        default: ''
    },

},
    { timestamps: true })

module.exports = mongoose.model('Banner', bannerSchema);
