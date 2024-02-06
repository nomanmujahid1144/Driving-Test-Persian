import { useState, useEffect } from "react"
import { Modal } from "../minor-components/Modal"
import { useDispatch, useSelector } from "react-redux";
import { selectProgressBarState } from "../../redux/Actions/ProgressBarActions";
import { axiosInstance } from "../../constants/axiosInstance";
import cannabisForm from '../../assets/cannabis-form.jpg'
import { Loader } from "../minor-components/Loader";
import { useAlert } from 'react-alert'
import { useNavigate } from "react-router";

export const StoreLocator = () => {
    const alert = useAlert()
    const navigate = useNavigate()
    const [state, setState] = useState({
        totalTax: '',
        pricePerMile: ''
    })
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );
    const token = useSelector(
        (state) => state.ProfileReducer
    );
    useEffect(() => {
        getTax()
    }, [])
    const getTax = async () => {
        dispatch(selectProgressBarState(true))
        try{
            const res = await axiosInstance.get('/api/v1/admin/gettax',{headers:{
                "Authorization":token
            }})
            console.log(res , " loging res")
            if (res.data.success) {
                dispatch(selectProgressBarState(false))
                setState(res.data.data)
            }
            else {
                dispatch(selectProgressBarState(false))
                alert.show('No Tax Found')
            }
        }
        catch(e){
            dispatch(selectProgressBarState(false))
            navigate('/')
        }
      
    }

    const addTax = async () => {
        dispatch(selectProgressBarState(true))
        try{
            const res = await axiosInstance.post('/api/v1/admin/settax', 
            { totalTax: state.totalTax, pricePerMile: state.pricePerMile },
            {headers:{
                "Authorization":token
            }})
            if (res.data.success) {
                dispatch(selectProgressBarState(false))
                alert.show('Tax added successfully')
                setIsOpen(false)
                setState(res.data.data)
            }
            else {
                dispatch(selectProgressBarState(false))
                alert.show('No Tax Found')
            }
        }
        catch(e){
            navigate('/')
        }
        
    }
    return (
        <div className='py-8 bg-gray-50 min-h-screen'>
            {!loading ? (
                <div className=" mt-24 bg-gray-50 ml-[20%]  w-[78%]">
                    <Modal open={isOpen} onClose={() => setIsOpen(false)} >
                        <div className="h-[70vh] w-full flex ">
                            <div
                                className="w-[80%] h-auto  lg:block lg:w-5/12 bg-cover md:hidden "
                                style={{
                                    backgroundImage: `linear-gradient( to right, rgba(0,0,0,0.2) ,rgba(0, 0, 0, 0.2)) ,url(${cannabisForm})`, backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                            </div>
                            <div className="flex w-[100%] flex-col items-center px-4 py-8 gap-4">
                                <h3>Set Tax</h3>
                                <div className="flex flex-col">
                                    <p className="block mb-2 text-sm font-bold text-gray-700 md:mt-2">Enter Tax Value</p>
                                    <input value={state.totalTax} onChange={(e) => setState({ ...state, totalTax: e.target.value })} className='w-72 px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="number" placeholder="Enter tax ..." />
                                </div>
                                <div className="flex flex-col">
                                    <p className="block mb-2 text-sm font-bold text-gray-700 md:mt-2">Enter base price per mile</p>
                                    <input value={state.pricePerMile} onChange={(e) => setState({ ...state, pricePerMile: e.target.value })} className='w-72 px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="number" placeholder="Enter Base Price ..." />
                                </div>
                                <button
                                    className="w-36 px-4 py-2 font-semibold text-gray-600 bg-[#E9C95D] rounded hover:bg-[#E9D95D] focus:outline-none focus:shadow-outline"
                                    type="submit"
                                    disabled={state.pricePerMile && state.totalTax ? false : true}
                                    onClick={addTax}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </Modal>
                    <div className=' bg-white py-4 px-4 rounded-lg  shadow-lg divide-y  divide-gray-100'>
                        <div className='h-10 my-0 flex flex-col items-start justify-between'>
                            <h2 className='font-semibold text-gray-800 text-lg'>Tax Management</h2>
                            <p className='text-xs'>Lorem Ipsum Lorem Ipsum</p>
                        </div>
                        <p className="border-b-2 my-2"></p>
                        <div className="w-full mt-4  mx-auto bg-white shadow-lg rounded-sm ">
                            <div className="">
                                <div className="overflow-x-auto ">
                                    <table className="table-auto w-full ">
                                        <thead className="text-sm w-full h-14 bg-myBg font-semibold uppercase text-gray-600 ">
                                            <tr>
                                                <th key={1} className="p-2 whitespace-nowrap font-semibold text-left">
                                                    Tax
                                                </th>
                                                <th key={2} className="p-2 whitespace-nowrap font-semibold text-left">
                                                    Base Price/Mile
                                                </th>
                                                <th key={3} className="p-2 whitespace-nowrap font-semibold text-left">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm  divide-gray-100">
                                            <tr key={4}>
                                                <td className={`text-left  px-2 py-8 whitespace-nowrap `}>
                                                    <p className={`text-left text-md `}> {state.totalTax}</p>
                                                </td>
                                                <td className={`text-left  px-2 py-8 whitespace-nowrap `}>
                                                    <p className={`text-left text-md `}> {state.pricePerMile}</p>
                                                </td>
                                                <td className={`text-left  px-2 py-8 whitespace-nowrap'}`}>
                                                    <p className={`text-left text-md `}>
                                                        <button
                                                            onClick={() => setIsOpen(true)}
                                                            className='py-2 px-4 bg-myBg text-xs rounded-lg hover:bg-[#efca37]'>
                                                            Update
                                                        </button>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    )
}