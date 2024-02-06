import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    answers: [],
};

const answerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.GET_ALL_DEVICES_DATA: {
            return {
                ...state,
                answers: action.payload,
            };
        }
        default: {
            return state;
        }
    }
};
export default answerReducer;