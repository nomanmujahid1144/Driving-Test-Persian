import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Loader } from "../minor-components/Loader"
import { useAlert } from "react-alert"
import { useNavigate, useParams } from 'react-router';
import { getPerCategoryQuestions } from "../../redux/Actions/TestQuestionsAction"
import { ActionsTable } from "../minor-components/ActionsTable";
import { Modal } from "../minor-components/Modal";
import { AddQuestionForm } from "../minor-components/AddQuestionForm";
import { AddPerQuestionForm } from "../minor-components/AddPerQuestionForm";
import { AddPerTestQuestionForm } from "../minor-components/AddPerTestQuestionForm";

const tableColumnsReal = [
    'Question Image',
    'Question',
    'Options',
    'Correct Option',
    'View',
]

export const AddPerTestQuestions = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const alert = useAlert();

    
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );

    const { perQuestions } = useSelector(
        (state) => state.testQuestionReducer
    )

    useEffect(() => {
        dispatch(getPerCategoryQuestions(params.id , alert));
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
                                    <AddPerTestQuestionForm modal={setIsOpen} isAdd={true} />
                                </Modal>
                                <ActionsTable isOpen={isUpdateOpen} tableColumnsReal={tableColumnsReal} checkBox={true} isPerQuestion={true} modal={setIsUpdateOpen} key={parseInt(Math.random() * 10000)} tableDataReal={perQuestions.length != 0 ? perQuestions?.questions : []} categroy={perQuestions?.categroy} />
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