import { GoogleMap, Marker } from "@react-google-maps/api";
import cannabisForm from '../../assets/cannabis-form.jpg'
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { axiosInstance } from "../../constants/axiosInstance"
import { getOrdersById } from "../../redux/Actions/OrdersAction";

const containerStyle = {
    width: '60vw',
    height: '70vh',
    marginTop: '40px',
    marginBottom: '40px',
    marginRight: 'auto',
    marginLeft: 'auto'
};

export const ViewDetails = ({ showDetails }) => {

    // const alert = useAlert()
    const dispatch = useDispatch()
    
    const { ordersById } = useSelector(
        (state) => state.orderReducer
    ) 

    useEffect(() => {
        dispatch(getOrdersById(showDetails.id));
    }, [])


    return (
        <>
            {showDetails ? (
                <>
                    <div class="w-full h-[85vh] p-7" >
                        <div style={{ scrollbarWidth: 'thin' }} className="container h-full mx-auto overflow-y-scroll">
                            <div className="flex justify-center">
                                {ordersById.length < 1 ? <h2>No Order Found</h2> :

                                    <div className="w-full flex flex-col">
                                        <div className="w-full xl:w-[100%] md:w-full bg-white rounded-lg ">
                                            <h3 className="pt-4 text-2xl mt-8 font-bold">User Detail</h3>
                                            <div className="bg-gray-100">
                                                <div className=" mx-auto my-5 p-5">
                                                    <div className="md:flex no-wrap md:-mx-2 ">
                                                        <div className="w-full md:w-9/12 mx-2 h-auto">
                                                            <div className="bg-white p-3 shadow-sm rounded-sm">
                                                                <div className="text-gray-700">
                                                                    <div className="grid md:grid-cols-2 text-sm">
                                                                        <div className="grid grid-cols-2">
                                                                            <div className="px-4 py-2 font-semibold">Name</div>
                                                                            <div className="px-4 py-2">{ordersById.userId.fullName}</div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2">
                                                                            <div className="px-4 py-2 font-semibold">Phone Number</div>
                                                                            <div className="px-4 py-2">{ordersById.userId.phoneNumber}</div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2">
                                                                            <div className="px-4 py-2 font-semibold">Email</div>
                                                                            <div className="px-4 py-2">{ordersById.userId.email}</div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2">
                                                                            <div className="px-4 py-2 font-semibold">Shop Address</div>
                                                                            <div className="px-4 py-2">{ordersById.restaurantID.formattedAddress}</div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2">
                                                                            <div className="px-4 py-2 font-semibold">Destination Address</div>
                                                                            <div className="px-4 py-2">{ordersById.address}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full xl:w-[100%] bg-white rounded-lg ">
                                            <h3 className="pt-4 text-2xl  mt-8 font-bold">Order Detail</h3>
                                            <div className=" ">
                                                <div className="border border-1 border-gray-400  bg-white rounded mt-4 p-4  justify-between leading-normal">
                                                    <div className="overflow-x-auto relative">
                                                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                            <thead className="text-xs text-gray-700 uppercase bg-myBg dark:bg-gray-700 dark:text-gray-400">
                                                                <tr>
                                                                    <th scope="col" className="py-3 px-6">
                                                                        ID
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-6">
                                                                        Product name
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-6">
                                                                        Product Price
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-6">
                                                                        Quantity
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-6">
                                                                        Total Price
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {console.log(ordersById, 'Orders')}
                                                                {ordersById.details.map((item, index) => (
                                                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                                        <td className="py-4 px-6">
                                                                            {index + 1}
                                                                        </td>
                                                                        <td className="py-4 px-6">
                                                                            {item.productId.name}
                                                                        </td>
                                                                        <td className="py-4 px-6">
                                                                            ${item.productId.price}
                                                                        </td>
                                                                        <td className="py-4 px-6">
                                                                            {item.quantity}
                                                                        </td>
                                                                        <td className="py-4 px-6">
                                                                            ${item.productId.price * item.quantity}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-right p-7">

                                            <h4>Sub Total :${ordersById.subTotal}</h4>
                                            <h4>Delivery Charges :${ordersById.deliveryFee}</h4>
                                            <h2>Grand Total :${ordersById.totalPrice}</h2>
                                        </div>

                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}

        </>

    )
}