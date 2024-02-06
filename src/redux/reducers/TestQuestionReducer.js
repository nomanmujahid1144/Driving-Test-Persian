import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    question: {},
    questions: [],
    engQuestions: {
        questions: [],
        category: {},
        id : ''
    },
    perQuestions: {
        questions: [],
        category: {},
        id : ''
    },
};

const testQuestionReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.ADD_TEST_CATEGORY_QUESTIONS: {
            return {
                ...state,
                questions: action.payload,
            };
        }
        case ACTION_TYPES.ADD_TEST_PERSIAN_CATEGORY_QUESTIONS: {
            return {
                ...state,
                questions: action.payload,
            };
        }
        case ACTION_TYPES.GET_TEST_ENG_CATEGORY_QUESTIONS: {
            return {
                ...state,
                engQuestions: action.payload,
            };
        }
        case ACTION_TYPES.GET_TEST_PER_CATEGORY_QUESTIONS: {
            return {
                ...state,
                perQuestions: action.payload,
            };
        }
        case ACTION_TYPES.DELETE_TEST_CATEGORY_QUESTIONS: {
            return {
                ...state,
                engQuestions: state.engQuestions.questions.filter(
                    (product) => !action.payload.includes(product._id)
                ),
            };
        }
        default: {
            return state;
        }
    }
};
export default testQuestionReducer;