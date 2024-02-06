import { useEffect, useState} from "react"
import { useSelector, useDispatch } from "react-redux"
import { Loader } from "../minor-components/Loader"
import { useAlert } from "react-alert"
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { baseURL } from "../../constants/baseURL"
import { Modal } from "../minor-components/Modal"
import { AddUsefulTipsForm } from "../minor-components/AddUsefulTipsForm";
import pdf from '../../assets/pdf-transparent.png'
import { deleteTip, deleteTipIcon, getAllTips, getTipsIcon } from "../../redux/Actions/UsefulTipsAction"
import { AddUsefulTipsIconForm } from "../minor-components/AddUsefulTipsIconForm"


export const AddUsefulTips = () => {

    const alert = useAlert();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isIconOpen, setIsIconOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);



    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );
    const { tips } = useSelector(
        (state) => state.usefulTipsReducer
    );

    const { tipIcon } = useSelector(
        (state) => state.usefulTipsReducer
    );

    useEffect(() => {
        dispatch(getAllTips(alert));
        dispatch(getTipsIcon(alert));
    }, [isOpen, isIconOpen, refresh]);


    const handleDeleteTip = async (id) => {
        dispatch(deleteTip(id, navigate, alert));
        dispatch(getAllTips(alert));
        setRefresh(!refresh)
    }

    const handleDeleteTipIcon = async (id) => {
        dispatch(deleteTipIcon(id, navigate, alert));
        dispatch(getAllTips(alert));
        setRefresh(!refresh)
    }


    const handleDownload = (path) => {
        // Simulate downloading by creating a dummy link element
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
                    <>
                        <div className=" mt-24  ml-[20%]  w-[78%]">
                            <div className="py-2 bg-gray-50">
                                {!Object.keys(tipIcon).length > 0 ? 
                                    <div className=' bg-white rounded-lg  shadow-lg'>
                                        <div className="flex items-center justify-end py-4 px-4">
                                            <button onClick={() => {
                                                setIsIconOpen(true)
                                            }}
                                            className='bg-myBg text-gray-600 px-4 py-2 cursor-pointer hover:bg-[#E9D95D]'>
                                                Add Useful Tips Icon
                                            </button>
                                        </div>
                                        <Modal open={isIconOpen} onClose={() => setIsIconOpen(false)} >
                                            <AddUsefulTipsIconForm modal={setIsIconOpen} isAdd={true} />
                                        </Modal>
                                    </div>
                                : null}
                                {Object.keys(tipIcon).length > 0 ? <>
                                    <div className=' bg-white rounded-lg  shadow-lg my-5'>
                                        <div className='px-5 pt-4 mb-11 flex justify-between '>
                                            <h2 className='font-semibold text-gray-800 text-lg'>Useful Tips Icon</h2>
                                        </div>
                                        <div className="max-w-5xl mx-auto">
                                            <div className="grid grid-cols-3 gap-3">
                                            <div className="max-w-lg relative mx-auto w-64">
                                                <div className="bg-white  shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                                                    <img className="rounded-t-lg w-full  h-44" src={tipIcon?.iconImage !== ''? baseURL + tipIcon?.iconImage : ''} alt='img' />
                                                </div>
                                                <div onClick={() => handleDeleteTipIcon(tipIcon?._id)} class="absolute cursor-pointer inline-flex items-center justify-center w-9 h-9 text-xs font-bold text-white bg-myBg border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                                                    <FontAwesomeIcon className="text-gray-600" icon="fa-solid fa-trash" />
                                                </div>
                                            </div>  
                                            </div>
                                        </div>
                                    </div>
                                </> : null}
                            </div>
                        </div>
                        <div className=" mt-24  ml-[20%]  w-[78%]">
                            <div className="py-2 bg-gray-50">
                                <div className=' bg-white rounded-lg  shadow-lg'>
                                    <div className='px-5 pt-4 mb-4 flex justify-between'>
                                        <h2 className='font-semibold text-gray-800 text-lg'>Useful Tips</h2>
                                    </div>
                                    <div className="flex items-center justify-end py-4 px-4">
                                        <button onClick={() => {
                                            setIsOpen(true)
                                        }}
                                            className='bg-myBg text-gray-600 px-4 py-2 cursor-pointer hover:bg-[#E9D95D]'>
                                            Add Tips
                                        </button>
                                    </div>
                                    <Modal open={isOpen} onClose={() => setIsOpen(false)} >
                                        <AddUsefulTipsForm modal={setIsOpen} isAdd={true} />
                                    </Modal>
                                </div>

                                {tips.length != 0 ? <>
                                    <div className=' bg-white rounded-lg  shadow-lg my-5'>
                                        <div className='px-5 pt-4 mb-11 flex justify-between '>
                                            <h2 className='font-semibold text-gray-800 text-lg'> All Useful Tips</h2>
                                        </div>
                                        <div className="max-w-5xl mx-auto">
                                            <div className="grid grid-cols-3 gap-3">
                                                {tips.map((tip, index) => (
                                                    <div id={index} className="max-w-lg relative mx-auto w-64">
                                                        <div className="bg-white  shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                                                            {tip.video !== '' ?
                                                                <video controls className="rounded-t-lg w-full  h-44">
                                                                    <source src={tip?.video !== '' ? baseURL + tip?.video : `https://flowbite.com/docs/images/blog/image-1.jpg`} ></source>
                                                                </video>
                                                                :
                                                                tip.image !== '' ?
                                                                    <img className="rounded-t-lg w-full  h-44" src={tip?.image !== ''? baseURL + tip?.image : ''} alt='img' />
                                                            
                                                                    :
                                                                    <img className="rounded-t-lg w-44  h-44" src={pdf} alt="" />
                                                            }
                                                            <div className="p-5">
                                                                <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">{ tip.tips }</h5>
                                                            </div>
                                                            {tip.document ?
                                                                <div className="flex items-center justify-start py-4 px-4">
                                                                    <button onClick={() => handleDownload(tip.document.path)} className='bg-myBg flex items-center text-white px-4 py-2 cursor-pointer'>
                                                                        Download 
                                                                        <FontAwesomeIcon className="text-red-800 pl-3" size="2x" icon="fa-solid fa-file-pdf" />
                                                                    </button>
                                                                </div>
                                                            :null}
                                                        </div>
                                                        <div onClick={() => handleDeleteTip(tip?._id)} class="absolute cursor-pointer inline-flex items-center justify-center w-9 h-9 text-xs font-bold text-white bg-myBg border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
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
                    </>
                ) : (
                    <Loader />
                )}

            </div>
        </>
    )
}