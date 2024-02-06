const ErrorResponse = require('../utils/errorResponse');
const { uploadImage } = require('../helpers/helpers');
const Question = require('../models/TestQuestions');
const Answers = require('../models/TestAnswers');
const fs            = require('fs');
const mongoose = require('mongoose');
const { shuffleArray } = require('../helpers/ShuffleArray');

exports.addQuestion = async (req, res, next) => {
    try {
      let body = JSON.parse(req.query.values);
      
      if (!req.files) {
          return res.status(200).json({
              success: false,
              data: null,
              message: 'Upload Image'
          })
      } else {

        const uploadedPath = await uploadImage(req.files.image, next)
        body.image = uploadedPath.photoPath;

        const questions = [];
          
        const singleQuestion = {
          question: body.question,
          persianQuestion: body.persianQuestion,
          options: body.options,
          persianOption: body.persianOption,
          correctAnswer: body.correctAnswer,
          image: body.image,
          explanation : body.explanation,
          persianExplanation : body.persianExplanation,
        }

        questions.push(singleQuestion);

        let addedQuestion;
        
        await Question.findOne({ languageType  : body.languageType }, async (err, findCategoryQuestions) => {
          if (err) {
            
          } else {
            if (!findCategoryQuestions) {
              // IT MEANS THERE IS NO CATEGORY QUESTION AND WE HAVE TO MAKE NEW CATEGORY QUESTION 
              const question = new Question({
                questions: questions,
                languageType: body.languageType
              })
    
              addedQuestion = await question.save();
              if (!addedQuestion) {
                return next(new ErrorResponse('add product failed', 400))
              }
              return res.status(200).json({
                success: true,
                data: addedQuestion,
                message : 'Adding Question Successfully'
              });
            } else {
                console.log(findCategoryQuestions , 'findCategoryQuestions')
                findCategoryQuestions.questions.push(singleQuestion);
                await findCategoryQuestions.save();
                return res.status(200).json({
                  success: true,
                  data: findCategoryQuestions,
                  message : 'Adding Question Successfully'
                });
            }
          }
        });
      }
      
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}
exports.updateQuestion = async (req, res, next) => {
  try {
    let body = JSON.parse(req.query.values);
    const id = req.query.id;
    const index = req.query.index;

    console.log(id, index, 'Index')

    if (req.files) {
        const toBeUpdated = await Question.findOne({ _id: mongoose.Types.ObjectId(id) }).select('image')
        fs.unlink(`${process.env.FILE_DELETE_PATH}${toBeUpdated.image}`, (err) => {
            if (err) {
                console.error(err)
                return
            }
        });
        const uploadedPath = await uploadImage(req.files.image, next)
        body.image = uploadedPath.photoPath
    }

    const singleQuestion = {
      question: body.question,
      persianQuestion: body.persianQuestion,
      options: body.options,
      persianOption: body.persianOption,
      correctAnswer: body.correctAnswer,
      image: body.image,
      explanation : body.explanation,
      persianExplanation : body.persianExplanation,
    }

    await Question.findOne({ _id: mongoose.Types.ObjectId(id) }, async (err, findAndUpdateQuestion) => {
      if(err) {
        return res.status(200).json({
          data: null,
          message: 'Update failed',
          success: false
        })
      }else{
        findAndUpdateQuestion?.questions.splice(index, 1); // Remove the element at the specified index
        findAndUpdateQuestion?.questions.splice(index, 0, singleQuestion); // Insert the new item at the same index
        await findAndUpdateQuestion.save();
        
        
        return res.status(200).json({
                success: true,
                data: findAndUpdateQuestion,
                message: 'Question Updated Successfully'
        })
      }
    })
  }
  catch (err) {
      return next(new ErrorResponse(err, 400))
  }
}

exports.getEnglishCategoryQuestion = async (req, res, next) => {
  try {
    const questions = await Question.findOne({languageType: 'English' }, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    })
    
    if (!questions) {
        return res.status(200).json({
            success: true,
            data: [],
            message: 'There is No any Test Question Yet'
        })
    }
    return res.status(200).json({
      success: true,
      data: {
        questions: questions?.questions,
        category: questions?.categoryId,
        questionsId : questions?._id
      },
      message: "All Test Questions found"
    })
  }
  catch (err) {
      return next(new ErrorResponse(err, 400))
  }
}







