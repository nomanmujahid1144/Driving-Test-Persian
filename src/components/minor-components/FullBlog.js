import { ActionsTable } from "../minor-components/ActionsTable"
import { useEffect, useState, useMemo  } from "react"
import { axiosInstance } from "../../constants/axiosInstance"
import { selectProgressBarState } from '../../redux/Actions/ProgressBarActions'
import { useSelector, useDispatch } from "react-redux"
import { Loader } from "../minor-components/Loader"
import { useAlert } from "react-alert"
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link  , useParams} from "react-router-dom"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { baseURL } from "../../constants/baseURL"
import { getBlogById, updateBlog } from "../../redux/Actions/BlogsActions"


export const FullBlog = () => {

    const alert = useAlert()
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );
    const {blog} = useSelector(
        (state) => state.blogReducer
    );

    useEffect(() => {
        dispatch(getBlogById(id))
    }, [id]);
    
    // Assign values once the blog data is fetched
    // useEffect(() => {
    // if (blog?.data) {
    //     setaboutData(blog.data);
    //     setBlogHeading(blog.blogHeading);
    // }
    // }, [blog]);



    return (
        <>
            <div className="bg-gray-50   z-0">
                {!loading ? (
                    <>
                    <div className=" mt-24  ml-[20%]  w-[78%]">
                        <div className="py-2 bg-gray-50">
                        <div className=' bg-white rounded-lg  shadow-lg my-5'>
                                    <div className='px-5 pt-4 mb-11 flex justify-between '>
                                        <h2 className='font-semibold text-gray-800 text-lg'>Blogs</h2>
                                        <Link to='/pages/blog'>
                                            <button className='bg-myBg text-gray-600 px-4 py-2 rounded-full cursor-pointer hover:bg-[#E9D95D]'>
                                                <FontAwesomeIcon icon="fa-solid fa-arrow-left" className="pr-2" />
                                                Back
                                            </button>
                                        </Link>
                                    </div>
                                    <main className=" pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                                        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                                            <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                                            <header className="mb-4 lg:mb-6 not-format">
                                                <h1 dangerouslySetInnerHTML={{ __html: blog?.blogHeading != '' ? blog?.blogHeading : '' }} className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white"></h1>
                                            </header>
                                            <p className="lead" dangerouslySetInnerHTML={{ __html: blog?.data != '' ? blog?.data : '' }}></p>
                                            </article>
                                        </div>
                                    </main>
                                </div>  
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