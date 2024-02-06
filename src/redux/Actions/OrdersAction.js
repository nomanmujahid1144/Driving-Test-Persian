import  {axiosInstance}  from '../../constants/axiosInstance';
import { ACTION_TYPES } from '../ActionTypes/ActionTypes';
import { selectProgressBarState } from './ProgressBarActions';

export const getOrdersById = (orderId) => {
    return async (dispatch) => {
        dispatch(selectProgressBarState(true))
        const res = await axiosInstance.get('/api/v1/order/getOrderById' , {
            params: { showDetails: orderId }
        })
        console.log(res  ,'res' )
        if (res.data.success === true) {
            dispatch(selectProgressBarState(false))
            dispatch({
                type: ACTION_TYPES.GET_ORDER_BY_ID,
                payload: res.data.data
            })
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('No Order Found')
            dispatch({
                type: ACTION_TYPES.GET_ORDER_BY_ID,
                payload: []
            })
        }
    }
}


