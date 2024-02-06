import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    blog: {},
    blogs: []
};

const BlogReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_BLOG: {
            return {
                ...state,
                blog: action.payload,
            };
        }
        case ACTION_TYPES.GET_BLOGS: {
            return {
                ...state,
                blogs: action.payload,
            };
        }
        case ACTION_TYPES.GET_SINGLE_BLOG: {
            return {
                ...state,
                blog: action.payload,
            };
        }
        default: {
            return state;
        }
    }
};
export default BlogReducer;