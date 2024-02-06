const mongoose = require('mongoose');
const Faqs = new mongoose.Schema({
    faqs: {
        type: Array,
        default: []
    }
},
    { timestamps: true })

module.exports = mongoose.model('Faqs', Faqs);
