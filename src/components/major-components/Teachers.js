import { ActionsTable } from "../minor-components/ActionsTable"
import { useEffect, useState, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Modal } from "../minor-components/Modal"
import { Loader } from "../minor-components/Loader"
import { AddTeacherForm } from "../minor-components/AddTeacherForm"
import { getTeachers } from "../../redux/Actions/TeacherActions"

const tableColumnsReal = [
    'Institute Photo',
    'Institute Name',
    'Teacher Name',
    'Phone No',
    'Email',
    'Address',
    'View Data',
]
export const Teachers = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

 
    const { teachers } = useSelector(
        (state) => state.teacherReducer
    );
    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );

    useEffect(() => {
        dispatch(getTeachers());
    }, [isOpen, isUpdateOpen])

    return (
        <>
            <div className="bg-gray-50   z-0">
            {!loading ? (
                <div className=" mt-24 bg-gray-50 ml-[20%]  w-[78%]">
                    <div className="flex items-center justify-end py-4 px-4">
                        <button onClick={() => {
                            setIsOpen(true)
                        }}
                            className='bg-myBg text-gray-600 px-4 py-2 cursor-pointer hover:bg-[#E9D95D]'>
                            Add Driving Teacher
                        </button>
                    </div>
                    <Modal open={isOpen} onClose={() => setIsOpen(false)} >
                        <AddTeacherForm modal={setIsOpen} isAdd={true} />
                    </Modal>
                    {
                        teachers.length === 0 ? (
                            <div className="flex justify-center items-center py-8 text-lg h-screen">No Teacher Found</div>
                        )
                            : (
                                <ActionsTable isOpen={isUpdateOpen} tableColumnsReal={tableColumnsReal} checkBox={true} isTeacher={true} modal={setIsUpdateOpen} key={parseInt(Math.random() * 10000)} tableDataReal={teachers} />
                            )
                    }
                </div>
            ):(
                <Loader />
            )} 
               
            </div>
        </>
    )
}