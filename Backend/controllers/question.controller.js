const ErrorResponse = require('../utils/errorResponse');
const { uploadImage, uploadVideo } = require('../helpers/helpers');
const Question = require('../models/Question');
const Answers = require('../models/Answers');
const fs            = require('fs');
const mongoose = require('mongoose');
const { shuffleArray } = require('../helpers/ShuffleArray');

exports.addQuestion = async (req, res, next) => {
    try {
      let body = JSON.parse(req.query.values);
      let uploadedPath;

      if (req.files?.video) {
          uploadedPath = await uploadVideo(req.files.video , next)
      }
      if (req.files?.image) {
          uploadedPath = await uploadImage(req.files.image , next)
      }

      const questions = [];
        
      const singleQuestion = {
        question: body.question,
        persianQuestion: body.persianQuestion,
        options: body.options,
        persianOption: body.persianOption,
        correctAnswer: body.correctAnswer,
        video: req.files?.video ? uploadedPath.videoPath : '',
        image: req.files?.image ? uploadedPath.photoPath : '',
        explanation : body.explanation,
        persianExplanation : body.persianExplanation,
      }

      questions.push(singleQuestion);

      let addedQuestion;
      
      await Question.findOne({ categoryId: body.categoryId , languageType  : body.languageType }, async (err, findCategoryQuestions) => {
        if (err) {
          
        } else {
          if (!findCategoryQuestions) {
            // IT MEANS THERE IS NO CATEGORY QUESTION AND WE HAVE TO MAKE NEW CATEGORY QUESTION 
            const question = new Question({
              questions: questions,
              categoryId: body.categoryId,
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
            if (body.languageType === findCategoryQuestions.languageType) {
              // ADDING SAME LANGUAGE RATHER ITS ENGLISH OR PERSIAN
              findCategoryQuestions.questions.push(singleQuestion);
              await findCategoryQuestions.save();
              return res.status(200).json({
                success: true,
                data: findCategoryQuestions,
                message : 'Adding Question Successfully'
              });
            } else {
              // ADDING OTHER LANGUAGE
              const question = new Question({
                questions: questions,
                categoryId: body.categoryId,
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
            }
          }
        }
      });
      
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}
exports.updateQuestion = async (req, res, next) => {
  try {
    let body = JSON.parse(req.query.values);
    const id = req.query.id;
    const index = req.query.index;
    let uploadedPath;

    console.log(req.files, 'FILES')

    if (req.files !== null) {
        const toBeUpdated = await Question.findOne({ _id: mongoose.Types.ObjectId(id) }).select('image')
        fs.unlink(`${process.env.FILE_DELETE_PATH}${toBeUpdated.image}`, (err) => {
            if (err) {
                console.error(err)
                return
            }
        });
        if (req.files?.video) {
          uploadedPath = await uploadVideo(req.files.video, next)
          body.video = uploadedPath.videoPath;
        } else {
          uploadedPath = await uploadImage(req.files.image, next)
          body.uploadedPath.photoPath;
        }
    }

    // const singleQuestion = {
    //   question: body.question,
    //   persianQuestion: body.persianQuestion,
    //   options: body.options,
    //   persianOption: body.persianOption,
    //   correctAnswer: body.correctAnswer,
    //   video: req.files?.video ? uploadedPath.videoPath : '',
    //   image: req.files?.image ? uploadedPath.photoPath : '',
    //   explanation : body.explanation,
    //   persianExplanation : body.persianExplanation,
    // }

    await Question.findOne({ _id: mongoose.Types.ObjectId(id) }, async (err, findAndUpdateQuestion) => {
      if(err) {
        return res.status(200).json({
          data: null,
          message: 'Update failed',
          success: false
        })
      }else{
        findAndUpdateQuestion?.questions.splice(index, 1); // Remove the element at the specified index
        findAndUpdateQuestion?.questions.splice(index, 0, body); // Insert the new item at the same index
        console.log(findAndUpdateQuestion)
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
    const categoryId = req.query.id; 
    const deviceId = req.query.deviceId; 
    console.log(categoryId, deviceId)
    const questions = await Question.findOne({ categoryId: categoryId, languageType: 'English' }, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    }).populate('categoryId', {
        updatedAt: 0,
        createdAt: 0,
        __v: 0
      })
    console.log(questions, 'questions')
    if (!questions) {
        return res.status(200).json({
            success: true,
            data: [],
            message: 'No English Question found'
        })
    }

    if (questions?.questions.length !== 0) {
      const shuffeledQestions = await shuffleArray(questions?.questions)

      if (!deviceId) {
        return res.status(200).json({
          success: true,
          data: {
            questions: questions?.questions,
            category: questions?.categoryId,
            questionsId : questions?._id
          },
          message: "All English Questions found with this Category"
        })
      } else {
        const Answe = await Answers.findOne({ deviceId: deviceId });

        const obj = {
          questions: shuffeledQestions,
          questionId: questions?._id,
          categoryId : categoryId,
        }
  
        if (!Answe) {
          const newAnwer = new Answers({
            deviceId: deviceId,
            answers: obj,
          })
          await newAnwer.save();
  
        } else {
          const index = Answe.categoryAnswers.findIndex(answer => answer.questionId.toString() === questions?._id.toString());
  
          if (index !== -1) {
            console.log("The category answer with the specified questionId exists.");
            // Return true or perform further actions
            return res.status(200).json({
              success: true,
              data: {
                questions: Answe.categoryAnswers[index]?.questions,
                category: questions?.categoryId,
                questionsId : questions?._id
              },
              message: "All English Questions found with this Category"
            })
          } else {
            console.log("The category answer with the specified questionId does not exist.");
            Answe.categoryAnswers.push(obj);
            await Answe.save();
            // Return false or perform alternative actions
            
            return res.status(200).json({
              success: true,
              data: {
                questions: shuffeledQestions,
                category: questions?.categoryId,
                questionsId : questions?._id
              },
              message: "All English Questions found with this Category"
            })
  
          }
  
        }
      }
      

    } else {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No English Question found'
      })
    }
    

    
  }
  catch (err) {
      return next(new ErrorResponse(err, 400))
  }
}
exports.getPersianCategoryQuestion = async (req, res, next) => {
  try {
    const categoryId = req.query.id; 
    const questions = await Question.findOne({ categoryId: categoryId, languageType: 'Persian' }, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0
    })
      .populate('categoryId', {
        updatedAt: 0,
        createdAt: 0,
        __v: 0
      })
    if (!questions) {
        return res.status(200).json({
            success: true,
            data: [],
            message: 'No Persian Question found'
        })
    }
    return res.status(200).json({
      success: true,
      data: {
        questions: questions?.questions,
        category: questions?.categoryId,
        questionsId : questions?._id
      },
      message: "All Persian Questions found with this Category"
    })
  }
  catch (err) {
      return next(new ErrorResponse(err, 400))
  }
}
exports.deleteQuestion = async (req, res, next) => {
  try {

    const singleQuestion = await Question.findOne({categoryId: req.query.id , languageType: 'English'});

    let deleted = false;
    if (singleQuestion) {
      req.query.IDS.map(async (element) => {
        const index = singleQuestion.questions.findIndex(question => question._id.toString() === element.toString());
        if (index !== -1) {
          singleQuestion.questions.splice(index, 1);
          deleted = true;
        }
      })
      singleQuestion.save();

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
