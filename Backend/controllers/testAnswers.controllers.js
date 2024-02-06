const ErrorResponse = require('../utils/errorResponse');
const Answers = require('../models/TestAnswers');
const mongoose = require('mongoose');

exports.addAnswers = async (req, res, next) => {
    try {
        const body = req.body;

        const Answe = await Answers.findOne({ deviceId : body.deviceId })
            .populate('questionId'); 

        const obj = {
            questionId: body.questionId,
            time: body.time,
            answers : body.answers
        }

        if (!Answe) {
            const newAnwer = new Answers({
                deviceId : body.deviceId,
                answers: obj,
            }) 
            const newAns = newAnwer.save();
            return res.status(200).json({
                success: true,
                message: "Answer Save Successfully",
                data: newAns,
            });
        } else {
            if (Answe.answers.length !== 0) {
                let questionIdMatch = false;
                Answe.answers.forEach((eachQuestion, index) => {
                    if (eachQuestion.questionId == body.questionId) {
                        eachQuestion.answers.push(body.answers);
                        eachQuestion.time = body.time;
                        questionIdMatch = true;
                    } 
                })

                if (!questionIdMatch) {
                    Answe.answers.push(obj);
                }

                Answe.save().then(populatedAnswer => {
                    return res.status(200).json({
                        success: true,
                        message: "Answer Save Successfully",
                        data: populatedAnswer,
                    });
                })

            } else {
                Answe.answers.push(obj);
                Answe.save().then(populatedAnswer => {
                    return res.status(200).json({
                        success: true,
                        message: "Answer Save Successfully",
                        data: populatedAnswer,
                    });
                })
            }
            
        }
        
    } catch (err) {
    return next(new ErrorResponse(err, 400));
    }
}