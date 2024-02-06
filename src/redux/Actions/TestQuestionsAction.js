import { axiosInstance } from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';

export const addQuestions = (values, formData, navigate, alert, setIsOpen , id) => {

    return async (dispatch) => {
        dispatch(selectProgressBarState(true))

        const res = await axiosInstance.post('/api/v1/testQuestion/addquestions', formData, {
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
            if (values.languageType === 'English') {
                alert.show('Question added successfully', {
                    onClose: () => {
                        navigate(`/test-questions`)
                    }
                })
                setTimeout(() => {
                    navigate(`/test-questions`)
                }, 5000)
            } else {
                alert.show('Question added successfully', {
                    onClose: () => {
                        navigate(`/test-questions`)
                    }
                })
                setTimeout(() => {
                    navigate(`/test-questions`)
                }, 5000)
            }
            dispatch({
                type: ACTION_TYPES.ADD_TEST_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error while adding Blog')
        }
    }
}
export const addQuestionsPersian = (values, formData, navigate, alert, setIsOpen , id) => {

    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.post('/api/v1/testQuestion/addpersianquestions', formData, {
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
                    navigate(`/test-questions/${id}/persian`)
                }
            })
            setTimeout(() => {
                navigate(`/test-questions/${id}/persian`)
            }, 5000)
            dispatch({
                type: ACTION_TYPES.ADD_TEST_PERSIAN_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error while adding Blog')
        }
    }
}

export const updateQuestion = (values, formData, navigate, alert, setIsOpen , id, questionId) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.patch('/api/v1/testQuestion/updatequestion', formData, {
            params: {
                values : JSON.stringify(values),
                id: questionId,
                index : global.testEditId
            }
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            alert.show('Question updated successfully', {
                onClose: () => {
                    setIsOpen(false);
                    navigate(`/test-questions`);

                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate(`/test-questions`);

            }, 5000)
            dispatch({
                type: ACTION_TYPES.UPDATE_TEST_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('error while updating product')
        }
    }
}

export const getEngCategoryQuestions = (alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/testQuestion/getcategoryquestions')
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_TEST_ENG_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('No English Question Found')
            dispatch({
                type: ACTION_TYPES.GET_TEST_ENG_CATEGORY_QUESTIONS,
                payload: []
            })
        }
    }
}

export const getPerCategoryQuestions = (id , alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/testQuestion/getpersiancategoryquestions', {
            params: {
                id : id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_TEST_PER_CATEGORY_QUESTIONS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('No Persian Question Found')
            dispatch({
                type: ACTION_TYPES.GET_TEST_PER_CATEGORY_QUESTIONS,
                payload: []
            })
        }
    }
}

export const deleteTestQuestions = (id, navigate, alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.delete('/api/v1/testQuestion/deleteTestQuestions', {
            params: {
                IDS: id
            }
        })
        console.log(res, 'Response')
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.DELETE_TEST_CATEGORY_QUESTIONS,
                payload: id
            })
            alert.show('deleted successfully', {
                onClose: () => {
                    navigate('/test-questions')
                }
            })
            setTimeout(() => {
                navigate('/test-questions')
            }, 5000)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error in deletion')
        }
    }
}