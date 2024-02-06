import { axiosInstance } from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';

export const addTipsIcon = (values, formData, navigate, alert, setIsOpen, setUploadProgress) => {

    return async (dispatch) => {
        console.log(values , 'Values')
        console.log(formData, 'formData')
        const res = await axiosInstance.post('/api/v1/tips/addtipsicon', formData, {
            params: {
                values : JSON.stringify(values)
            },
            onUploadProgress: (progressEvent) => {
                const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                setUploadProgress(percentage);
            }
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {
            alert.show('Tips Icon added successfully', {
                onClose: () => {
                    setIsOpen(false)
                    navigate('/useful-tips')

                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate('/useful-tips')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.SET_USEFUL_TIPS,
                payload: res.data.data
            })
        }
        else {
            alert.show('error while adding tips')
        }
    }
}
export const getTipsIcon = () => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/tips/gettipsicon')
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_USEFUL_TIPS_ICON,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            // alert.show('No Category Found')
            dispatch({
                type: ACTION_TYPES.GET_USEFUL_TIPS_ICON,
                payload: []
            })
        }
    }
}
export const deleteTipIcon = (id, navigate, alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.delete('/api/v1/tips/deletetipicon', {
            params: {
                id : id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            alert.show('successfully Deleted Tip Icon', {
                onClose: () => {
                    navigate('/useful-tips')
                }
            })
            setTimeout(() => {
                navigate('/useful-tips')
            }, 5000)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error in deletion')
        }
    }
}


export const addTips = (values, formData, navigate, alert, setIsOpen, setUploadProgress) => {

    return async (dispatch) => {
        console.log(values , 'Values')
        console.log(formData, 'formData')
        const res = await axiosInstance.post('/api/v1/tips/addtips', formData, {
            params: {
                values : JSON.stringify(values)
            },
            onUploadProgress: (progressEvent) => {
                const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                setUploadProgress(percentage);
            }
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {
            alert.show('Tips added successfully', {
                onClose: () => {
                    setIsOpen(false)
                    navigate('/useful-tips')

                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate('/useful-tips')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.SET_USEFUL_TIPS,
                payload: res.data.data
            })
        }
        else {
            alert.show('error while adding tips')
        }
    }
}

export const getAllTips = () => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/tips/getalltips')
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_USEFUL_TIPS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            // alert.show('No Category Found')
            dispatch({
                type: ACTION_TYPES.GET_USEFUL_TIPS,
                payload: []
            })
        }
    }
}

export const deleteTip = (id, navigate, alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.delete('/api/v1/tips/deletetip', {
            params: {
                id : id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            alert.show('successfully Deleted Tip', {
                onClose: () => {
                    navigate('/useful-tips')
                }
            })
            setTimeout(() => {
                navigate('/useful-tips')
            }, 5000)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error in deletion')
        }
    }
}
