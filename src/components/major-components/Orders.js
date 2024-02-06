import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../constants/axiosInstance'
import { Table } from '../minor-components/Table'
import { Loader } from '../minor-components/Loader'
import { useSelector, useDispatch } from "react-redux"
import io from 'socket.io-client';
import { selectProgressBarState } from '../../redux/Actions/ProgressBarActions'



const ordersColumns = [
    "Order ID",
    "Product Name",
    "Product Qty.",
    "Total Price",
    // "City",
    "Address",
    "User Name",
    "User Email",
    "User Phone No.",

]
export const Orders = () => {
    const token = useSelector(
        (state) => state.ProfileReducer
    );
    const [forceReload, setForceReload] = useState(false)
    const [pendingOrders, setPendingOrders] = useState([])
    const [approvedOrders, setApprovedOrders] = useState([])
    const [acceptedOrders, setAcceptedOrders] = useState([])
    const [completedOrders, setCompletedOrders] = useState([])
    
    const dispatch = useDispatch()
    const loading = useSelector(
        (state) => state.ProgressBarReducer
        );
    useEffect(() => {
        if (token) {
            getAllOrders()
        }
    }, [forceReload, token ])

    useEffect(() => {
        const socket = io(process.env.NODE_LOCAL_SERVER);
        socket.on('newOrder', () => {
            setForceReload(!forceReload)
        });
      }, []);
    

    const getAllOrders = async () => {
        dispatch(selectProgressBarState(true))
        const orders = await axiosInstance.get(`/api/v1/order/getallordersadmin`, {
            headers: {
                "Authorization": token
            }
        })
        if (orders.data.success) {
            let filteredData = orders?.data?.data?.pendingOrder.map((item) => {
                console.log(item , 'item')
                return {
                    id: item._id,
                    orderId : item.orderid,
                    productName: item.details.map((item2) => {
                        return item2.productId.name
                    }).join(" / "),
                    productQuantity: item.details.map((item2) => {
                        return item2.quantity
                    }).join(' / '),
                    totalPrice: item.totalPrice,
                    // city: item.city,
                    address: item.address,
                    userName: item.userId.fullName,
                    userEmail: item.userId.email,
                    userPhoneNumber: item.userId.phoneNumber,
                }
            })
            setPendingOrders(filteredData)
            let filteredDataApproved = orders?.data?.data?.approvedOrder.map((item) => {
                return {
                    id: item._id,
                    orderId : item.orderid,
                    productName: item.details.map((item2) => {
                        return item2.productId.name
                    }).join(" / "),
                    productQuantity: item.details.map((item2) => {
                        return item2.quantity
                    }).join(' / '),
                    totalPrice: item.totalPrice,
                    // city: item.city,
                    address: item.address,
                    userName: item.userId.fullName,
                    userEmail: item.userId.email,
                    userPhoneNumber: item.userId.phoneNumber,
                    drivers : item.drivers
                }
            })
            setApprovedOrders(filteredDataApproved)
            let filteredDataAccepted = orders?.data?.data?.acceptedOrder.map((item) => {
                return {
                    id: item._id,
                    orderId : item.orderid,
                    productName: item.details.map((item2) => {
                        return item2.productId.name
                    }).join(" / "),
                    productQuantity: item.details.map((item2) => {
                        return item2.quantity
                    }).join(' / '),
                    totalPrice: item.totalPrice,
                    // city: item.city,
                    address: item.address,
                    userName: item.userId.fullName,
                    userEmail: item.userId.email,
                    userPhoneNumber: item.userId.phoneNumber,
                }
            })
            setAcceptedOrders(filteredDataAccepted)
            let filteredDataCompleted = orders?.data?.data?.completedOrder.map((item) => {
                return {
                    id: item._id,
                    orderId : item.orderid,
                    productName: item.details.map((item2) => {
                        return item2.productId.name
                    }).join(" / "),
                    productQuantity: item.details.map((item2) => {
                        return item2.quantity
                    }).join(' / '),
                    totalPrice: item.totalPrice,
                    // city: item.city,
                    address: item.address,
                    userName: item.userId.fullName,
                    userEmail: item.userId.email,
                    userPhoneNumber: item.userId.phoneNumber,
                }
            })
            setCompletedOrders(filteredDataCompleted)
            dispatch(selectProgressBarState(false))
        }
        else {
            dispatch(selectProgressBarState(false))
        }

    }
    return (
        <>
            <div className={`py-8 bg-gray-50 min-h-screen`}>
                <div className={`bg-gray-50 ml-[20%]  w-[78%] mt-24 `}>
                    {/* {!loading ? ( */}
                        <div className="bg-gray-50">
                            <div className=" mt-12">
                                <div className='flex flex-col '>
                                    {pendingOrders.length !== 0  ?
                                        <Table type={"orders"} title={"Pending Orders"} forceReload={forceReload} setForceReload={setForceReload} pendingOrders={true} ordersColumns={ordersColumns} ordersData={pendingOrders} /> :
                                        <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                                            <div className='px-5 pt-4  h-10 my-0 flex flex-col items-start justify-between'>
                                                <h2 className='font-semibold text-gray-800 text-lg'>Pending Orders</h2>
                                                <p className='text-xs'>Details</p>
                                            </div>
                                            <div className="flex justify-center items-center py-8 text-lg">No Orders Found</div>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className=" mt-12">
                                <div className='flex flex-col '>
                                    {approvedOrders.length !== 0 ?
                                        <Table type={"orders"} title={"Approved Orders"}  approvedOrders={true} setForceReload={setForceReload} ordersColumns={ordersColumns} ordersData={approvedOrders} /> :
                                        <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                                            <div className='px-5 pt-4  h-10 my-0 flex flex-col items-start justify-between'>
                                                <h2 className='font-semibold text-gray-800 text-lg'>Approved Orders</h2>
                                                <p className='text-xs'>Details</p>
                                            </div>
                                            <div className="flex justify-center items-center py-8 text-lg">No Orders Found</div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className=" mt-12">
                                <div className='flex flex-col '>
                                    {acceptedOrders.length !== 0 ?
                                        <Table type={"orders"} title={"Accepted Orders"} ordersColumns={ordersColumns} ordersData={acceptedOrders} /> :
                                        <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                                            <div className='px-5 pt-4  h-10 my-0 flex flex-col items-start justify-between'>
                                                <h2 className='font-semibold text-gray-800 text-lg'>Accepted Orders</h2>
                                                <p className='text-xs'>Details</p>
                                            </div>
                                            <div className="flex justify-center items-center py-8 text-lg">No Orders Found</div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className=" mt-12">
                                <div className='flex flex-col '>
                                    {completedOrders.length !== 0 ?
                                        <Table type={"orders"} title={"Completed Orders"} ordersColumns={ordersColumns} ordersData={completedOrders} /> :
                                        <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                                            <div className='px-5 pt-4  h-10 my-0 flex flex-col items-start justify-between'>
                                                <h2 className='font-semibold text-gray-800 text-lg'>Completed Orders</h2>
                                                <p className='text-xs'>Details</p>
                                            </div>
                                            <div className="flex justify-center items-center py-8 text-lg">No Orders Found</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                    {/* ) : (
                        <Loader />
                    )} */}
                </div>
            </div>
        </>

    )
}
