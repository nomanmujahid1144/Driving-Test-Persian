import cannabisForm from '../../assets/cannabis-form.jpg'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'rsuite/dist/rsuite.min.css';
import ImageHolder from '../../assets/upload.svg';
import PDFHolder from '../../assets/PDF.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { baseURL } from '../../constants/baseURL';
import { updateCategory } from '../../redux/Actions/CategoryActions';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { addTips } from '../../redux/Actions/UsefulTipsAction';
import { isValidFileType } from '../../constants/herper';




const useFulTipSchema = Yup.object().shape({
    files : Yup.string(),
    video : Yup.string(),
    image : Yup.string(),
    tips: Yup.string()
        .min(2, 'Too Short!')
        .max(1000, 'Too Long!')
        .required('Required'),
});

export const AddUsefulTipsForm = (props) => {
    console.log('these are props : ', props)
    const status = !props.isAdd ? props.isAdd : true
    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [filePreview, setFilePreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [editItem, setEditItem] = useState([]);
    const [imgCheck, setImgCheck] = useState(false);


    const { categories } = useSelector(
        (state) => state.categoryReducer
    );
    useEffect(() => {
        if (!status) {
            setEditItem(categories.filter(
                (category) => category._id === global.editId
            ))
        }
    }, [])


    return (
        <>
            <div className='w-full h-[85vh]'>
                {console.log("edit item : ", editItem)}
                <div style={{ scrollbarWidth: 'thin' }} className="container h-full mx-auto overflow-y-scroll">
                    <div className="flex justify-center">
                        <div className="w-full flex ">
                            <div
                                className="w-2/3 h-auto  lg:block lg:w-5/12 bg-cover md:hidden "
                                style={{
                                    backgroundImage: `linear-gradient( to right, rgba(0,0,0,0.2) ,rgba(0, 0, 0, 0.2)) ,url(${cannabisForm})`, backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >

                            </div>

                            <div className="w-full xl:w-[65%] md:w-full bg-white rounded-lg ">
                                <h3 className="pt-4 text-2xl text-center mt-8 font-bold">{!status ? 'Useful Tips Details' : "Add Useful Tips"}</h3>
                                <Formik
                                    enableReinitialize
                                    initialValues={
                                        {
                                            files : editItem.length !== 0 ? `${editItem[0].files}` : '',
                                            video : editItem.length !== 0 ? `${editItem[0].video}` : '',
                                            image : editItem.length !== 0 ? `${editItem[0].image}` : '',
                                            tips: editItem.length !== 0 ? `${editItem[0].tips}` : '',
                                        } 
                                    }
                                    validationSchema={useFulTipSchema}
                                    onSubmit={async (values) => {
                                        console.log(values , 'Values')
                                        var formData = new FormData();
                                        let file = values.files;
                                        let video = values.video;
                                        let image = values.image;
                                        if (file) {
                                            formData.append('files', file)
                                        } else if (video) {
                                            formData.append('video', video)
                                        } else {
                                            formData.append('image', image)
                                        }
                                        if (!status) {
                                            if (imgCheck) {
                                                dispatch(updateCategory(values, formData, navigate, alert, props.modal))
                                            }
                                            else {
                                                dispatch(updateCategory(values, formData, navigate, alert, props.modal))
                                            }
                                        }
                                        else {
                                            dispatch(addTips(values, formData, navigate, alert, props.modal, setUploadProgress))
                                        }
                                    }}
                                >
                                    {({ isSubmitting, values, setFieldValue, handleChange  }) => (
                                        <Form className="px-8 pt-6 pb-8 mb-4 my-10 bg-white rounded" >
                                            <div className="flex mx-auto justify-center">
                                                <div className=" md:mr-2 md:mb-0 md:w-full justify-center mx-auto">
                                                    <label htmlFor="upload" className='w-100 h-100 block rounded-[50%] cursor-pointer mx-auto mb-2'>
                                                        {values.video  ?
                                                            <video className='w-100 h-100 block cursor-pointer mb-2 '  controls>
                                                                <source src={!status && editItem.length !== 0 && !imgCheck ? baseURL + editItem[0].video : !values.video ? ImageHolder : filePreview}></source>
                                                            </video>
                                                            : values?.files ?
                                                            <img className='w-[125px] h-[125px] block rounded-[50%] cursor-pointer mb-2 ' src={!status && editItem.length !== 0 && !imgCheck ? baseURL + editItem[0].files : !values.files ? ImageHolder : PDFHolder} alt='File' />
                                                            : 
                                                            <img className='w-[125px] h-[125px] block rounded-[50%] cursor-pointer mb-2 ' src={!status && editItem.length !== 0 && !imgCheck ? baseURL + editItem[0].image : !values.image ? ImageHolder : filePreview} alt='img' />
                                                        }
                                                        <input className='hidden' id="upload" name="files" type="file" accept="image/png, image/jpeg, video/mp4, video/x-m4v, video/*, application/pdf" onChange={(event) => {
                                                            const selectedFile = event.target.files[0];
                                                            // Perform validation here
                                                            if (!isValidFileType(selectedFile)) {
                                                                alert.show("Invalid file type. Please select an image or video.");
                                                                return;
                                                            }

                                                            if (selectedFile.type.includes('video')) {
                                                                setFieldValue('video', selectedFile);
                                                            } else if (selectedFile.type.includes('image')) {
                                                                setFieldValue('image', selectedFile);
                                                            } else {
                                                                setFieldValue('files', selectedFile);
                                                            }

                                                            setFilePreview(URL.createObjectURL(selectedFile));
                                                            setImgCheck(true);
                                                        }} />
                                                    </label>
                                                    <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2 text-center " name='files'>
                                                        PDF File / Video / Image
                                                    </label>
                                                    <ErrorMessage className='text-red-600 text-xs text-center' name="files" component="div" />
                                                </div>
                                            </div>
                                            {uploadProgress > 0 && (
                                                <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                                    <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: uploadProgress + '%'}}> {uploadProgress.toFixed(0)+ '%'}</div>
                                                </div>
                                            )} 
                                            <div className='flex justify-around '>
                                                <div className='flex flex-col my-5 mb-8 w-full'>
                                                    <div className='flex flex-col justify-around my-3'>
                                                        <div className=" md:flex md:justify-between w-full xl:w-72 lg:w-72 md:w-full md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2  text-sm font-bold text-gray-700 md:mt-2" htmlFor="tips">
                                                                    Useful Tips
                                                                </label>
                                                                <Field className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' as="textarea" rows="4" type="text" name="tips" />
                                                                <ErrorMessage className='text-red-600 text-xs font-thin' name="tips" component="div" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-6 flex items-center justify-center gap-2 sm:flex-col text-center">
                                                <button
                                                    className="w-36 px-4 py-2 font-semibold text-gray-600 bg-[#E9C95D] rounded hover:bg-[#E9D95D] focus:outline-none focus:shadow-outline"
                                                    type="submit" disabled={isSubmitting}
                                                >
                                                    {!status ? 'Update' : 'Submit'}
                                                </button>
                                                <button className={`w-36 px-4 py-2 font-semibold text-gray-600 bg-[#E9C95D] rounded hover:bg-[#E9D95D] focus:outline-none focus:shadow-outline ${!status ? 'hidden' : ''}`} type="reset">Reset</button>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}