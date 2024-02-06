const mongoose = require('mongoose')


const questionSchema = new mongoose.Schema({
    questions: [{
        options: [{
            _id: false,
            text: '',
            isCorrect : {type : Boolean , default : false}
        }],
        persianOption: [{
            _id: false,
            text: '',
            isCorrect : {type : Boolean , default : false}
        }],
        question: { type: String, default: '' },
        persianQuestion: { type: String, default: '' },
        correctAnswer: { type: Number , default: 0 },
        image: { type: String, default: '' },
        video: { type: String, default: '' },
        explanation : {type : String , default : ''},
        persianExplanation : {type : String , default : ''}
    }],
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    languageType : {
        type: String,
        default : ""
    }

}, { timestamps: true })

module.exports = mongoose.model('Questions', questionSchema)