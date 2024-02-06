
import { Menu, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import dropDown from '../../assets/down-arrow.svg'
import { useDispatch } from 'react-redux'
import { updateDriverStatus } from '../../redux/Actions/DriverActions'
import { updateUserStatus } from '../../redux/Actions/UserActions'
import { deactivateAccount } from '../../redux/Actions/UserActions'
import { deactivateDriverAccount } from '../../redux/Actions/DriverActions'
import { useAlert } from 'react-alert'
import { axiosInstance } from '../../constants/axiosInstance'
import { selectProgressBarState } from '../../redux/Actions/ProgressBarActions'
export const Dropdown = ({ verified, blocked, deactivate, id, isUser, orders, forceReload, setForceReload, manualOrderAccept }) => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const updateOrderStatus = async () => {
        dispatch(selectProgressBarState(true))
        const updatedOrder = await axiosInstance.patch('api/v1/order/updateorderstatusadmin', { status: 1 }, {
            params: {
                orderId: id
            }
        })
        if (updatedOrder.data.success) {
            dispatch(selectProgressBarState(false))
            alert.show('Order Updated Successfully')
            setForceReload(!forceReload)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Failed to Update Order')
        }
    }

    const modelPopUp = () => {
        setIsOpen(!isOpen)
    }

    const updateManualOrderStatus = async () => {
        dispatch(selectProgressBarState(true))
        const updatedOrder = await axiosInstance.patch('api/v1/order/updatemanualorderstatusadmin', { status: 5, manualOrderCompletestatus: 1 }, {
            params: {
                orderId: id
            }
        })
        if (updatedOrder.data.success) {
            dispatch(selectProgressBarState(false))
            alert.show('Order Updated Successfully')
            setForceReload(forceReload == forceReload ? forceReload : !forceReload)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Failed to Update Order')
        }
    }
    const deleteOrderFromCart = async () => {
        dispatch(selectProgressBarState(true))
        const deletedOrder = await axiosInstance.delete('api/v1/order/declineorder', {
            params: {
                orderId: id
            }
        })
        if (deletedOrder.data.success) {
            dispatch(selectProgressBarState(false))
            alert.show('Order Deleted Successfully')
            setForceReload(!forceReload)
        }
        else {
            dispatch(selectProgressBarState(false))
            alert.show('Failed to Deleted Order')
        }
    }
    return (
        <Menu className=''>
            {({ open }) => (
                <>
                    <Menu.Button ><img className={`w-[15px] cursor-pointer ${orders ? "mr-12" : null}`} src={dropDown} alt="drop down" /></Menu.Button>

                    {/* Use the Transition component. */}
                    <Transition
                        show={open}
                    // enter="transition duration-100 ease-out"
                    // enterFrom="transform scale-95 opacity-0"
                    // enterTo="transform scale-100 opacity-100"
                    // leave="transition duration-75 ease-out"
                    // leaveFrom="transform scale-100 opacity-100"
                    // leaveTo="transform scale-95 opacity-0"
                    >
                        {/* Mark this component as `static` */}
                        <Menu.Items static className='absolute top-18 left-[-45px] z-50 flex flex-col'>
                            {!orders ? (
                                <>
                                    {isUser ? (
                                        <>
                                            <Menu.Item>
                                                {({ active }) => (

                                                    <button
                                                        className={`py-2 px-4 no-underline border-1 ${verified ? 'hidden' : ''} ${active ? 'bg-myBg' : 'bg-gray-200'
                                                            }`}
                                                        onClick={() => dispatch(updateUserStatus({ checkVerify: true }, alert, navigate, id, dispatch))}
                                                    >
                                                        Verify User
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <>
                                                        <button
                                                            className={`py-2 px-4 no-underline  ${active ? 'bg-myBg' : 'bg-gray-200'}`}
                                                            onClick={(e) => dispatch(updateUserStatus({ checkBlock: blocked ? false : true }, alert, navigate, id, dispatch))}
                                                        >
                                                            {!blocked ? <p>Block User</p> : <p>Un-block User</p>}
                                                        </button>
                                                        <button
                                                            className={`py-2 px-4 no-underline  ${active ? 'bg-myBg' : 'bg-gray-200'}`}
                                                            onClick={(e) => dispatch(deactivateAccount({ checkDeactivate: deactivate == 1 ? 2 : 1 }, alert, navigate, id, dispatch))}
                                                        >
                                                            {deactivate == 1 ? <p>Deactivate User</p> : <p>Active User</p>}
                                                        </button>
                                                    </>
                                                )}
                                            </Menu.Item>
                                        </>
                                    ) : (
                                        <>
                                            <Menu.Item>
                                                {({ active }) => (

                                                    <button
                                                        className={`py-2 px-4 no-underline border-1 ${verified ? 'hidden' : ''} ${active ? 'bg-myBg' : 'bg-gray-200'
                                                            }`}
                                                        onClick={() => dispatch(updateDriverStatus({ checkVerify: true }, alert, navigate, id, dispatch))}
                                                    >
                                                        Verify Driver
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <>
                                                        <button
                                                            className={`py-2 px-4 no-underline  ${active ? 'bg-myBg' : 'bg-gray-200'
                                                                }`}
                                                            onClick={(e) => dispatch(updateDriverStatus({ checkBlock: blocked ? false : true }, alert, navigate, id, dispatch))}
                                                        >
                                                            {!blocked ? <p>Block Driver</p> : <p>Un-block Driver</p>}

                                                        </button>
                                                        <button
                                                            className={`py-2 px-4 no-underline  ${active ? 'bg-myBg' : 'bg-gray-200'}`}
                                                            onClick={(e) => dispatch(deactivateDriverAccount({ checkDeactivate: deactivate == 1 ? 2 : 1 }, alert, navigate, id, dispatch))}
                                                        >
                                                            {deactivate == 1 ? <p>Deactivate User</p> : <p>Active User</p>}
                                                        </button>
                                                    </>

                                                )}
                                            </Menu.Item>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    {manualOrderAccept == false && orders == true ? (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <>
                                                    <button
                                                        className={`py-2 px-4 no-underline  ${active ? 'bg-myBg' : 'bg-gray-200'}`}
                                                        onClick={modelPopUp}>
                                                        Order Complete

                                                    </button>
                                                    {isOpen ?
                                                        <div class="modal fixed left-0 top-0 flex h-full w-full items-center justify-center" >
                                                            <div class="modal-overlay absolute h-full w-full bg-gray-900 opacity-50"></div>
                                                            <div class="modal-container z-50 mx-auto w-5/12 overflow-y-auto rounded bg-white shadow-lg md:max-w-md">
                                                                <div class="modal-content px-6 py-4 text-left">
                                                                    <div class="flex items-center justify-between pb-3">
                                                                        <p class="text-2xl font-bold">Order Conformation</p>
                                                                        <button onClick={modelPopUp} class="modal-close z-50 cursor-pointer" onclick="closeModal()">
                                                                            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                                                <path d="M18 1.5L16.5 0L9 7.5L1.5 0L0 1.5L7.5 9L0 16.5L1.5 18L9 10.5L16.5 18L18 16.5L10.5 9L18 1.5Z"></path>
                                                                            </svg>
                                                                        </button>
                                                                    </div>

                                                                    <p>Do you want to Complete this Order.</p>
                                                                    <div class="flex justify-end pt-2">
                                                                        <button onClick={modelPopUp} class="modal-action-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="closeModal()">Cancel</button>
                                                                        <button onClick={updateManualOrderStatus} class="modal-action-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">Complete Order</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : (null)}
                                                </>
                                            )}
                                        </Menu.Item>
                                    ) : (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <>
                                                    <button
                                                        className={`py-2 px-4 no-underline  ${active ? 'bg-myBg' : 'bg-gray-200'
                                                            }`}
                                                        onClick={() => {
                                                            updateOrderStatus()
                                                        }}>
                                                        Approve Order

                                                    </button>
                                                    <button className={`py-2 px-4 no-underline z-10 ${active ? 'bg-myBg' : 'bg-gray-200'}`}
                                                        onClick={() => { deleteOrderFromCart() }}>
                                                        Decline Order
                                                    </button>
                                                </>
                                            )}
                                        </Menu.Item>
                                    )}
                                </>

                            )}


                        </Menu.Items>
                    </Transition>
                </>
            )
            }
        </Menu >
    )
}