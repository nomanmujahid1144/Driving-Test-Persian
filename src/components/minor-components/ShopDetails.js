import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import ImageHolder from '../../assets/upload.svg'
import { selectProgressBarState } from "../../redux/Actions/ProgressBarActions";
import { useAlert } from 'react-alert'
import { axiosInstance } from '../../constants/axiosInstance';
import { baseURL } from '../../constants/baseURL';

export const ShopDetails = (props) => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const [filePreview, setFilePreview] = useState(null)
    const [restaurantImage, setRestaurantImage] = useState(null)
    const [editRestaurant, setEditRestaurant] = useState({
        restaurantImage: '',
        shopName: '',
        formattedAddress: '',
        radius: '',
        phoneNumber: '',
        delivery: ''
    })
    useEffect(() => {
        getRestaurant();
    }, [])


    const getRestaurant = async () => {
        await axiosInstance.get('/api/v1/admin/getsingleshopbyid', {
            params: {
                restaurantId: props.restaurantID
            }
        })
            .then((res) => {
                setEditRestaurant(res.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        dispatch(selectProgressBarState(true))
        const formData = new FormData();


        if (restaurantImage != null) {
            formData.append("restaurantImage", restaurantImage);
        }

        formData.append("shopName", editRestaurant.shopName);
        formData.append("radius", editRestaurant.radius);
        formData.append("phoneNumber", editRestaurant.phoneNumber);
        formData.append("delivery", editRestaurant.delivery);

        const restaurantId = props.restaurantID;
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                restaurantId
            },
        }
        await axiosInstance.post('/api/v1/admin/updateshopbyid', formData, config)
            .then((res) => {
                dispatch(selectProgressBarState(false))
                alert.show('Shop Updated Successfully')
            })
            .catch((err) => {
                dispatch(selectProgressBarState(false))
                alert.show('Something Went Wrong')
            })
    }

    const onChange = (e) => {
        setEditRestaurant({ ...editRestaurant, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className='w-full h-fit'>
                <div style={{ scrollbarWidth: 'thin' }} className="container h-full mx-auto overflow-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="w-full shadow-[0px_3px_12px_rgba(0,0,0,0.1)] py-2">
                            <div className="w-full lg:w-full  text-[#4E4E4E] text-2xl font-semibold md:w-full bg-white rounded-lg text-center">Edit Shop</div>
                            <div className="flex mx-auto justify-center">
                                <div className=" md:mr-2 md:mb-0 md:w-full justify-center mx-auto">
                                    <label htmlFor="upload" className='w-[120px] h-[120px] block rounded-[50%] cursor-pointer mx-auto mb-2'>
                                        <img className='w-[125px] h-[125px] block rounded-[50%] cursor-pointer mb-2 ' src={editRestaurant.shopImage && filePreview == null ? baseURL + editRestaurant.shopImage : filePreview ? filePreview : ImageHolder} alt='img' />
                                        <input className='hidden' id="upload" name="image" type="file" accept="image/*"
                                            onChange={(event) => {
                                                setFilePreview(URL.createObjectURL(event.target.files[0]))
                                                setRestaurantImage(event.target.files[0])
                                            }} />
                                    </label>

                                    <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2 text-center " name='productPhoto'>
                                        Shop Image
                                    </label>
                                </div>
                            </div>
                            <div className='flex justify-around '>

                                <div className='flex flex-col p-2'>
                                    <div className='flex flex-col justify-around  my-3'>

                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="shopName">
                                                    Shop Name
                                                </label>
                                                <input className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="shopName" onChange={onChange} value={editRestaurant.shopName} />
                                                {/* <ErrorMessage className='text-red-600 text-xs' name="name" component="div" /> */}

                                            </div>
                                        </div>
                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                <label className="block mb-2 text-sm mt-2 font-bold text-gray-700 md:mt-2" htmlFor="formattedAddress">
                                                    Address
                                                </label>
                                                <input disabled className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border cursor-not-allowed rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="formattedAddress" onChange={onChange} value={editRestaurant.formattedAddress} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col p-2'>
                                    <div className='flex flex-col justify-around my-3'>
                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="radius">
                                                    Radius
                                                </label>
                                                <input className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="radius" onChange={onChange} value={editRestaurant.radius} />
                                            </div>

                                        </div>
                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                <label className="block mb-2 mt-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="phoneNumber">
                                                    Phone Number
                                                </label>
                                                <input className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="phoneNumber" onChange={onChange} value={editRestaurant.phoneNumber} />
                                            </div>
                                        </div>
                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="delivery">
                                                    Delivery Charges
                                                </label>
                                                <input className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="delivery" onChange={onChange} value={editRestaurant.delivery} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="mb-6 flex items-center justify-center gap-2 sm:flex-col text-center">
                                <button
                                    className="w-36 px-4 py-2 font-semibold text-gray-600 bg-myBg rounded hover:bg-[#E9D95D] focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}