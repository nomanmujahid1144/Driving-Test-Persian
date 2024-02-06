import { axiosInstance } from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';

export const addBlog = (blogHeading , headerImage , navigate, alert , isOpen , setIsOpen) => {

    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.post('/api/v1/category/addcategory', {
            CategoryTitle: blogHeading,
            CategoryImage: headerImage,
        } , {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            setIsOpen(!isOpen)
            alert.show('Category added successfully', {
                onClose: () => {
                    navigate('/categories')
                }
            })
            setTimeout(() => {
                navigate('/categories')
            }, 5000)
            dispatch({
                type: ACTION_TYPES.SET_BLOG,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Error while adding Blog')
        }
    }
}

export const getBlogs = () => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/category/getcategories')
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_BLOGS,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('No Blog Found')
            dispatch({
                type: ACTION_TYPES.GET_BLOGS,
                payload: []
            })
        }
    }
}

export const deleteBlog = (id, navigate, alert , isOpen , setIsOpen) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.delete('/api/v1/category/deletecategories', {
            params: {
                id : id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            setIsOpen(!isOpen)
            alert.show('successfully Deleted Category', {
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

export const getBlogById= (id) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/blog/getblogbyid', {
            params: {
                id : id
            }
        })
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_SINGLE_BLOG,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('No Blog Found')
            dispatch({
                type: ACTION_TYPES.GET_SINGLE_BLOG,
                payload: []
            })
        }
    }
}