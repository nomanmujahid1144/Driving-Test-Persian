import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    tipIcon: {},
    tip: {},
    tips: []
};

const usefulTipsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_USEFUL_TIPS: {
            return {
                ...state,
                tip: action.payload,
            };
        }
        case ACTION_TYPES.UPDATE_USEFUL_TIP: {
            return {
                ...state,
                tip: action.payload,
            };
        }
        case ACTION_TYPES.GET_USEFUL_TIPS: {
            return {
                ...state,
                tips: action.payload,
            };
        }
        case ACTION_TYPES.GET_USEFUL_TIPS_ICON: {
            return {
                ...state,
                tipIcon: action.payload,
            };
        }
        case ACTION_TYPES.DELETE_USEFUL_TIP: {
            return {
                ...state,
                tips: state.tips.filter(
                    (tip) => !action.payload.includes(tip._id)
                ),
            };
        }
        default: {
            return state;
        }
    }
};
export default usefulTipsReducer;