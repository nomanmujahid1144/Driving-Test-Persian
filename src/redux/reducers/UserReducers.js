import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    unapprovedUser: [],
    deactivateUser: [],
};

const UsersReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.GET_UNAPPROVED_USERS: {
            return {
                ...state,
                unapprovedUser: action.payload,
            };
        }
        case ACTION_TYPES.GET_DEACTIVATE_USERS: {
            return {
                ...state,
                deactivateUser: action.payload,
            };
        }
        case ACTION_TYPES.UPDATE_USER_STATUS: {
            return state
        }
        default: {
            return state;
        }
    }
};
export default UsersReducer;