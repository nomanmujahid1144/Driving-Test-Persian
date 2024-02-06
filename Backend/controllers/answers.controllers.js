const ErrorResponse = require('../utils/errorResponse');
const Answers = require('../models/Answers');
const mongoose = require('mongoose');

exports.addAnswers = async (req, res, next) => {
    try {
        const body = req.body;
        const Answe = await Answers.findOne({ deviceId : body.deviceId })
            .populate('questionId');

        const obj = {
            questionId: body.questionId,
            categoryId : body.categoryId,
            answers : body.answers
        }

        if (!Answe) {
            const newAnwer = new Answers({
                deviceId : body.deviceId,
                categoryAnswers: obj,
            }) 
            const newAns = newAnwer.save();
            return res.status(200).json({
                success: true,
                message: "Answer Save Successfully",
                data: newAns,
            });
        } else {
            if (Answe.categoryAnswers.length !== 0) {
                let questionIdMatch = false;
                Answe.categoryAnswers.forEach((eachQuestion, index) => {
                    if (eachQuestion.questionId == body.questionId) {
                        eachQuestion.answers.push(body.answers);
                        questionIdMatch = true;
                    } 
                })

                if (!questionIdMatch) {
                    Answe.categoryAnswers.push(obj);
                }

                Answe.save().then(savedAnswer => {
                    return savedAnswer.populate('categoryAnswers.questionId').execPopulate();
                }).then(populatedAnswer => {
                    console.log(populatedAnswer, 'populatedAnswer 1')
                    populatedAnswer.categoryAnswers.forEach(answer => {
                        if (answer.categoryId.toString() === body.categoryId) {
                            const totalpercentage = (answer.answers.length / answer.questionId.questions.length) * 100;
                            return res.status(200).json({
                                success: true,
                                message: "Answer Save Successfully",
                                data: {
                                    totalPercentage : Math.round(totalpercentage)
                                },
                            });
                        }
                    })
                    
                })

            } else {
                Answe.categoryAnswers.push(obj)
                Answe.save().then(savedAnswer => {
                    return savedAnswer.populate('categoryAnswers.questionId').execPopulate();
                }).then(populatedAnswer => {
                    console.log(populatedAnswer, 'populatedAnswer')
                    populatedAnswer.categoryAnswers.forEach(answer => {
                        if (answer.categoryId.toString() === body.categoryId) {
                            const totalpercentage = (answer.answers.length / answer.questionId.questions.length) * 100;
                            return res.status(200).json({
                                success: true,
                                message: "Answer Save Successfully",
                                data: {
                                    totalPercentage : Math.round(totalpercentage)
                                },
                            });
                        }
                    })
                })
            }
            
        }
        
    } catch (err) {
    return next(new ErrorResponse(err, 400));
    }
}
exports.getResult = async (req, res, next) => {
    try {
        const body = req.query;
        console.log(body ,'body')
        const answers = await Answers.findOne({ deviceId : body.deviceId })
            .populate('categoryAnswers.questionId categoryAnswers.categoryId');

        answers.categoryAnswers.forEach((answer) => {
            if (answer.categoryId._id.toString() === body.categoryId.toString()) {
                console.log(answer, 'answer')
                const result = answer.answers.reduce((acc, answer) => {
                    if (answer.isCorrect) {
                      acc.trueCount++;
                    } else {
                      acc.falseCount++;
                    }
                    return acc;
                }, { trueCount: 0, falseCount: 0 });
    
                const truePercentage = (result.trueCount / (result.trueCount + result.falseCount)) * 100;
                console.log(truePercentage, 'True Percentage')
                
                const mergedResult = answer.questions.map((question , questionIndex) => {
                    const answers = answer.answers.find((ans) => ans.questionIndex === questionIndex);
                    return { ...question._doc, answers };
                });
                
                console.log(mergedResult, 'Mergedresult')

                return res.status(200).json({
                    success: true,
                    data: {
                      results: mergedResult,
                      totalPercentage: Math.round(truePercentage),
                      questionId: answer.questionId,
                      totalTrue: result.trueCount,
                      totalFalse: result.falseCount,
                      totalQuestions : answer.questionId.questions.length,
                      points : result.trueCount + "/" + answer.questionId.questions.length
                    },
                    message: "Result of Single Test"
                  })
            }
        })
        
    } catch (err) {
    return next(new ErrorResponse(err, 400));
    }
}

exports.getEachDeviceData = async (req, res, next) => {
    try {
        const allDevices = await Answers.find({}).populate('categoryAnswers.questionId')
        let netresult = [];
        let obj = {
            deviceId: '',
            totalTests: '',
            testResult:''
        }
        if (allDevices.length !== 0) {
            allDevices.forEach((answer) => {
                console.log(answer.categoryAnswers.length)
                answer.categoryAnswers.forEach((eachAns) => {
                    if (eachAns.questionId.questions.length > eachAns.answers.length) {
                        obj = {
                            deviceId: answer.deviceId,
                            totalTests: answer.categoryAnswers.length,
                            testResult: 'In Progress'
                        }
                        netresult.push(obj);
                    } else {
                        obj = {
                            deviceId: answer.deviceId,
                            totalTests: answer.categoryAnswers.length,
                            testResult: 'Completed'
                        }
                        netresult.push(obj);
                    }
                })
            })

            return res.status(200).json({
                success: true,
                message: "There is No User Yet",
                data: netresult,
            });


        } else {
            return res.status(200).json({
                success: true,
                message: "There is No User Yet",
                data: [],
            });
        }
    } catch(err) {
        return next(new ErrorResponse(err, 400));
    }
}

exports.deleteCategoryResult = async (req, res, next) => {
    try {
        const body = req.query;
        await Answers.findOne({ deviceId: body.deviceId }, (err, categoryResult) => {
            if (err) {
                return next(new ErrorResponse(err, 400));
            } else {
                
                categoryResult.categoryAnswers = categoryResult.categoryAnswers.filter(result => result.categoryId.toString() !== body.categoryId.toString());
                console.log(categoryResult)
                categoryResult.save();
                return res.status(200).json({
                    success: true,
                    message: "Category Result Delete Successfully",
                    data: categoryResult,
                })
            }
        });

    } catch (err) {
        return next(new ErrorResponse(err, 400));
    }
}