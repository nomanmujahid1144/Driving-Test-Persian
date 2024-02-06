import { ActionsTable } from "../minor-components/ActionsTable"
import { useEffect } from "react"
import { getUnApprovedDrivers } from "../../redux/Actions/DriverActions"
import { useSelector, useDispatch } from "react-redux"
import { Loader } from "../minor-components/Loader"


const unApprovedDrivers = [
    'Photo',
    'Name',
    'Email',
    'Phone Number',
    'Driving License',
    'Deactivate',
    'Verified',
    'Blocked',
    'Actions'

]
export const Drivers = () => {
    const dispatch = useDispatch()


    const { unapprovedDrivers } = useSelector(
        (state) => state.driversReducer
    );
    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );
   
    useEffect(() => {
        dispatch(getUnApprovedDrivers())
    }, [])


    return (
        <>
            <div className="bg-gray-50   z-0">
                {!loading ? (
                    <div className=" mt-24 bg-gray-50 ml-[20%]  w-[78%]">
                        {
                            unapprovedDrivers.length === 0 ? (
                                <div className="flex justify-center items-center py-8 text-lg">No Drivers Found</div>
                            )
                                : (
                                    <ActionsTable tableColumnsReal={unApprovedDrivers} key={parseInt(Math.random() * 10000)} tableDataReal={unapprovedDrivers} />
                                )
                        }
                    </div>
                ) : (
                    <Loader />
                )}

            </div>
        </>
    )
}