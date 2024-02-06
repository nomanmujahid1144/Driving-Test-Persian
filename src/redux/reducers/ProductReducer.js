import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    product: {},
    products: []
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_PRODUCT: {
            return {
                ...state,
                product: action.payload,
            };
        }
        case ACTION_TYPES.UPDATE_PRODUCT: {
            return {
                ...state,
                product: action.payload,
            };
        }
        case ACTION_TYPES.GET_PRODUCTS: {
            return {
                ...state,
                products: action.payload,
            };
        }
        case ACTION_TYPES.DELETE_PRODUCTS: {
            return {
                ...state,
                products: state.products.filter(
                    (product) => !action.payload.includes(product._id)
                ),
            };
        }
        default: {
            return state;
        }
    }
};
export default productReducer;