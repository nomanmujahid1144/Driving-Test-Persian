import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Loader } from "../minor-components/Loader"
import { useAlert } from "react-alert"
import { useNavigate, useParams } from 'react-router';
import { getEngCategoryQuestions } from "../../redux/Actions/TestQuestionsAction"
import { ActionsTable } from "../minor-components/ActionsTable";
import { Modal } from "../minor-components/Modal";
import { AddQuestionForm } from "../minor-components/AddQuestionForm";
import { AddTestQuestionForm } from "../minor-components/AddTestQuestionForm";

const tableColumnsReal = [
    'Question Image',
    'Question',
    'Options',
    'Correct Option',
    'View',
]

export const TestQuestionWebSitePages = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );

    const { engQuestions } = useSelector(
        (state) => state.testQuestionReducer
    )

    useEffect(() => {
        dispatch(getEngCategoryQuestions(alert));
    }, [isUpdateOpen, isOpen])

    return (
        <>
            <div className="bg-gray-50   z-0">
                {!loading ? (
                    <div className=" mt-24  ml-[20%]  w-[78%]">
                        <div className="py-2 bg-gray-50">
                            <div className=' bg-white rounded-lg  shadow-lg'>
                                <div className="flex items-center justify-end py-4 px-4">
                                    <button onClick={() => {
                                        setIsOpen(true)
                                    }}
                                        className='bg-myBg text-gray-600 px-4 py-2 cursor-pointer hover:bg-[#E9D95D]'>
                                        Add Test Question
                                    </button>
                                </div>
                                <Modal open={isOpen} onClose={() => setIsOpen(false)} >
                                    <AddTestQuestionForm modal={setIsOpen} isAdd={true} />
                                </Modal>
                                {console.log(engQuestions?.questions, 'engQuestions?.questions')}
                                <ActionsTable isOpen={isUpdateOpen} tableColumnsReal={tableColumnsReal} checkBox={true} isEngTestQuestion={true} modal={setIsUpdateOpen} key={parseInt(Math.random() * 10000)} tableDataReal={engQuestions.length != 0 ? engQuestions?.questions : []} categroy={engQuestions?.categroy} />
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