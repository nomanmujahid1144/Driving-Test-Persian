import { useEffect, useState } from "react";
import { OrderAlert } from "./OrderAlert";
import io from 'socket.io-client';
import { useAlert } from 'react-alert'
import { useDispatch } from 'react-redux'
import { axiosInstance } from "../../constants/axiosInstance";
import { selectProgressBarState } from '../../redux/Actions/ProgressBarActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import playAlert from "alert-sound-notify";

export const Layout = (props) => {
    const dispatch = useDispatch()
    const alert = useAlert()
    
    
    const [notificationAlert , setShowNotificationAlert] = useState(false)
    const [order , setorder] = useState()
    
    useEffect(() => {
        // const socket = io('http://localhost:8080');
        // const socket = io('https://codebreakers.online');
        socket.on('newOrder', (orderDetails) => {
            setorder(orderDetails.newOrder)
            setShowNotificationAlert(true)
            playAlert('purr')
            playAlert.volume(0.5)
        });
    }, [])



    


    const updateOrderStatus =async () => {
        dispatch(selectProgressBarState(true))
        const updatedOrder = await axiosInstance.patch('api/v1/order/updateorderstatusadmin',{status:1},{params:{
            orderId: order._id
        }})
        if(updatedOrder.data.success){
            dispatch(selectProgressBarState(false))
            setShowNotificationAlert(false)
            alert.show('Order Updated Successfully')

        }
        else{
            dispatch(selectProgressBarState(false))
            alert.show('Failed to Update Order')
        }
    }

    const deleteOrderFromCart=async()=>{
        dispatch(selectProgressBarState(true))
        const deletedOrder = await axiosInstance.delete('api/v1/order/declineorder', {params:{
            orderId:order._id
        }})
        if(deletedOrder.data.success){
            dispatch(selectProgressBarState(false))
            setShowNotificationAlert(false)
            alert.show('Order Deleted Successfully')
        }
        else{
            dispatch(selectProgressBarState(false))
            alert.show('Failed to Deleted Order')
        }
    }

    const handleCross = () => {
        setShowNotificationAlert(false)
    }
  return (
    <>
        {notificationAlert ?
            <div className="fixed bottom-4 z-50 right-4 w-96 p-4 rounded-lg bg-myBg text-black">
                <div className="font-bold flex justify-between text-lg mb-2">
                    <span className="">
                        <FontAwesomeIcon className="pr-1 bell" icon="fa-solid fa-bell" size="sm" />
                        <span>Alert</span>
                    </span>
                    <span>ID: {order.orderid}</span>
                    <span onClick={handleCross} className='cursor-pointer'>
                        <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
                    </span>
                </div>
                <h6 className="mb-1">Order Summery</h6>
                <div className="rounded-xl px-2 py-4 border">
                    {order.details.map((product , index) => (
                        <div className="flex justify-between pb-3">
                            <span>{product.productId.name}</span>
                            <span>{product.quantity} qty</span>
                            <span>${product.productId.price}</span>
                        </div>
                    ))}
                    <div className="flex justify-between">
                        <span>Sub-Total</span><span>${order.subTotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Charges</span><span>${order.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total</span><span>${order.totalPrice}</span>
                    </div>
                </div>
                <h6 className="mb-1">Customer Detail</h6>
                <div className="rounded-xl px-2 py-4 border">
                        <p>{order.userId.fullName}</p>
                        <p>{order.userId.email}</p>
                        <p>{order.userId.phoneNumber}</p>
                        <p>{order.userId.formattedAddress}</p>
                </div>
                <h6 className="mb-1">Delivery Location</h6>
                <div className="rounded-xl px-2 py-4 border">
                        <p>{order.address}</p>
                </div>
                <div className="flex justify-end py-3">
                    <button onClick={deleteOrderFromCart} className=" bg-gray-500   hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Decline
                    </button>
                    <button onClick={updateOrderStatus} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Approve
                    </button>
                </div>
            </div>

        : null}



        <div>
            {props.children}
        </div>
    </>
  );
};