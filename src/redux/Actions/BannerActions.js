import { axiosInstance } from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';

export const addBanner = (values, formData, navigate, alert, setIsOpen) => {

    return async (dispatch) => {

        console.log(formData , 'Form Data')
        console.log(values , 'Form values')
        const res = await axiosInstance.post('/api/v1/banner/addbanner', formData , {
            params: {
                values: JSON.stringify(values),
            }
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {

            alert.show('Banner added successfully', {
                onClose: () => {
                    setIsOpen(false)
                    navigate('/add-banner')
                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate('/add-banner')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.SET_BANNER,
                payload: res.data.data
            })
        }
        else {
            alert.show('error while adding category')
        }
    }
}


export const updateBanner = (values, formData, navigate, alert, setIsOpen) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.patch('/api/v1/banner/updatebanner', formData, {
            params: {
                values : JSON.stringify(values),
                id: global.categoryEditId
            }
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            alert.show('Banner updated successfully', {
                onClose: () => {
                    setIsOpen(false)
                    navigate('/add-banner')

                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate('/add-banner')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.UPDATE_BANNER,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('error while updating banner')
        }
    }
}

export const getBanner = () => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/banner/getbanner')
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_BANNER,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            // alert.show('No Category Found')
            dispatch({
                type: ACTION_TYPES.GET_BANNER,
                payload: []
            })
        }
    }
}

export const deleteBanner = (id, navigate, alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.delete('/api/v1/banner/deletebanner', {
            params: {
                IDS: id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.DELETE_BANNER,
                payload: id
            })
            alert.show('deleted successfully', {
                onClose: () => {
                    navigate('/add-banner')
                }
            })
            setTimeout(() => {
                navigate('/add-banner')
            }, 5000)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error in deletion')
        }
    }
}