const mongoose = require('mongoose');
const Blog = new mongoose.Schema({
    blogHeading: {
        type: String,
        default: ''
    },
    blogImage: {
        type: String,
        default: ''
    },
    data: {
        type: String,
        default: []
    },
},
    { timestamps: true })

module.exports = mongoose.model('Blogs', Blog);
