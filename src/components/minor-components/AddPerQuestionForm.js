import cannabisForm from '../../assets/cannabis-form.jpg'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ImageHolder from '../../assets/upload.svg'
import 'rsuite/dist/rsuite.min.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert'
import { baseURL } from '../../constants/baseURL';
import { addQuestions, updateQuestion } from '../../redux/Actions/QuestionsAction';




const SignupSchema = Yup.object().shape({
    image: Yup.string().required('Image is required'),
    question : Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    options: Yup.array().of(
        Yup.object().shape({
            text: Yup.string().required('Option text is required'),
            isCorrect: Yup.boolean().required('Correctness flag is required'),
        })
    ),
    explanation : Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    correctAnswer : Yup.number()
        .required('Required'),
});

export const AddPerQuestionForm = (props) => {
    const status = !props.isAdd ? props.isAdd : true
    const alert = useAlert()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [filePreview, setFilePreview] = useState(null);
    const [editItem, setEditItem] = useState([]);
    const [imgCheck, setImgCheck] = useState(false);
    

    const { products } = useSelector(
        (state) => state.productReducer
    );
    const { perQuestions } = useSelector(
        (state) => state.questionReducer
    )
    const token = useSelector(
        (state) => state.ProfileReducer
    );

    useEffect(() => {
        if (!status) {
            setEditItem(perQuestions?.questions?.filter(
                (product) => product._id === global.editId
            ));
        }
    }, [])

    return (
        <>
            <div className='w-full h-[85vh]'>
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
                                <h3 className="pt-4 text-2xl text-center mt-8 font-bold">{!status ? 'Question Details' : "Add Question"}</h3>
                                <Formik
                                    enableReinitialize
                                    initialValues={
                                        {
                                            image: editItem.length !== 0 ? `${editItem[0].image}` : '',
                                            question: editItem.length !== 0 ? `${editItem[0].question}` : '',
                                            options: [
                                                { text: editItem.length !== 0 ? `${editItem[0].options[0]?.text}` : '' , isCorrect: false },
                                                { text: editItem.length !== 0 ? `${editItem[0].options[1]?.text}` : '', isCorrect: false },
                                                { text: editItem.length !== 0 ? `${editItem[0].options[2]?.text}` : '', isCorrect: false },
                                                { text: editItem.length !== 0 ? `${editItem[0].options[3]?.text}` : '', isCorrect: false },
                                            ],
                                            explanation: editItem.length !== 0 ? `${editItem[0].explanation}` : '',
                                            correctAnswer: editItem.length !== 0 ? editItem[0].correctAnswer : '',
                                        }
                                    }
                                    validationSchema={SignupSchema}
                                    onSubmit={async (values) => {
                                        values.categoryId = params.id;
                                        values.languageType = 'Persian';
                                        var formData = new FormData();
                                        if (!status) {
                                            if (imgCheck) {
                                                let image = values.image
                                                formData.append('image', image)
                                                dispatch(updateQuestion(values, formData, navigate, alert, props.modal , params.id, perQuestions?.id))
                                            }
                                            else {
                                                dispatch(updateQuestion(values, formData, navigate, alert, props.modal , params.id , perQuestions?.id))
                                            }
                                        }
                                        else {
                                            let image = values.image
                                            formData.append('image', image)
                                            dispatch(addQuestions(values, formData, navigate, alert, props.modal, params.id))
                                        }
                                    }}
                                >
                                    {({ isSubmitting, values, setFieldValue, handleChange }) => (
                                        <Form className="px-8 pt-6 pb-8 mb-4  bg-white rounded">
                                            <div className="flex mx-auto justify-center">
                                                <div className=" md:mr-2 md:mb-0 md:w-full justify-center mx-auto">
                                                    <label htmlFor="upload" className='w-[120px] h-[120px] block rounded-[50%] cursor-pointer mx-auto mb-2'>
                                                        <img className='w-[125px] h-[125px] block rounded-[50%] cursor-pointer mb-2 ' src={!status && editItem.length !== 0 && !imgCheck ? baseURL + editItem[0].image : !values.image ? ImageHolder : filePreview} alt='img' />
                                                        <input className='hidden' id="upload" name="image" type="file" accept="image/*" onChange={(event) => {
                                                            setFieldValue("image", event.currentTarget.files[0]);
                                                            setFilePreview(URL.createObjectURL(event.target.files[0]))
                                                            setImgCheck(true)
                                                        }} />
                                                    </label>
                                                    <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2 text-center " name='productPhoto'>
                                                        Question Image
                                                    </label>
                                                    <ErrorMessage className='text-red-600 text-xs text-center' name="productPhoto" component="div" />
                                                </div>
                                            </div>
                                            <div className='flex justify-around '>

                                                <div className='flex flex-col'>
                                                    <div className='flex flex-col justify-around  my-3'>
                                                        <div className=" md:flex md:justify-between w-12/12  md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="question">
                                                                    Question
                                                                </label>
                                                                <Field className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                                                                    type="text" name="question"
                                                                />
                                                                <ErrorMessage className='text-red-600 text-xs' name="question" component="div" />

                                                            </div>
                                                        </div>
                                                        <div className=" md:flex md:justify-between w-12/12 md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="option">
                                                                    Options
                                                                </label>
                                                                
                                                                <div className='flex justify-between gap-2 mt-2'>
                                                                    <Field type="text" name="options[0].text"
                                                                        className="w-6/12 px-3 py-2 text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                                                    />
                                                                    <Field type="text" name="options[1].text"
                                                                        className="w-6/12 px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                                                    />
                                                                </div>
                                                                <div className='flex justify-between gap-2 mt-2'>
                                                                    <Field type="text" name="options[2].text"
                                                                        className="w-6/12 px-3 py-2 text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                                                    />
                                                                    <Field type="text" name="options[3].text"
                                                                        className="w-6/12 px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className=" md:flex md:justify-between w-12/12 md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="option">
                                                                    Correct Option
                                                                </label>
                                                                <Field as="select" name="correctAnswer" className="w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline">
                                                                    <option value={1}>Option 1</option>
                                                                    <option value={2}>Option 2</option>
                                                                    <option value={3}>Option 3</option>
                                                                    <option value={4}>Option 4</option>
                                                                </Field>
                                                            </div>
                                                        </div>
                                                        <div className=" md:flex md:justify-between w-12/12 md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="explanation">
                                                                    Explanation
                                                                </label>
                                                                <Field className='w-full px-3 py-2 text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                                                                    as="textarea" type="text"
                                                                    rows="5" name="explanation"
                                                                />
                                                                <ErrorMessage className='text-red-600 text-xs' name="explanation" component="div" />
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