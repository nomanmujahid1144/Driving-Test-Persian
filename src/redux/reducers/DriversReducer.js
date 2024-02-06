import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    unapprovedDrivers: [],
};

const DriversReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.GET_UNAPPROVED_DRIVERS: {
            return {
                ...state,
                unapprovedDrivers: action.payload,
            };
        }
        case ACTION_TYPES.UPDATE_DRIVER_STATUS: {
            return state
        }
        default: {
            return state;
        }
    }
};
export default DriversReducer;