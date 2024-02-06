import { useEffect, useState } from 'react';
import ImageHolder from '../../assets/profile-holder.webp'
import cannabisForm from '../../assets/cannabis-form.jpg'
import { getTranslateDOMPositionXY } from 'dom-lib/esm/translateDOMPositionXY';
import { axiosInstance } from '../../constants/axiosInstance';
import { useAlert } from 'react-alert';
import { baseURL } from '../../constants/baseURL';
export const Account = () => {
    const alert = useAlert()
    const [profilePhoto, setProfilePhoto] = useState('')
    const [filePreview, setFilePreview] = useState('')
    const [admin , setAdmin] = useState('')
    useEffect(()=>{
     getAdmin()   
    },[])
    const getAdmin=async()=>{
        try{
            const res = await axiosInstance.get('api/v1/admin/getadmin')
            if(res.data.success){
                setAdmin(res.data.data)
            }
            else{
                alert.show('No user found')
            }
        }
        catch(e){
            console.log(e)
        }
    }
    return (
        <div className='py-8 bg-gray-50'>
            <div className=" mt-24 bg-gray-50 ml-[20%]  w-[78%]">
                <div className=' bg-white py-4  my-4 rounded-lg  shadow-lg divide-y  divide-gray-100'>
                    <div className='h-10 my-0 px-4 flex flex-col items-start justify-between mb-4'>
                        <h2 className='font-semibold text-gray-800 text-lg'>Edit Profile</h2>
                        <p className='text-xs'>Details</p>
                    </div>
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
                            <div className="flex flex-col items-center justifu-center">
                                <label htmlFor="upload" className='w-[120px] h-[120px] block rounded-[50%] cursor-pointer mx-auto mb-2'>
                                    <img className='w-[125px] h-[125px] block rounded-[50%] cursor-pointer mb-2 ' src={filePreview?filePreview : admin.profilePhoto? baseURL+admin.profilePhoto : ImageHolder} alt='img' />
                                    <input className='hidden' id="upload" name="image" type="file" accept="image/*" onChange={(event) => {
                                        setProfilePhoto("productPhoto", event.currentTarget.files[0]);
                                        setFilePreview(URL.createObjectURL(event.target.files[0]))

                                    }} />
                                </label>
                                <p className="block mb-2 text-sm font-bold text-gray-700 md:mt-2">Profile Image</p>
                            </div>
                            <div className="flex flex-col">
                                <p className="block mb-2 text-sm font-bold text-gray-700 md:mt-2">Name</p>
                                <input className='w-72 px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" placeholder="Enter tax ..." />
                            </div>
                            <div className="flex flex-col">
                                <p className="block mb-2 text-sm font-bold text-gray-700 md:mt-2">Email</p>
                                <input className='w-72 px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="email" placeholder="Enter Base Price ..." />
                            </div>
                            <button
                                className="w-36 px-4 py-2 font-semibold text-gray-600 bg-[#E9C95D] rounded hover:bg-[#E9D95D] focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}