import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

const initialState = {
    teacher: {},
    teachers: []
};

const teacherReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_TEACHER: {
            return {
                ...state,
                teacher: action.payload,
            };
        }
        case ACTION_TYPES.UPDATE_TEACHERS: {
            return {
                ...state,
                teacher: action.payload,
            };
        }
        case ACTION_TYPES.GET_TEACHERS: {
            return {
                ...state,
                teachers: action.payload,
            };
        }
        case ACTION_TYPES.DELETE_TEACHERS: {
            return {
                ...state,
                teachers: state.teachers.filter(
                    (teacher) => !action.payload.includes(teacher._id)
                ),
            };
        }
        default: {
            return state;
        }
    }
};
export default teacherReducer;