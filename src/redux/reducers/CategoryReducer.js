import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    category: {},
    categories: []
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_CATEGORY: {
            return {
                ...state,
                category: action.payload,
            };
        }
        case ACTION_TYPES.UPDATE_CATEGORY: {
            return {
                ...state,
                category: action.payload,
            };
        }
        case ACTION_TYPES.GET_CATEGORIES: {
            return {
                ...state,
                categories: action.payload,
            };
        }
        case ACTION_TYPES.DELETE_CATEGORIES: {
            return {
                ...state,
                categories: state.categories.filter(
                    (category) => !action.payload.includes(category._id)
                ),
            };
        }
        default: {
            return state;
        }
    }
};
export default categoryReducer;