import { DashCard } from "../minor-components/DashCard"
import dashCardOrder from '../../assets/dash-card-order.png'
import dashCardCart from '../../assets/dash-card-cart.png'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import dashCardPending from '../../assets/dash-card-pending.png'
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectProgressBarState } from '../../redux/Actions/ProgressBarActions'
import { axiosInstance } from "../../constants/axiosInstance"
import { Loader } from "../minor-components/Loader"
import { useAlert } from "react-alert"
import { useNavigate } from 'react-router';


const DashboardHeroSection = (props) => {
    console.log('these are props : ', props)


    const token = useSelector(
        (state) => state.ProfileReducer
    );
    const alert = useAlert()
    const dispatch = useDispatch()
    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );

    const [cardData, setCardData] = useState({
        totalCategories: 0,
        totalUsers: 0,
        totalQuestions: 0,
        totalTestTaken: 0
    })
    useEffect(() => {
        if (token) {
            loadDashboardData()
        }
    }, [token])

    const loadDashboardData = async () => {
        try {
            console.log(token, 'token Is here 2')
            dispatch(selectProgressBarState(true))
            const res = await axiosInstance.get('/api/v1/admin/getdashboarddata', {
                headers: {
                    "Authorization": token
                }
            })
            if (res.data.success) {
                setCardData(res.data.data)
                dispatch(selectProgressBarState(false))
            }
            else {
                dispatch(selectProgressBarState(false))
                alert.show('Not Found')
            }
        }
        catch (e) {
            dispatch(selectProgressBarState(false))
            console.log(e)
        }
    }

    return (
        <>
            {!loading ? (
                <div className="bg-gray-50 z-0">
                    <div className=" mt-24 bg-gray-50 ml-[20%] w-[78%]">
                        <div className="m-0 p-0">
                            <div className="pt-4">
                                <h1 className="text-3xl mx-0 px-0">
                                    Dashboard
                                </h1>
                                <p className="text-xs ml-1">
                                    Dashboard
                                </p>
                            </div>
                            <div className="flex items-center w-full flex-wrap justify-between py-4 px-1">
                                <DashCard bg='bg-red-100' header={'Total Categories'} data={cardData.totalCategories} icon={dashCardOrder} footer={cardData[0]?.last24HoursAllOrders} />
                                <DashCard bg='bg-lime-100' header={'Total Users'} data={cardData.totalUsers} icon={dashCardPending} footer={cardData[1]?.last24HoursPendingOrders} />
                                <DashCard bg='bg-sky-200' header={'Total Questions'} data={cardData.totalQuestions} icon={dashCardCart} footer={cardData[2]?.last24HoursCompletedOrders} />
                                <DashCard bg='bg-green-100' header={'Test Takens'} data={cardData.totalTestTaken} icon={dashCardCart} footer={cardData[3]?.last24HoursAddedProducts} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loader />
            )}

        </>
    )

}
export default DashboardHeroSection