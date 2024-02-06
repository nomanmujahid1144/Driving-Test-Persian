import { useEffect, useState, useMemo } from "react"
import { axiosInstance } from "../../constants/axiosInstance"
import { selectProgressBarState } from '../../redux/Actions/ProgressBarActions'
import { useSelector, useDispatch } from "react-redux"
import { Loader } from "../minor-components/Loader"
import { useAlert } from "react-alert"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"


export const AddAnnouncementMessage = () => {


    const alert = useAlert()
    const dispatch = useDispatch()

    const [announcement, setAnnouncement] = useState('');
    const [category, setCategory] = useState([])

    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );

    useEffect(() => {
        getAnnouncementList();
    }, []);


    const getAnnouncementList = async () => {
        await axiosInstance.get('/api/v1/announcement/getannouncement')
            .then((res) => {
                let aboutUs = res.data.data;
                if (aboutUs.length != 0) {
                    setAnnouncement(aboutUs[0].announcement)
                    setCategory(aboutUs[0].announcementList)
                }
            })
            .catch((err) => {

            })
    }



    function handleTags(event, type) {
        if (event.key !== 'Enter') return
        const value = event.target.value
        if (!value.trim()) return

        if (type === 'category') {
            setCategory([...category, `• ${value}`])
        }
        event.target.value = ''
    }

    function removeTag(index, type) {
        if (type === 'category') {
            setCategory(category.filter((el, i) => i != index))
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(selectProgressBarState(true))
        let str = '';

        category.forEach((category) => {
            str = str + " " + category
        })

        await axiosInstance.post('/api/v1/announcement/addannouncement', { announcement: str, announcementList: category })
            .then((res) => {
                dispatch(selectProgressBarState(false))
                alert.show('Successfully Added Message')
                getAnnouncementList()
            })
            .catch((err) => {
                dispatch(selectProgressBarState(false))
                alert.show('Please try Again')
            })
    }
    return (
        <>
            <div className="bg-gray-50   z-0">
                {!loading ? (
                    <div className=" mt-24  ml-[20%]  w-[78%]">
                        <div className="py-2 bg-gray-50">
                            <div className=' bg-white rounded-lg  shadow-lg'>
                                <div className='px-5 pt-4 mb-4 flex justify-between'>
                                    <h2 className='font-semibold text-gray-800 text-lg'>Announcement Message</h2>
                                    <Link to='/pages'>
                                        <button className='bg-myBg text-gray-600 px-4 py-2 rounded-full cursor-pointer hover:bg-[#E9D95D]'>
                                            <FontAwesomeIcon icon="fa-solid fa-arrow-left" className="pr-2" />
                                            Back
                                        </button>
                                    </Link>

                                </div>
                                <div className="p-3">
                                    <h2 className='font-semibold py-2 text-gray-800 text-lg'>Message</h2>
                                    <input className='w-full px-3 py-2 text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                                        type="text"
                                        onKeyDown={(event) => handleTags(event, 'category')}
                                        name="category"
                                    />

                                    <div className='w-full mt-3 flex items-center flex-wrap gap-1'>
                                        {category.map((tag, index) => (
                                            <div key={index} className='bg-[#Dad8d8] inline-flex  p-2 rounded-full'>
                                                <div className='text-gray-700'>{tag}</div>
                                                <div onClick={() => removeTag(index, 'category')} className='bg-[#000] text-[#fff] rounded-[50%] w-[20px] h-[20px] flex justify-center items-center ml-2 cursor-pointer'>&times;</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end p-5">
                                        <button onClick={handleSubmit} className='bg-myBg text-right text-gray-600 px-4 py-2 rounded cursor-pointer hover:bg-[#E9D95D]'>
                                            Save
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div class="relative rounded bg-myBg flex overflow-x-hidden">
                                        <div class="py-2 animate-marquee whitespace-nowrap">
                                            <span class="text-4xl mx-4">{announcement}</span>
                                        </div>
                                    </div>

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