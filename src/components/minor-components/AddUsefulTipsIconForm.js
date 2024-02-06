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
import { addTips, addTipsIcon } from '../../redux/Actions/UsefulTipsAction';
import { isValidFileType } from '../../constants/herper';




const useFulTipSchema = Yup.object().shape({
    iconImage : Yup.string()
});

export const AddUsefulTipsIconForm = (props) => {
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
                                className="w-2/3 h-[100vh]  lg:block lg:w-5/12 bg-cover md:hidden "
                                style={{
                                    backgroundImage: `linear-gradient( to right, rgba(0,0,0,0.2) ,rgba(0, 0, 0, 0.2)) ,url(${cannabisForm})`, backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >

                            </div>

                            <div className="w-full xl:w-[65%] md:w-full bg-white rounded-lg ">
                                <h3 className="pt-4 text-2xl text-center mt-8 font-bold">{!status ? 'Useful Tips Icon' : "Add Useful Tips Icon"}</h3>
                                <Formik
                                    enableReinitialize
                                    initialValues={
                                        {
                                            iconImage : editItem.length !== 0 ? `${editItem[0].iconImage}` : '',
                                        } 
                                    }
                                    validationSchema={useFulTipSchema}
                                    onSubmit={async (values) => {
                                        var formData = new FormData();
                                        let image = values.iconImage;
                                        if (image){
                                            formData.append('iconImage', image)
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
                                            dispatch(addTipsIcon(values, formData, navigate, alert, props.modal, setUploadProgress))
                                        }
                                    }}
                                >
                                    {({ isSubmitting, values, setFieldValue, handleChange  }) => (
                                        <Form className="px-8 pt-6 pb-8 mb-4 my-10 bg-white rounded" >
                                            <div className="flex mx-auto justify-center">
                                                <div className=" md:mr-2 md:mb-0 md:w-full justify-center mx-auto">
                                                    <label htmlFor="upload" className='w-100 h-100 block rounded-[50%] cursor-pointer mx-auto mb-2'>
                                                        <img className='w-[125px] h-[125px] block rounded-[50%] cursor-pointer mb-2 ' src={!status && editItem.length !== 0 && !imgCheck ? baseURL + editItem[0].iconImage : !values.iconImage ? ImageHolder : filePreview} alt='img' />
                                                        <input className='hidden' id="upload" name="files" type="file" accept="image/png, image/jpeg, video/mp4, video/x-m4v, video/*, application/pdf" onChange={(event) => {
                                                            const selectedFile = event.target.files[0];
                                                            // Perform validation here
                                                            if (!isValidFileType(selectedFile)) {
                                                                alert.show("Invalid file type. Please select an image or video.");
                                                                return;
                                                            }
                                                            
                                                            if (selectedFile.type.includes('image')) {
                                                                setFieldValue('iconImage', selectedFile);
                                                            }
                                                            setFilePreview(URL.createObjectURL(selectedFile));
                                                            setImgCheck(true);
                                                        }} />
                                                    </label>
                                                    <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2 text-center " name='files'>
                                                        Icon Image
                                                    </label>
                                                    <ErrorMessage className='text-red-600 text-xs text-center' name="files" component="div" />
                                                </div>
                                            </div>
                                            {uploadProgress > 0 && (
                                                <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                                    <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: uploadProgress + '%'}}> {uploadProgress.toFixed(0)+ '%'}</div>
                                                </div>
                                            )}
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