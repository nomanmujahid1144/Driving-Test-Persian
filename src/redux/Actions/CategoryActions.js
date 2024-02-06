import { axiosInstance } from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';

export const addCategory = (values, formData, navigate, alert, setIsOpen) => {

    return async (dispatch) => {

        console.log(formData , 'Form Data')
        console.log(values , 'Form values')
        const res = await axiosInstance.post('/api/v1/category/addcategory', formData , {
            params: {
                values: JSON.stringify(values),
            }
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {

            alert.show('category added successfully', {
                onClose: () => {
                    setIsOpen(false)
                    navigate('/categories')
                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate('/categories')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.SET_CATEGORY,
                payload: res.data.data
            })
        }
        else {
            alert.show('error while adding category')
        }
    }
}


export const updateCategory = (values, formData, navigate, alert, setIsOpen) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.patch('/api/v1/category/updatecategory', formData, {
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
            alert.show('Category updated successfully', {
                onClose: () => {
                    setIsOpen(false)
                    // navigate('/main/products')
                    navigate('/categories')

                }
            })
            setTimeout(() => {
                setIsOpen(false)
                navigate('/categories')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.UPDATE_CATEGORY,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('error while updating category')
        }
    }
}

export const getCategories = () => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/category/getcategoriesall')
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_CATEGORIES,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            // alert.show('No Category Found')
            dispatch({
                type: ACTION_TYPES.GET_CATEGORIES,
                payload: []
            })
        }
    }
}

export const deleteCategory = (id, navigate, alert) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.delete('/api/v1/category/deletecategories', {
            params: {
                IDS: id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.DELETE_CATEGORIES,
                payload: id
            })
            alert.show('deleted successfully', {
                onClose: () => {
                    navigate('/categories')
                }
            })
            setTimeout(() => {
                navigate('/categories')
            }, 5000)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error in deletion')
        }
    }
}