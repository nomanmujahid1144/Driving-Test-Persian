import { axiosInstance } from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';

export const addQuestions = (values, formData, navigate, alert, setIsOpen , id, setUploadProgress) => {

    return async (dispatch) => {
        // dispatch(selectProgressBarState(true))

        const res = await axiosInstance.post('/api/v1/question/addquestions', formData, {
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
            // dispatch(selectProgressBarState(false))
            setIsOpen(false)
            if (values.languageType === 'English') {
                alert.show('Question added successfully', {
                    onClose: () => {
                        navigate(`/questions/${id}/english`)
                    }
                })
                setTimeout(() => {
                    navigate(`/questions/${id}/english`)
                }, 5000)
            } else {
                alert.show('Question added successfully', {
                    onClose: () => {
                        navigate(`/questions/${id}/persian`)
                    }
                })
                setTimeout(() => {
                    navigate(`/questions/${id}/persian`)
                }, 5000)
            }
            dispatch({
                type: ACTION_TYPES.ADD_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            // dispatch(selectProgressBarState(false))
            alert.show('Error while adding Question')
        }
    }
}
export const addQuestionsPersian = (values, formData, navigate, alert, setIsOpen , id) => {

    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.post('/api/v1/question/addpersianquestions', formData, {
            params: {
                values : JSON.stringify(values)
            }
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            setIsOpen(false)
            alert.show('Question added successfully', {
                onClose: () => {
                    navigate(`/questions/${id}/persian`)
                }
            })
            setTimeout(() => {
                navigate(`/questions/${id}/persian`)
            }, 5000)
            dispatch({
                type: ACTION_TYPES.ADD_PERSIAN_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error while adding Blog')
        }
    }
}

export const updateQuestion = (values, formData, navigate, alert, setIsOpen , id, questionId, setUploadProgress) => {
    return async (dispatch) => {
        // dispatch(selectProgressBarState(true))
        const res = await axiosInstance.patch('/api/v1/question/updatequestion', formData, {
            params: {
                values : JSON.stringify(values),
                id: questionId,
                index : global.index
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
            // dispatch(selectProgressBarState(false))
            alert.show('Question updated successfully', {
                onClose: () => {
                    setIsOpen(false);
                    navigate(`/questions/${id}/english`);

                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate(`/questions/${id}/english`);

            }, 5000)
            dispatch({
                type: ACTION_TYPES.UPDATE_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            // dispatch(selectProgressBarState(false))
            alert.show('error while updating product')
        }
    }
}

export const getEngCategoryQuestions = (id , alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true));
        const res = await axiosInstance.get('/api/v1/question/getcategoryquestions', {
            params: {
                id : id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_ENG_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('No English Question Found')
            dispatch({
                type: ACTION_TYPES.GET_ENG_CATEGORY_QUESTIONS,
                payload: []
            })
        }
    }
}

export const getPerCategoryQuestions = (id , alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/question/getpersiancategoryquestions', {
            params: {
                id : id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_PER_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('No Persian Question Found')
            dispatch({
                type: ACTION_TYPES.GET_PER_CATEGORY_QUESTIONS,
                payload: []
            })
        }
    }
}

export const deleteQuestions = (ids, id, navigate, alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        console.log(ids)
        console.log(id)
        const res = await axiosInstance.delete('/api/v1/question/deleteQuestions', {
            params: {
                IDS: ids,
                id : id
            }
        })
        console.log(res.data)
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.DELETE_CATEGORY_QUESTIONS,
                payload: ids
            })
            alert.show('deleted successfully')
            // navigate(`/questions/${id}/english`);
            window.location.reload();
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error in deletion')
        }
    }
}