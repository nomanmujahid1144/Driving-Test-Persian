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
import { AddProductsForm } from "../minor-components/AddTeacherForm"
import { AddCategoriesForm } from "../minor-components/AddCategoriesForm"
import { getCategories } from "../../redux/Actions/CategoryActions"


export const AddBlogs = () => {

    const alert = useAlert();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(true);



    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );
    const { categories } = useSelector(
        (state) => state.categoryReducer
    );

    useEffect(() => {
        dispatch(getCategories(alert));
    }, [isOpen]);


    const handleDeleteBlog = async (id) => {
        dispatch(deleteBlog(id, navigate, alert , isOpen , setIsOpen))
    }

    return (
        <>
            <div className="bg-gray-50   z-0">
                {!loading ? (
                    <div className=" mt-24  ml-[20%]  w-[78%]">
                        <div className="py-2 bg-gray-50">
                            <div className=' bg-white rounded-lg  shadow-lg'>
                                <div className='px-5 pt-4 mb-4 flex justify-between'>
                                    <h2 className='font-semibold text-gray-800 text-lg'>Categories</h2>
                                </div>
                                <div className="flex items-center justify-end py-4 px-4">
                                    <button onClick={() => {
                                        setIsOpen(true)
                                    }}
                                        className='bg-myBg text-gray-600 px-4 py-2 cursor-pointer hover:bg-[#E9D95D]'>
                                        Add Category
                                    </button>
                                </div>
                                <Modal open={isOpen} onClose={() => setIsOpen(false)} >
                                    <AddCategoriesForm modal={setIsOpen} isAdd={true} isEdit={isEdit} />
                                </Modal>
                            </div>

                            {categories.length != 0 ? <>
                                <div className=' bg-white rounded-lg  shadow-lg my-5'>
                                    <div className='px-5 pt-4 mb-11 flex justify-between '>
                                        <h2 className='font-semibold text-gray-800 text-lg'> All Categories</h2>
                                    </div>
                                    <div className="max-w-5xl mx-auto">
                                        <div className="grid grid-cols-3 gap-3">
                                            {categories.map((category, index) => (
                                                <div id={index} className="max-w-lg relative mx-auto w-3/4">
                                                    <div className="bg-white  shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                                                        <img className="rounded-t-lg w-full  h-44" src={category?.categoryImage != '' ? baseURL + category?.categoryImage : `https://flowbite.com/docs/images/blog/image-1.jpg`} alt="" />
                                                        <div className="p-5">
                                                            <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2" dangerouslySetInnerHTML={{ __html: category?.categoryTitle != '' ? category?.categoryTitle : '' }}></h5>
                                                        </div>
                                                    </div>
                                                    <div onClick={() => handleDeleteBlog(category?._id)} class="absolute cursor-pointer inline-flex items-center justify-center w-9 h-9 text-xs font-bold text-white bg-myBg border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                                                        <FontAwesomeIcon className="text-gray-600" icon="fa-solid fa-trash" />
                                                    </div>
                                                    <div onClick={() => {
                                                        setIsOpen(true)
                                                        global.categoryEditId = category?._id;
                                                        setIsEdit(false)
                                                    }} class="absolute cursor-pointer inline-flex items-center justify-center w-9 h-9 text-xs font-bold text-white bg-myBg border-2 border-white rounded-full -top-2 right-9 dark:border-gray-900">
                                                        <FontAwesomeIcon className="text-gray-600" icon="fa-solid fa-edit" />
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