import productReducer from './ProductReducer'
import driversReducer from './DriversReducer'
import ProgressBarReducer from './ProgressBarReducer';
import ProfileReducer from './ProfileReducer';
import categoryReducer from './CategoryReducer';
import bannerReducer from './BannerReducer';
import userReducer from './UserReducers';
import blogReducer from './BlogReducer';
import orderReducer from './OrderReducer';
import questionReducer from './QuestionReducer';
import teacherReducer from './TeacherReducer';
import videoReducer from './VideoReducer';
import usefulTipsReducer from './UsefulTipsReducer';
import testQuestionReducer from './TestQuestionReducer';
import answerReducer from './AnswerReducer';
import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
const rootReducer = combineReducers({
    productReducer,
    driversReducer,
    ProgressBarReducer,
    ProfileReducer,
    categoryReducer,
    bannerReducer,
    questionReducer,
    userReducer,
    blogReducer,
    orderReducer,
    teacherReducer,
    videoReducer,
    usefulTipsReducer,
    testQuestionReducer,
    answerReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
export default store;