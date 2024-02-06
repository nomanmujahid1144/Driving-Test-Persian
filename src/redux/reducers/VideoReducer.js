import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    video: {},
    videos: []
};

const videoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_VIDEO: {
            return {
                ...state,
                video: action.payload,
            };
        }
        case ACTION_TYPES.UPDATE_VIDEO: {
            return {
                ...state,
                video: action.payload,
            };
        }
        case ACTION_TYPES.GET_VIDEOS: {
            return {
                ...state,
                videos: action.payload,
            };
        }
        case ACTION_TYPES.DELETE_VIDEOS: {
            return {
                ...state,
                videos: state.videos.filter(
                    (video) => !action.payload.includes(video._id)
                ),
            };
        }
        default: {
            return state;
        }
    }
};
export default videoReducer;