exports.getTestQuestions = async (req, res, next) => {
  try {

    const body = req.query;

    const questions = await Question.findOne({languageType: 'English' }, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    })
    
    if (!questions) {
        return res.status(200).json({
            success: true,
            data: {
              questions: [],
              questionId : ''
            },
            message: 'There is No any Test Question Yet'
        })
    }

    const shuffeledQestions = await shuffleArray(questions?.questions)

    if (!body.deviceId) { 
      const id = new Date().getTime().toString(); 
      return res.status(200).json({
        success: true,
        data: {
          questions: questions?.questions,
          questionId : id.toString()
        },
        message: "All Test Questions"
      })
    } else {
      const Answe = await Answers.findOne({ deviceId: body.deviceId });
    
      const id = new Date().getTime().toString(); // Unique Id for Each Shuffle Question

      const obj = {
        questionId: id,
        questions: shuffeledQestions.slice(0, 50)
      }

      if (!Answe) {
        const newAnwer = new Answers({
          deviceId: body.deviceId,
          answers: obj,
        })
        await newAnwer.save();

      } else {
        Answe.answers.push(obj);
        await Answe.save();
      }

      return res.status(200).json({
        success: true,
        data: {
          questions: shuffeledQestions.slice(0, 50),
          questionId : id.toString()
        },
        message: "All Test Questions"
      })
    }
    
  }
  catch (err) {
      return next(new ErrorResponse(err, 400))
  }
}

exports.getTestResults = async (req, res, next) => {
  try {

    const body = req.query;

    const answers = await Answers.findOne({ deviceId : body.deviceId }, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    })

    if (!answers) {
        // if device is not exists in Answers Model
        return res.status(200).json({
            success: true,
            data: {
              results : []
            },
            message: 'There is No any Test Result Yet'
        })
    } else {
      // Device is exist but Now check if it has Answers (IN other words User Take any Test or not) in its Answers Array.
      if (answers.answers.length !== 0) {

        let deviceResult = [];

        answers.answers.forEach((answer) => {
          const totalQuestions = answer.questions.length;
          const totalAnswers = answer.answers.length
          const totalPercentage = (totalAnswers / totalQuestions) * 100; //OVERALL PERCENTAGE


          let trueCount = 0;
          let falseCount = 0;
          
          answer.answers.forEach((answer) => {
            if (answer.isCorrect === true) {
              trueCount++;
            } else {
              falseCount++;
            }
          })
          
          const percentage = (trueCount / (trueCount + falseCount)) * 100;
          // console.log('True Count:', trueCount);
          // console.log('False Count:', falseCount);

          console.log(Math.round(percentage), 'Math.round(percentage)')



          let obj = {
            questionId: answer.questionId,
            status: Math.round(percentage) > 80 ? 'Pass' : "Fail",
            percentage: Math.round(totalPercentage) !== null ? Math.round(totalPercentage) : 0,
            totalCount: trueCount + falseCount,
            trueCount: trueCount,
            falseCount:falseCount
          }
          deviceResult.push(obj)
        })

        return res.status(200).json({
          success: true,
          data: {
            results : deviceResult
          },
          message: "All Test Questions found"
        })

      } else {
        //Device has not Test Result Yet
        return res.status(200).json({
          success: true,
          data: {
            results : []
          },
          message: 'There is No any Test Result Yet'
        })
      }
    }
  }
  catch (err) {
      return next(new ErrorResponse(err, 400))
  }
}


