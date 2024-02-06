import { ActionsTable } from "../minor-components/ActionsTable"
import { useEffect, useState, useMemo } from "react"
import { getUnApprovedUsers , getDeactivateUsers } from "../../redux/Actions/UserActions"
import { useSelector, useDispatch } from "react-redux"
import { Modal } from "../minor-components/Modal"
import { Loader } from "../minor-components/Loader"


const unApprovedUsers = [
    'Photo',
    'Name',
    'Email',
    'Phone Number',
    'Deactivate',
    'Verified',
    'Blocked',
    'Actions',
    'Details'

]

const deActivateUsers = [
    'Photo',
    'Name',
    'Email',
    'Phone Number',
    'Deactivate',
    'Actions',
    'Details'

]

export const Users = () => {
    const dispatch = useDispatch()


    const { unapprovedUser } = useSelector(
        (state) => state.userReducer
    );
    const { deactivateUser } = useSelector(
        (state) => state.userReducer
    );
    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );
   
    useEffect(() => {
        dispatch(getUnApprovedUsers())
        dispatch(getDeactivateUsers())
    }, [])


    return (
        <>
            <div className="bg-gray-50   z-0">
                {!loading ? (
                    <>
                        <div className=" mt-24 bg-gray-50 ml-[20%]  w-[78%]">
                            {
                                unapprovedUser?.length === 0 ? (
                                    <div className="flex justify-center items-center py-8 text-lg">No User Found</div>
                                )
                                    : (
                                        <ActionsTable type='Users' isUser={true} tableColumnsReal={unApprovedUsers} key={parseInt(Math.random() * 10000)} tableDataReal={unapprovedUser} />
                                    )
                            }
                        </div>
                        {/* <div className=" mt-24 bg-gray-50 ml-[20%]  w-[78%]">
                            {
                                deactivateUser?.length === 0 ? (
                                    <div className="flex justify-center items-center py-8 text-lg">No User Found</div>
                                )
                                    : (
                                        <ActionsTable type='Deactivate Users' isUser={true} tableColumnsReal={deActivateUsers} key={parseInt(Math.random() * 10000)} tableDataReal={deactivateUser} />
                                    )
                            }
                        </div> */}
                    </>
                ) : (
                    <Loader />
                )}

            </div>
        </>
    )
}