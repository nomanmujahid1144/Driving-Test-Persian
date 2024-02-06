import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    ordersById: [],
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.GET_ORDER_BY_ID: {
            return {
                ...state,
                ordersById : action.payload,
            };
        }
        default: {
            return state;
        }
    }
};
export default orderReducer;