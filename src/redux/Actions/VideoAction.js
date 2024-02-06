import { axiosInstance } from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';

export const addVideo = (values, formData, navigate, alert, setIsOpen, setUploadProgress) => {

    return async (dispatch) => {
        const res = await axiosInstance.post('/api/v1/video/addvideo', formData, {
            params: {
                values : JSON.stringify(values),
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

            alert.show('Video added successfully', {
                onClose: () => {
                    setIsOpen(false)
                    navigate('/videos')

                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate('/videos')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.SET_VIDEO,
                payload: res.data.data
            })
        }
        else {
            alert.show('error while adding video')
        }
    }
}

export const getVideos = () => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/video/getvideos')
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_VIDEOS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('No Video Found')
            dispatch({
                type: ACTION_TYPES.GET_VIDEOS,
                payload: []
            })
        }
    }
}


export const deleteVideo = (id, navigate, alert , isDeleted , setdeleteVideo) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.delete('/api/v1/video/deletevideo', {
            params: {
                id : id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            setdeleteVideo(!isDeleted)
            alert.show('successfully Deleted Blog', {
                onClose: () => {
                    navigate('/videos')
                }
            })
            setTimeout(() => {
                navigate('/videos')
            }, 5000)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error in deletion')
        }
    }
}
