const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    // questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Questions' },
    categoryAnswers: [
        {
            _id : false,
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Questions' },
            categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
            questions : {type : Array  ,default : []},
            answers :   [{
                questionIndex: {
                    type: Number,
                },
                isCorrect: {
                    type: Boolean,
                    default : false
                },
                answerSelected: {
                    type: Number
                }
            }]
        }
    ],
    deviceId : {type : String , default: ''},

}, { timestamps: true })

module.exports = mongoose.model('Answers', answersSchema)