exports.getSingleTestResults = async (req, res, next) => {
  try {

    const body = req.query;

    const answers = await Answers.findOne({ deviceId : body.deviceId }, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    })

    if (!answers) {
        // if device is not exists in Answers Model
        return res.status(200).json({
            success: true,
            data: {
              results : []
            },
            message: 'There is Not any Test Result For this Device'
        })
    } else {
      // Device is exist but Now check if it has Answers (IN other words User Take any Test or not) in its Answers Array.
      if (answers.answers.length !== 0) {

        let highestQuestionIndex = 0;
        let questionId = '';
        let questions = [];
        answers.answers.forEach((answer) => {
          if (answer.questionId === body.questionId) { // Match the Test I mean get the same Test
            if (answer.questions.length > answer.answers.length) {
              // It Means that the User does not completed his Test Quiz Yet
              highestQuestionIndex = Math.max(...answer.answers.map(answer => answer.questionIndex));
              questionId = answer.questionId;
              questions = answer.questions;
              return res.status(200).json({
                success: true,
                data: {
                  questions: questions,
                  questionId :questionId,
                  highestSolvedQuestionIndex : highestQuestionIndex
                },
                message: "Some Questions are Remaining"
              })
            } else {
              // User Completed his Test Quiz
              
              const result = answer.answers.reduce((acc, answer) => {
                if (answer.isCorrect) {
                  acc.trueCount++;
                } else {
                  acc.falseCount++;
                }
                return acc;
              }, { trueCount: 0, falseCount: 0 });

              const truePercentage = (result.trueCount / (result.trueCount + result.falseCount)) * 100;
              
              const mergedResult = answer.questions.map((question , questionIndex) => {
                const answers = answer.answers.find((ans) => ans.questionIndex === questionIndex);
                return { ...question, answers };
              });
              
              return res.status(200).json({
                success: true,
                data: {
                  results: mergedResult,
                  time : answer.time,
                  totalPercentage: Math.round(truePercentage),
                  questionId: answer.questionId,
                  totalTrue: result.trueCount,
                  totalFalse: result.falseCount,
                  totalQuestions : answer.questions.length,
                  points : result.trueCount + "/" + answer.questions.length
                },
                message: "Result of Single Test"
              })
            }
          }
        })

      } else {
        //Device has not Test Result Yet
        return res.status(200).json({
          success: true,
          data: {
            results : []
          },
          message: 'Pleae Attempt any Test'
        })
      }
    }
  }
  catch (err) {
      return next(new ErrorResponse(err, 400))
  }
}


exports.deleteSingleTest = async (req, res, next) => {
  try {
    console.log(req.query)
    const body = req.query; // Specify the questionId to delete

    const answers = await Answers.findOne({ deviceId : body.deviceId }, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    })

    if (!answers) {
      // if device is not exists in Answers Model
      return res.status(200).json({
        success: true,
        data: null,
        message: 'There is Not any Test Result For this Device'
      })
    } else { 
      // Find the answer object that contains the questionId to delete
      const answerToDelete = answers.answers.find(answer => answer.questionId === body.questionId);

      if (answerToDelete) {
        // Delete the answer object from the answers array
        answers.answers = answers.answers.filter(answer => answer.questionId !== answerToDelete.questionId);
        answers.save();
        // Log the updated data
        return res.status(200).json({
          success: true,
          data: answers,
          message: 'Test Question deleted successfully.'
        })

      } else {
        return res.status(200).json({
          success: true,
          data: null,
          message: 'Answer with the specified questionId not found.'
        })

      }
    }

  } catch (err) {
    return next(new ErrorResponse(err, 400))
  }
}

exports.deleteTestQuestion = async (req, res, next) => {
  try {

    const testQuestion = await Question.findOne({});

    let deleted = false;
    if (testQuestion) {
      req.query.IDS.map(async (element) => {
        const index = testQuestion.questions.findIndex(question => question._id.toString() === element.toString());
        if (index !== -1) {
          testQuestion.questions.splice(index, 1);
          deleted = true;
        }
      })
      testQuestion.save();

      if (deleted) {
        return res.status(200).json({
          success: true,
          message: "Successfully Deleted Test Question",
          data: null
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Question not found with the specified id",
          data: null
      })
      }

    } else {
      return res.status(200).json({
          success: false,
          message: "No Test Found",
          data: null
      })
    }

  }
  catch (err) {
      return next(new ErrorResponse(err, 400))
  }
}