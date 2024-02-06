const mongoose = require('mongoose');

const testAnswersSchema = new mongoose.Schema({
    // questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Questions' },
    answers: [
        {
            _id : false,
            questionId: { type: String , default : '' },
            questions : {type : Array  ,default : []},
            time : {type : String  ,default : ''},
            answers: [{
                _id : false,
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
            }],
        }
    ],
    deviceId: { type: String, default: '' },

}, { timestamps: true })

module.exports = mongoose.model('TestAnswers', testAnswersSchema)