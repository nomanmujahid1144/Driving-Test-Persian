import { axiosInstance } from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';



export const getUnApprovedUsers = () => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/user/getallusers' , {
            headers:{
                "Authorization": localStorage.getItem('token')
            }
        })
        console.log(res.data.data , 'User found')
        if (res.data.success == true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_UNAPPROVED_USERS,
                payload: res.data.data
            })
        }
        else {
            // alert.show('No Un Approved Drivers Found')
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_UNAPPROVED_USERS,
                payload: []
            })
        }
    }
}
export const getDeactivateUsers = () => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/user/getdeactivateaccount' , {
            headers:{
                "Authorization": localStorage.getItem('token')
            }
        })
        if (res.data.success == true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_DEACTIVATE_USERS,
                payload: res.data.data
            })
        }
        else {
            // alert.show('No Un Approved Drivers Found')
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_DEACTIVATE_USERS,
                payload: []
            })
        }
    }
}
export const deactivateAccount = (args, alert, navigate, id) => {
    return async (dispatch) => {
        let res = ''
        if (args.checkDeactivate == 1 || args.checkDeactivate == 2) {
            res = await axiosInstance.patch('/api/v1/user/deactivateaccount', { deactivate : args.checkDeactivate == 1 ? 1 : 2 }, {
                params : {
                    id : id
                }
            })
        }
        if (res.data.success === true) {
            alert.show('Account status updated successfully', {
                onClose: () => {
                    navigate('/users')

                }
            })
            setTimeout(() => {
                navigate('/users')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.UPDATE_USER_STATUS,
                payload: res.data.data
            })
            dispatch(getUnApprovedUsers())
            dispatch(getDeactivateUsers())
        }
        else {
            alert.show('update failed')
            dispatch({
                type: ACTION_TYPES.UPDATE_USER_STATUS,
                payload: []
            })
        }
    }
}
export const updateUserStatus = (args, alert, navigate, id) => {
    console.log(args, " :agrs")
    return async (dispatch) => {
        let res = ''
        if (args.checkVerify === true) {
            res = await axiosInstance.patch('/api/v1/user/updateuserstatus', { verified: true }, {
                params : {
                    id : id
                }
            })
        }
        else if (args.checkBlock === false || args.checkBlock === true) {
            res = await axiosInstance.patch('/api/v1/user/updateuserstatus', { blocked: args.checkBlock ? true : false }, {
                params : {
                    id : id
                }
            })
        }
        if (res.data.success === true) {
            alert.show('User status updated successfully', {
                onClose: () => {
                    navigate('/users')

                }
            })
            setTimeout(() => {
                navigate('/users')

            }, 5000)
            dispatch({
                type: ACTION_TYPES.UPDATE_USER_STATUS,
                payload: res.data.data
            })
            dispatch(getUnApprovedUsers())
        }
        else {
            alert.show('update failed')
            dispatch({
                type: ACTION_TYPES.UPDATE_USER_STATUS,
                payload: []
            })
        }
    }
}
