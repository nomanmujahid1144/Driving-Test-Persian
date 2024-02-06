import { useEffect, useState} from "react"
import { axiosInstance } from "../../constants/axiosInstance"
import { useSelector, useDispatch } from "react-redux"
import { Loader } from "../minor-components/Loader"
import { useAlert } from "react-alert"
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { baseURL } from "../../constants/baseURL"
import { addBlog, deleteBlog, getBlogs } from "../../redux/Actions/BlogsActions"
import { Modal } from "../minor-components/Modal"
import { getCategories } from "../../redux/Actions/CategoryActions"
import { AddVideosForm } from "../minor-components/AddVideosForm";
import pdf from '../../assets/pdf-transparent.png'
import { deleteVideo, getVideos } from "../../redux/Actions/VideoAction"


export const Videos = () => {

    const alert = useAlert();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleted, setdeleteVideo] = useState(false);



    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );
    const { videos } = useSelector(
        (state) => state.videoReducer
    );

    useEffect(() => {
        dispatch(getVideos());
    }, [isOpen,isDeleted]);


    const handleDeleteVideo = async (id) => {
        dispatch(deleteVideo(id, navigate, alert , isDeleted , setdeleteVideo))
    }


    const handleDownload = (path) => {
        // Simulate downloading by creating a dummy link element
        console.log(path)
        const link = document.createElement('a');
        link.href = baseURL + path;
        link.target = '_blank'; // Open in a new tab/window
        link.download = 'useful-Tips.pdf'; // Specify the desired filename
        link.click();
      };

    return (
        <>
            <div className="bg-gray-50   z-0">
                {!loading ? (
                    <div className=" mt-24  ml-[20%]  w-[78%]">
                        <div className="py-2 bg-gray-50">
                            <div className=' bg-white rounded-lg  shadow-lg'>
                                <div className='px-5 pt-4 mb-4 flex justify-between'>
                                    <h2 className='font-semibold text-gray-800 text-lg'>Videos</h2>
                                </div>
                                <div className="flex items-center justify-end py-4 px-4">
                                    <button onClick={() => {
                                        setIsOpen(true)
                                    }}
                                        className='bg-myBg text-gray-600 px-4 py-2 cursor-pointer hover:bg-[#E9D95D]'>
                                        Add Video
                                    </button>
                                </div>
                                <Modal open={isOpen} onClose={() => setIsOpen(false)} >
                                    <AddVideosForm modal={setIsOpen} isAdd={true} />
                                </Modal>
                            </div>

                            {videos.length != 0 ? <>
                                <div className=' bg-white rounded-lg  shadow-lg my-5'>
                                    <div className='px-5 pt-4 mb-11 flex justify-between '>
                                        <h2 className='font-semibold text-gray-800 text-lg'> All Videos</h2>
                                    </div>
                                    <div className="max-w-5xl mx-auto">
                                        <div className="grid grid-cols-3 gap-3">
                                            {videos.map((video, index) => (
                                                <div id={index} className="max-w-lg relative mx-auto w-64">
                                                    <div className="bg-white  shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                                                        {video?.video !== '' ?
                                                            <video controls className="rounded-t-lg w-full  h-44">
                                                                <source src={video?.video !== '' ? baseURL + video?.video : `https://flowbite.com/docs/images/blog/image-1.jpg`} ></source>
                                                            </video>
                                                            :
                                                        video?.image !== ''?
                                                            <img className="rounded-t-lg w-full  h-44" src={video?.image !== ''? baseURL + video?.image : ''} alt='img' />
                                                        :
                                                            <img className="rounded-t-lg w-44  h-44" src={pdf} alt="" />
                                                        }
                                                        <div className="p-5">
                                                            <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2" >{video.title}</h5>
                                                        </div>
                                                        {video?.document ?
                                                            <div className="flex items-center justify-start py-4 px-4">
                                                                <button onClick={() => handleDownload(video.document.path)} className='bg-myBg flex items-center text-white px-4 py-2 cursor-pointer'>
                                                                    Download 
                                                                    <FontAwesomeIcon className="text-red-800 pl-3" size="2x" icon="fa-solid fa-file-pdf" />
                                                                </button>
                                                            </div>
                                                        :null}
                                                    </div>
                                                    <div onClick={() => handleDeleteVideo(video?._id)} class="absolute cursor-pointer inline-flex items-center justify-center w-9 h-9 text-xs font-bold text-white bg-myBg border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                                                        <FontAwesomeIcon className="text-gray-600" icon="fa-solid fa-trash" />
                                                    </div>
                                                </div>
                                            ))}   
                                        </div>
                                    </div>
                                </div>
                            </> : null}

                        </div>
                    </div>
                ) : (
                    <Loader />
                )}

            </div>
        </>
    )
}