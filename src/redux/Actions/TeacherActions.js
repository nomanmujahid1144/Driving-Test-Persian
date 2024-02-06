import { axiosInstance } from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';

export const addTeacher = (values, formData, navigate, alert, setIsOpen) => {

    return async (dispatch) => {

        const res = await axiosInstance.post('/api/v1/teacher/addteacher', formData, {
            params: {
                values : JSON.stringify(values)
            }
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {
            alert.show('Teacher added successfully', {
                onClose: () => {
                    setIsOpen(false)
                    navigate('/teachers')

                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate('/teachers')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.SET_TEACHER,
                payload: res.data.data
            })
        }
        else {
            alert.show('error while adding teacher')
        }
    }
}


export const updateTeacher = (values, formData, navigate, alert, setIsOpen ) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        
        const res = await axiosInstance.patch('/api/v1/teacher/updateteacher', formData, {
            params: {
                values : JSON.stringify(values),
                id: global.editId
            }
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            alert.show('Teacher updated successfully', {
                onClose: () => {
                    setIsOpen(false)
                    navigate('/teachers')

                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate('/teachers')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.UPDATE_TEACHERS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('error while updating Teacher')
        }
    }
}

export const getTeachers = () => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/teacher/getteachers')
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_TEACHERS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('No Teacher Found')
            dispatch({
                type: ACTION_TYPES.GET_TEACHERS,
                payload: []
            })
        }
    }
}


export const deleteTeachers = (id, navigate, alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.delete('/api/v1/teacher/deleteteachers', {
            params: {
                IDS: id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.DELETE_TEACHERS,
                payload: id
            })
            alert.show('deleted successfully', {
                onClose: () => {
                    navigate('/teachers')
                }
            })
            setTimeout(() => {
                navigate('/teachers')
            }, 5000)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error in deletion')
        }
    }
}