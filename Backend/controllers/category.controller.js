const ErrorResponse = require('../utils/errorResponse');
const { uploadImage } = require('../helpers/helpers');
const Categories = require('../models/Category');
const fs            = require('fs');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const UsefulTipsIcon = require('../models/UsefulTipsIcon');
const Question = require('../models/Question')
const Answers = require('../models/Answers');
const TestAnswers = require('../models/TestAnswers');
const Device = require('../models/DeviceInfo');

exports.addCategory = async (req, res, next) => {
    try {
        let body = JSON.parse(req.query.values);
    
        if (!req.files) {
          return res.status(200).json({
              success: false,
              data: null,
              message: 'Upload Image'
          })
      }
      const uploadedPath = await uploadImage(req.files.categoryImage, next)
        body.categoryImage = uploadedPath.photoPath
        
      const product = new Categories({
        categoryTitle: body.categoryTitle,
        categoryPersianTitle: body.categoryPersianTitle,
        categoryImage: body.categoryImage,
      })
      
      const addedProduct = await product.save()
        
      if (!addedProduct) {
          return next(new ErrorResponse('add product failed', 400))
      }
      return res.status(200).json({
          success: true,
          data: addedProduct
      })
    
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}
exports.updateCategory = async (req, res, next) => {
    try {
        console.log( req.query ,'query got here success fully')
        console.log( req.files ,'files got here success fully')
        const body = JSON.parse(req.query.values)
        const id = req.query.id
        if (req.files) {
            const toBeUpdated = await Category.findOne({ _id: mongoose.Types.ObjectId(id) }).select('categoryImage')
            fs.unlink(`${process.env.FILE_DELETE_PATH}${toBeUpdated.categoryImage}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });
            const uploadedPath = await uploadImage(req.files.categoryImage, next)
            body.categoryImage = uploadedPath.photoPath
        }
        const updatedCategory = await Category.updateOne({ _id: mongoose.Types.ObjectId(id) }, body)
        if (updatedCategory.nModified !== 1) {
            return res.status(200).json({
                data: null,
                message: 'update failed',
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            data: null,
            message: 'Category Updated Successfully'
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}
exports.getAllCategories = async (req, res, next) => {
    try {
 
        const body = req.query;
        const allCategories = await Categories.find({});
        const allTips = await UsefulTipsIcon.find({});
    
        if (allCategories.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Category Found",
                data: [],
            });
        } else {
            const allAnswers = await Answers.findOne({deviceId : body.deviceId}).populate('categoryAnswers.questionId')
            if (allAnswers) {
                if (allAnswers.categoryAnswers.length === 0) {
                    return res.status(200).json({
                        success: true,
                        message: "Successfully Get Categories",
                        data: allCategories,
                        tipIcon: allTips.length > 0 ? allTips[0].iconImage : "",
                    });
                } else {
                    await Promise.all(
                        allCategories.map(async (category, index) => {
                          const cate = await Question.findOne({ categoryId: category._id });
                          if (cate) {
                            category.totalQuestions += cate.questions.length;
                          }
                          allAnswers.categoryAnswers.forEach((eachQuestion) => {
                            if (
                              category._id.toString() ===
                              eachQuestion?.questionId?.categoryId.toString()
                            ) {
                              let trueCount = 0;
                              let falseCount = 0;
                              eachQuestion.answers.forEach((answer) => {
                                if (answer.isCorrect) {
                                  trueCount++;
                                } else {
                                  falseCount++;
                                }
                              });
                              category.rights += trueCount;
                              category.wrongs += falseCount;
                              category.totalPercentage = Math.round(
                                ((category.rights + category.wrongs) / category.totalQuestions) * 100
                              );
                              category.highestSolvedQuestionIndex = Math.max(
                                ...eachQuestion.answers.map((answer) => answer.questionIndex)
                              );
                              category.unanswered =
                                category.totalQuestions - (category.rights + category.wrongs);
                            }
                          });
                        })
                      );
                        
                }
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Device-Id Does not Exist",
                    data: [],
                });
            }
            
        }

        if (!allCategories) {
          return next(new ErrorResponse("Category Getting Failed", 400));
        }
        return res.status(200).json({
          success: true,
          message: "Successfully Get Categories",
          data: allCategories,
          tipIcon: allTips.length > 0 ? allTips[0].iconImage : "",
        });
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}
exports.getSingleCategory = async (req, res, next) => {
    try {
 
        const body = req.query;
        const category = await Categories.findById({_id: mongoose.Types.ObjectId(body.categoryId)});
        if (!category) {
            console.log(category, 'category is not')
            return res.status(200).json({
                success: true,
                message: "No Category Found",
                data: {},
            });
        } else {
            const allAnswers = await Answers.findOne({deviceId : body.deviceId}).populate('categoryAnswers.questionId')
            if (allAnswers) {
                const cate = await Question.findOne({ categoryId: category._id });
                    if (cate) {
                        category.totalQuestions += cate.questions.length;
                    }
                    allAnswers.categoryAnswers.forEach((eachQuestion) => {
                        if (
                            category._id.toString() ===
                            eachQuestion?.questionId?.categoryId.toString()
                        ) {
                            let trueCount = 0;
                            let falseCount = 0;
                            eachQuestion.answers.forEach((answer) => {
                            if (answer.isCorrect) {
                                trueCount++;
                            } else {
                                falseCount++;
                            }
                            });
                            category.rights += trueCount;
                            category.wrongs += falseCount;
                            category.totalPercentage = Math.round(
                            ((category.rights + category.wrongs) / category.totalQuestions) * 100
                            );
                            category.highestSolvedQuestionIndex = eachQuestion.answers.length > 0 ? Math.max(...eachQuestion.answers.map((answer) => answer.questionIndex)) +  1 : 0;
                            console.log(eachQuestion.answers.length , 'Without')
                            console.log(Math.max(...eachQuestion.answers.map((answer) => answer.questionIndex)), 'Without')
                            console.log(Math.max(...eachQuestion.answers.map((answer) => answer.questionIndex)) +  1 , 'With')
                            eachQuestion.answers.forEach((ans) => {
                                console.log(ans, 'ans')
                            });
                            category.unanswered =
                            category.totalQuestions - (category.rights + category.wrongs);
                        }
                    });
                    console.log(category, 'all category')
                    return res.status(200).json({
                        success: true,
                        message: "Successfully Get Categories",
                        data: category,
                        // tipIcon: allTips.length > 0 ? allTips[0].iconImage : "",
                    });
                // if (allAnswers.categoryAnswers.length === 0) {
                    
                // } else {
                    
                // }
                // console.log(category, 'all category')
                // return res.status(200).json({
                //     success: true,
                //     message: "Successfully Get Category",
                //     data: category
                // });
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Device-Id Does not Exist",
                    data: [],
                });
            }
            
        }

      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}

exports.getAllTestCategories = async (req, res, next) => {
    try {

        const body = req.query;
        const allCategories = await Categories.find({})
    
        if (allCategories.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Category Found",
                data: [],
            });
        } else {
            const deviceId = await TestAnswers.findOne({deviceId : body.deviceId}).populate('categoryAnswers.questionId')
            if (deviceId) {
                if (deviceId.categoryAnswers.length === 0) {
                    return res.status(200).json({
                        success: true,
                        message: "Successfully Get Categories",
                        data: allCategories,
                    });
                } else {
                    allCategories.forEach(async (category , index) => { // All Categories Loop
                        deviceId.categoryAnswers.forEach((eachQuestion) => { // Device Answer Question Loop
                            if (category._id.toString() === eachQuestion?.questionId?.categoryId.toString()) {
                                let trueCount = 0;
                                let falseCount = 0;
                                category.totalQuestions += eachQuestion.questionId.questions.length;
                                eachQuestion.answers.forEach(answer => {
                                    if (answer.isCorrect) {
                                      trueCount++;
                                    } else {
                                      falseCount++;
                                    }
                                  });
                                category.rights += trueCount;
                                category.wrongs += falseCount;
                                category.unanswered = category.totalQuestions - (category.rights + category.wrongs);
                            }
                        })
                    })   
                }
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Device-Id Does not Exist",
                    data: [],
                });
            }
            
        }

        if (!allCategories) {
          return next(new ErrorResponse("Category Getting Failed", 400));
        }
        return res.status(200).json({
          success: true,
          message: "Successfully Get Categories",
          data: allCategories,
        });
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}

exports.getCategories = async (req, res, next) => {
    try {

        const body = req.query;
        const allCategories = await Categories.find({})
    
        if (allCategories.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Category Found",
                data: [],
            });
        }

        
        if (!allCategories) {
          return next(new ErrorResponse("Category Getting Failed", 400));
        }
        return res.status(200).json({
          success: true,
          message: "Successfully Get Categories",
          data: allCategories,
        });
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}

exports.getAllStatisticesOfCategories = async (req, res, next) => {
    try {

        const body = req.query;
        const allCategories = await Categories.find({});
        let overallToalQuestion = 0; 
        let overallRightQuestion = 0; 
        let overallWrongQuestion = 0; 
        let overallUnansweredQuestion = 0; 
        let overallRightPercentageQuestion = 0; 
        let overallWrongPercentageQuestion = 0; 
        let overallUnansweredPercentageQuestion = 0; 
        let overallToalPercentageQuestion = 0; 
        let overall = {};

        if (allCategories.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Category Found",
                data: [],
            });
        } else {
            const deviceId = await Answers.findOne({deviceId : body.deviceId}).populate('categoryAnswers.questionId')
            if (deviceId) {
                if (deviceId.categoryAnswers.length === 0) {

                    overall = {
                        overallToalQuestion : 0,
                        overallRightQuestion: 0,
                        overallWrongQuestion: 0,
                        overallUnansweredQuestion: 0,
                        overallRightPercentageQuestion: 0,
                        overallWrongPercentageQuestion: 0,
                        overallUnansweredPercentageQuestion: 0,
                        overallToalPercentageQuestion: 0,
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Successfully Get Categories",
                        data: {
                            categories: allCategories,
                            overall: overall
                        },
                    });
                } else {
                    allCategories.forEach(async (category , index) => { // All Categories Loop
                        deviceId.categoryAnswers.forEach((eachQuestion) => { // Device Answer Question Loop
                            if (category._id.toString() === eachQuestion?.questionId?.categoryId.toString()) {
                                let trueCount = 0;
                                let falseCount = 0;
                                category.totalQuestions += eachQuestion.questionId.questions.length;
                                eachQuestion.answers.forEach(answer => {
                                    if (answer.isCorrect) {
                                      trueCount++;
                                    } else {
                                      falseCount++;
                                    }
                                  });
                                category.rights += trueCount;
                                category.wrongs += falseCount;
                                category.unanswered = category.totalQuestions - (category.rights + category.wrongs);

                                const rightPercentage = (category.rights / category.totalQuestions) * 100;
                                const wrongPercentage = (category.wrongs / category.totalQuestions) * 100;
                                const unansweredPercentage = (category.unanswered / category.totalQuestions) * 100;
                                const totalPercentage = unansweredPercentage;

                                category.rightPercentage = Math.round(rightPercentage);
                                category.wrongPercentage = Math.round(wrongPercentage);
                                category.unansweredPercentage = Math.round(unansweredPercentage);
                                category.totalPercentage = Math.round(totalPercentage);

                                // Calculate Overall Questions in Categories

                                overallToalQuestion += Math.round(category.totalQuestions) ;
                                overallRightQuestion += Math.round(category.rights);
                                overallWrongQuestion += Math.round(category.wrongs);
                                overallUnansweredQuestion += Math.round(category.unanswered);
                            }
                            
                        })
                    })
                    // Calculate overall percentages
                    const overallRightPercentage = (overallRightQuestion / overallToalQuestion) * 100;
                    const overallWrongPercentage = (overallWrongQuestion / overallToalQuestion) * 100;
                    const overallUnansweredPercentage = (overallUnansweredQuestion / overallToalQuestion) * 100;
                    const overallTotalPercentage = overallUnansweredPercentage;

                    overallRightPercentageQuestion = Math.round(overallRightPercentage);
                    overallWrongPercentageQuestion = Math.round(overallWrongPercentage);
                    overallUnansweredPercentageQuestion = Math.round(overallUnansweredPercentage);
                    overallToalPercentageQuestion = Math.round(overallTotalPercentage);

                    // Assign the calculated values to the overall object
                    overall = {
                        overallToalQuestion,
                        overallRightQuestion,
                        overallWrongQuestion,
                        overallUnansweredQuestion,
                        overallRightPercentageQuestion,
                        overallWrongPercentageQuestion,
                        overallUnansweredPercentageQuestion,
                        overallToalPercentageQuestion,
                    };
                }
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Device-Id Does not Exist",
                    data: [],
                });
            }
            
        }

        if (!allCategories) {
          return next(new ErrorResponse("Category Getting Failed", 400));
        }

        return res.status(200).json({
          success: true,
          message: "Successfully Get Categories",
            data: {
                categories: allCategories,
                overall: overall
            },
        });
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}

exports.getAllStatisticesOfTestCategories = async (req, res, next) => {
    try {

        const body = req.query;
        const allCategories = await Categories.find({});
        let overallToalQuestion = 0; 
        let overallRightQuestion = 0; 
        let overallWrongQuestion = 0; 
        let overallUnansweredQuestion = 0; 
        let overallRightPercentageQuestion = 0; 
        let overallWrongPercentageQuestion = 0; 
        let overallUnansweredPercentageQuestion = 0; 
        let overallToalPercentageQuestion = 0; 
        let overall = {};

        if (allCategories.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Category Found",
                data: [],
            });
        } else {
            const deviceId = await TestAnswers.findOne({deviceId : body.deviceId}).populate('categoryAnswers.questionId')
            if (deviceId) {
                if (deviceId.categoryAnswers.length === 0) {

                    overall = {
                        overallToalQuestion : 0,
                        overallRightQuestion: 0,
                        overallWrongQuestion: 0,
                        overallUnansweredQuestion: 0,
                        overallRightPercentageQuestion: 0,
                        overallWrongPercentageQuestion: 0,
                        overallUnansweredPercentageQuestion: 0,
                        overallToalPercentageQuestion: 0,
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Successfully Get Categories",
                        data: {
                            categories: allCategories,
                            overall: overall
                        },
                    });
                } else {
                    allCategories.forEach(async (category , index) => { // All Categories Loop
                        deviceId.categoryAnswers.forEach((eachQuestion) => { // Device Answer Question Loop
                            if (category._id.toString() === eachQuestion?.questionId?.categoryId.toString()) {
                                let trueCount = 0;
                                let falseCount = 0;
                                category.totalQuestions += eachQuestion.questionId.questions.length;
                                eachQuestion.answers.forEach(answer => {
                                    if (answer.isCorrect) {
                                      trueCount++;
                                    } else {
                                      falseCount++;
                                    }
                                  });
                                category.rights += trueCount;
                                category.wrongs += falseCount;
                                category.unanswered = category.totalQuestions - (category.rights + category.wrongs);

                                const rightPercentage = (category.rights / category.totalQuestions) * 100;
                                const wrongPercentage = (category.wrongs / category.totalQuestions) * 100;
                                const unansweredPercentage = (category.unanswered / category.totalQuestions) * 100;
                                const totalPercentage = unansweredPercentage;

                                category.rightPercentage = rightPercentage;
                                category.wrongPercentage = wrongPercentage;
                                category.unansweredPercentage = unansweredPercentage;
                                category.totalPercentage = totalPercentage;

                                // Calculate Overall Questions in Categories

                                overallToalQuestion += category.totalQuestions;
                                overallRightQuestion += category.rights;
                                overallWrongQuestion += category.wrongs;
                                overallUnansweredQuestion += category.unanswered;
                            }
                            
                        })
                    })
                    // Calculate overall percentages
                    const overallRightPercentage = (overallRightQuestion / overallToalQuestion) * 100;
                    const overallWrongPercentage = (overallWrongQuestion / overallToalQuestion) * 100;
                    const overallUnansweredPercentage = (overallUnansweredQuestion / overallToalQuestion) * 100;
                    const overallTotalPercentage = overallUnansweredPercentage;

                    overallRightPercentageQuestion = overallRightPercentage;
                    overallWrongPercentageQuestion = overallWrongPercentage;
                    overallUnansweredPercentageQuestion = overallUnansweredPercentage;
                    overallToalPercentageQuestion = overallTotalPercentage;

                    // Assign the calculated values to the overall object
                    overall = {
                        overallToalQuestion,
                        overallRightQuestion,
                        overallWrongQuestion,
                        overallUnansweredQuestion,
                        overallRightPercentageQuestion,
                        overallWrongPercentageQuestion,
                        overallUnansweredPercentageQuestion,
                        overallToalPercentageQuestion,
                    };
                }
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Device-Id Does not Exist",
                    data: [],
                });
            }
            
        }

        if (!allCategories) {
          return next(new ErrorResponse("Category Getting Failed", 400));
        }

        return res.status(200).json({
          success: true,
          message: "Successfully Get Categories",
            data: {
                categories: allCategories,
                overall: overall
            },
        });
      } catch (err) {
        return next(new ErrorResponse(err, 400));
      }
}

exports.getSingleBrand = async (req, res, next) => {
    console.log(req.query.brand , "Single Brand")
    try {
        const Categories = await Category.findOne({'brand' : req.query.brand})
        console.log(Categories)
        if (Categories.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No Category found'
            })
        }
        return res.status(200).json({
            success: true,
            data: Categories,
            message: "Categories found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}

exports.getAllProductsClientSide = async (req, res, next) => {
    try {
        const products = await Product.find({})
        if (products.length <= 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No products found'
            })
        }
        let resArray = []
        products.forEach(element => {
            let newObj = {
                category: element.category,
                item: element
            }
            resArray.push(newObj)
        });
        return res.status(200).json({
            success: true,
            data: resArray,
            message: "Products found"
        })
    }
    catch (err) {
        return next(new ErrorResponse(err, 400))
    }
}

exports.deleteCategories = async (req, res, next) => {
    try {
    
        const deletedProducts = await Categories.deleteOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        
        if (deletedProducts?.deletedCount === 1) {
            await Answers.find({}, async (err, allAnswers) => {
                if (err) {
                    return next(new ErrorResponse(err, 400))
                } else {
                    try {
                        for (let answer of allAnswers) {
                          answer.categoryAnswers = answer.categoryAnswers.filter(
                            (categoryAnswer) =>
                              categoryAnswer.categoryId.toString() !== req.query.id.toString()
                          );
                          await answer.save();
                        }
                  
                        const deletedQuestion = await Question.deleteOne({ categoryId: mongoose.Types.ObjectId(req.query.id) })      

                        if (deletedQuestion?.deletedCount === 1) { 
                            return res.status(200).json({
                                success: true,
                                message: "Deleted Successfully",
                                data: null,
                            });
                        } else {
                            return res.status(200).json({
                                success: true,
                                message: "Deleted Successfully",
                                data: null,
                            });
                        }
                      } catch (error) {
                        return next(new ErrorResponse(error, 500));
                      }
                }
            })
        }
        else {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'deletion failed'
            })
        }
    
      }
      catch (err) {
          return next(new ErrorResponse(err, 400))
      }
}





