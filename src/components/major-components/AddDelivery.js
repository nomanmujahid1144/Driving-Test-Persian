import { ActionsTable } from "../minor-components/ActionsTable"
import { useEffect, useState, useMemo } from "react"
import { axiosInstance } from "../../constants/axiosInstance"
import { selectProgressBarState } from '../../redux/Actions/ProgressBarActions'
import { useSelector, useDispatch } from "react-redux"
import { Loader } from "../minor-components/Loader"
import { useAlert } from "react-alert"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import List from '@ckeditor/ckeditor5-list/src/list';
// import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties';
// import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';


export const AddDalivery = () => {


    const alert = useAlert()
    const dispatch = useDispatch()

    const [data, getData] = useState('');
    const [headings, getHeading] = useState('');

    const [aboutData, setaboutData] = useState('');
    const [aboutHeading, setaboutHeading] = useState('');

    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );

    useEffect(() => {
        getDeliveryData();
    }, []);


    const getDeliveryData = async () => {
        await axiosInstance.get('/api/v1/delivery/getdelivery')
            .then((res) => {
                console.log(res.data.data, 'About Us Get')
                let aboutUs = res.data.data;
                if (aboutUs.length != 0) {
                    getData(aboutUs[0].data)
                    getHeading(aboutUs[0].heading)
                }
            })
            .catch((err) => {

            })
    }

    const handleHeadingChange = (event, editor) => {
        const data = editor.getData();
        setaboutHeading(data)
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setaboutData(data)
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(selectProgressBarState(true))
        await axiosInstance.post('/api/v1/delivery/adddelivery', { data: aboutData, heading: aboutHeading })
            .then((res) => {
                dispatch(selectProgressBarState(false))
                alert.show('Successfully Updated Delivery Data')
                getDeliveryData()
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
                                    <h2 className='font-semibold text-gray-800 text-lg'>Delivery</h2>
                                    <Link to='/pages'>
                                        <button className='bg-myBg text-gray-600 px-4 py-2 rounded-full cursor-pointer hover:bg-[#E9D95D]'>
                                            <FontAwesomeIcon icon="fa-solid fa-arrow-left" className="pr-2" />
                                            Back
                                        </button>
                                    </Link>

                                </div>
                                <div className="p-3">
                                    <h2 className='font-semibold py-2 text-gray-800 text-lg'>Delivery Heading</h2>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={headings}
                                        config={{
                                            toolbar: ['bold', 'italic']
                                        }}
                                        onChange={handleHeadingChange}
                                    />
                                    <h2 className='font-semibold py-2 text-gray-800 text-lg'>Delivery Data</h2>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={data}
                                        config={{
                                            // plugins: [ListProperties],
                                            toolbar: ['heading', '|', 'bold', 'italic', '|', 'table', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'],
                                            heading: {
                                                options: [
                                                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                                                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                                                    { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                                                    { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                                                    { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                                                ]
                                            },
                                            list: {
                                                properties: {
                                                    styles: true,
                                                    startIndex: true,
                                                    reversed: true
                                                }
                                            }
                                        }}
                                        onReady={editor => {
                                            editor.editing.view.change((writer) => {
                                                writer.setStyle(
                                                    "height",
                                                    "200px",
                                                    editor.editing.view.document.getRoot()
                                                );
                                            });
                                        }}
                                        onChange={handleEditorChange}
                                    />
                                </div>
                                <div className="flex justify-end p-5">
                                    <button onClick={handleSubmit} className='bg-myBg text-right text-gray-600 px-4 py-2 rounded cursor-pointer hover:bg-[#E9D95D]'>
                                        Save
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