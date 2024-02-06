import { ActionsTable } from "../minor-components/ActionsTable"
import { useEffect, useState, useMemo } from "react"
import { axiosInstance } from "../../constants/axiosInstance"
import { selectProgressBarState } from '../../redux/Actions/ProgressBarActions'
import { useSelector, useDispatch  } from "react-redux"
import { Loader } from "../minor-components/Loader"
import { useAlert } from "react-alert"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { baseURL } from "../../constants/baseURL"

export const AddStatisticsBanner = () => {

    const token = useSelector(
        (state) => state.ProfileReducer
    );
    const alert = useAlert()
    const dispatch = useDispatch()
    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );

    const [fileHeaderPreview, setHeaderFilePreview] = useState(null)
    const [fileSliderPreview, setSliderFilePreview] = useState(null)
    const [editHeaderPreview, seteditHeaderFilePreview] = useState('')
    const [editSliderPreview, seteditSliderFilePreview] = useState('')
    const [headerImage, setHeaderFileImage] = useState(null)
    const [imgHeaderCheck, setHeaderImgCheck] = useState(false)
    const config = {
        headers: {
            "Content-Type": "multipart/form-data"
        },
    };

    useEffect(() => {
        getHeaderImages();
    }, []);

    const getHeaderImages = async () => {
        await axiosInstance.get('/api/v1/banner/getbannerImages')
            .then((res) => {
                console.log(res.data.data, 'Images Get')
                let images = res.data.data;
                if (images.length != 0) {
                    console.log(res.data.data.headerPhoto)
                    seteditHeaderFilePreview(res.data.data.headerPhoto)
                } else {

                }

            })
            .catch((err) => {

            })
    }


    const submitHeaderImage = async (e) => {
        e.preventDefault()
        dispatch(selectProgressBarState(true))
        var formData = new FormData();
        if (!headerImage) {

        }

        if (headerImage != null) {
            formData.append('headerPhoto', headerImage)
        }

        await axiosInstance.post("/api/v1/banner/addbannerImage", formData, config)
            .then(async (res) => {
                dispatch(selectProgressBarState(false))
                alert.show('Successfully updated Banner Image')
            })
            .catch(() => {
                dispatch(selectProgressBarState(false))
                alert.show('Something Went Wrong')

            });
    }

    return (
        <>
            <div className="bg-gray-50 z-0">
                {!loading ? (
                    <div className=" mt-24 bg-gray-50 ml-[20%]  w-[78%]">
                        <div className='py-2 bg-gray-50'>
                            <div className=' bg-white rounded-lg  shadow-lg'>
                                <div className='px-5 pt-4 mb-4 flex justify-between'>
                                    <h2 className='font-semibold text-gray-800 text-lg'>Add Header Images</h2>
                                </div>
                                {/* <form onSubmit={handleSubmit}> */}
                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2 text-center " name='categoryPhoto'>
                                    Banner Image
                                </label>
                                <div style={{ backgroundImage: `url(${fileHeaderPreview ? fileHeaderPreview : editHeaderPreview ? baseURL + editHeaderPreview : null})` }} className="w-[100%] h-96 rounded-lg   bg-cover bg-fixed flex flex-col justify-center items-center" >
                                    <label className="w-[100%] h-96 cursor-pointer border-2 rounded-lg flex justify-center">
                                        {!fileHeaderPreview && (editHeaderPreview == '') ? <h3 className="self-center">Click to Upload Banner Image</h3> : null}
                                        <input className='hidden' id="upload" name="headerimage" type="file" accept="image/*"
                                            onChange={(event) => {
                                                setHeaderFilePreview(URL.createObjectURL(event.target.files[0]))
                                                setHeaderFileImage(event.target.files[0])
                                                setHeaderImgCheck(true)
                                            }}
                                        />
                                    </label>
                                </div>
                                <div className="flex items-center justify-center py-6 px-4">
                                    <button onClick={submitHeaderImage} className='bg-myBg text-gray-600 px-4 py-2 rounded-full cursor-pointer hover:bg-[#E9D95D]'>
                                        {editHeaderPreview != '' ? 'Update Banner Image' : 'Add Banner Image'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Loader />
                )}

            </div>
        </>
    )
}