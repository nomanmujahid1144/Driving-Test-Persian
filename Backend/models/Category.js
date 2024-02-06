const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    categoryTitle: {
        type: String,
        default: ''
    },
    categoryPersianTitle: {
        type: String,
        default: ''
    },
    categoryImage: {
        type: String,
        default: ''
    },
    totalQuestions: {
        type: Number,
        default : 0
    },
    rights: {
        type: Number,
        default : 0
    },
    wrongs: {
        type: Number,
        default : 0
    },
    unanswered: {
        type: Number,
        default : 0
    },
    rightPercentage: {
        type: Number,
        default : 0
    },
    wrongPercentage: {
        type: Number,
        default : 0
    },
    unansweredPercentage: {
        type: Number,
        default : 0
    },
    totalPercentage: {
        type: Number,
        default : 0
    },
    highestSolvedQuestionIndex: {
        type: Number,
        default : 0
    },

},
    { timestamps: true })

module.exports = mongoose.model('Category', categorySchema);
