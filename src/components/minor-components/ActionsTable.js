import topArrow from '../../assets/top-arrow.svg'
import bottomArrow from '../../assets/bottom-arrow.svg'
import ReactPaginate from "react-paginate";
import { Dropdown } from './DropDown'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import { baseURL } from '../../constants/baseURL';
import { useDispatch } from 'react-redux';
import { deleteProducts } from '../../redux/Actions/ProductActions';
import { deleteCategory } from '../../redux/Actions/CategoryActions';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router';
import { Modal } from './Modal';
import { AddTeacherForm } from './AddTeacherForm';
import { ViewUserDetails } from "../minor-components/ViewUserDetails"
import { AddCategoriesForm } from './AddCategoriesForm';
import { AddQuestionForm } from './AddQuestionForm';
import { AddPerQuestionForm } from './AddPerQuestionForm';
import { deleteTeachers } from '../../redux/Actions/TeacherActions';
import { AddTestQuestionForm } from './AddTestQuestionForm';
import { deleteTestQuestions } from '../../redux/Actions/TestQuestionsAction';
import { deleteQuestions } from '../../redux/Actions/QuestionsAction';
import defaultImage from '../../assets/Default.png'
export const ActionsTable = (props) => {

    const checkBox = props.checkBox ? props.checkBox : false
    const isProduct = props.isProduct ? props.isProduct : false
    const [showDetails, setShowDetails] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [selectedID, setSelectedID] = useState([])
    const alert = useAlert()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const tableColumns = props.tableColumnsReal
    const tableData = props.tableDataReal
    const [data, setData] = useState(tableData);
    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const pagesVisited = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(data?.length / itemsPerPage);
    const [searchText, setSearchText] = useState("");
    const [myFilteredData, setMyFilteredData] = useState([]);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
    const handleChange = value => {
        setSearchText(value);
        filterData(value);
    };
    const handleSelectedID = (id) => {
        if (selectedID.includes(id)) {
            let filteredIDS = selectedID.filter(toBe => toBe !== id);
            setSelectedID(filteredIDS)
        }
        else {
            setSelectedID([...selectedID, id])
        }
    }
    // filter records by search text
    const filterData = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (lowercasedValue === "") setData(tableData);
        else {
            const filteredData = tableData.slice(pagesVisited, pagesVisited + itemsPerPage).filter(item => {
                return Object.keys(item).some(key =>
                    item[key].toString().toLowerCase().includes(lowercasedValue)
                );
            });
            setData(filteredData);
            setMyFilteredData(filteredData)
        }
    }
    if (props.isTeacher) {
        return (
            <div className='py-2 bg-gray-50'>
                <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                    <div className='px-5 pt-4 h-10 my-0 flex flex-col items-start justify-between'>
                        <h2 className='font-semibold text-gray-800 text-lg'>Teachers</h2>
                        <p className='text-xs'>Details</p>
                    </div>
                    <div className="w-full px-4 py-4 my-8 bg-white ">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center justify-start gap-2 h-12">
                                <h2 className='text-xs'>
                                    Show
                                </h2>
                                <div className="flex w-20">
                                    <input type="text"
                                        value={itemsPerPage}
                                        disabled={true}
                                        className="bg-white text-sm text-gray-900 text-center 
                                                 focus:outline-none border border-gray-800 focus:border-gray-600 
                                                rounded-sm w-full h-8 "/>
                                    <div className='flex flex-col items-center gap-2 justify-center ml-[-15px]'>
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage < data.length ? itemsPerPage + 1 : itemsPerPage)} className='w-2 cursor-pointer' src={topArrow} alt='top-arrow' />
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage > 5 ? itemsPerPage - 1 : itemsPerPage)} className='w-2 cursor-pointer' src={bottomArrow} alt='bottom-arrow' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-around gap-2'>
                                <input placeholder="Type to search..."
                                    value={searchText}
                                    onChange={(e) => handleChange(e.target.value)}
                                    type="text"
                                    className="
                                        bg-white text-sm text-gray-900 text-center 
                                        focus:outline-none border border-gray-800 focus:border-gray-600 
                                         rounded-sm w-18 h-8"
                                />
                                <div>
                                    {!selectedID.length <= 0 ? <button onClick={() => dispatch(deleteTeachers(selectedID, navigate, alert))} className='py-2 px-4 bg-myBg text-xs '>Delete Selected Teachers</button> : ''}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col  justify-center h-full py-4">
                            <div className="w-full  mx-auto bg-white shadow-lg rounded-sm ">
                                <div className="py-3 ">
                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full ">
                                            <thead className="text-sm w-full h-14 bg-myBg font-semibold uppercase text-gray-600 ">
                                                <tr>
                                                    {props.checkBox ? (
                                                        <th className='py-4'>
                                                            <p className="p-2 whitespace-nowrap flex items-center w-1/2">
                                                                {/* <input className='mx-2' type="checkbox" id="selectAll" name="A3-confirmation" value="selectAll" /> */}
                                                            </p>
                                                        </th>
                                                    ) : ''}

                                                    {
                                                        tableColumns.map((item, index) => (
                                                            <th key={index} className="p-2 whitespace-nowrap font-semibold text-left">
                                                                {item}
                                                            </th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm  divide-gray-100">

                                                {!searchText ? <>
                                                    {data.slice(pagesVisited, pagesVisited + itemsPerPage).map((item, index) => (
                                                        <tr key={index}>
                                                            {props.checkBox ? (
                                                                <td className={`text-left text-xs px-2 py-8 whitespace-nowrap  ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <input onChange={() => handleSelectedID(item._id)} className='mx-2 cursor-pointer' type="checkbox" />
                                                                </td>
                                                            ) : (
                                                                ''
                                                            )}
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.institutePhoto}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.instituteName}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.teacherName}</p>
                                                            </td>

                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.phoneno}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.email}</p>
                                                            </td>

                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.address}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <button onClick={() => {
                                                                    props.modal(true)
                                                                    global.editId = item._id
                                                                }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddTeacherForm key={parseInt(Math.random() * 10000)} isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </> : <>
                                                    {myFilteredData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className={`text-left text-xs px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <input onChange={() => console.log(item.DBID, "check box value simple")} className='mx-2' type="checkbox" id="DBID" name="DBID" value={item.DBID} />
                                                            </td>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.institutePhoto}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.instituteName}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.teacherName}</p>
                                                            </td>

                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.phoneno}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.email}</p>
                                                            </td>

                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.address}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <button onClick={() => {
                                                                    props.modal(true)
                                                                    global.editId = item._id
                                                                }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddTeacherForm key={parseInt(Math.random() * 10000)} isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </>
                                                }
                                                {data.length === 0 && <p className='py-8 px-2 font-semibold'>No Records Found By This Key Word </p>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='text-xs text-left'>
                                Showing {data.slice(pagesVisited, pagesVisited + itemsPerPage).length} results of {data.length}
                            </p>
                            <div className='flex items-center justify-center'>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    pageCount={pageCount}
                                    onPageChange={changePage}
                                    containerClassName={"flex justify-between gap-3 items-center w-full text-xs rounded no-underline"}
                                    previousLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    nextLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    disabledClassName={"pointer-events-none no-underline"}
                                    activeClassName={"py-2 px-4 rounded bg-myBg hover:bg-[#edcb58] hover:text-white text-xs mx-2 no-underline"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }else if (props.isEngTestQuestion) {
        return (
            <div className='py-2 bg-gray-50'>
                <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                    <div className='px-5 pt-4 h-10 my-0 flex flex-col items-start justify-between'>
                        <h2 className='font-semibold text-gray-800 text-lg'>Questions</h2>
                        <p className='text-xs'>Details</p>
                    </div>
                    <div className="w-full px-4 py-4 my-8 bg-white ">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center justify-start gap-2 h-12">
                                <h2 className='text-xs'>
                                    Show
                                </h2>
                                <div className="flex w-20">
                                    <input type="text"
                                        value={itemsPerPage}
                                        disabled={true}
                                        className="bg-white text-sm text-gray-900 text-center 
                                                 focus:outline-none border border-gray-800 focus:border-gray-600 
                                                rounded-sm w-full h-8 "/>
                                    <div className='flex flex-col items-center gap-2 justify-center ml-[-15px]'>
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage < data.length ? itemsPerPage + 1 : itemsPerPage)} className='w-2 cursor-pointer' src={topArrow} alt='top-arrow' />
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage > 5 ? itemsPerPage - 1 : itemsPerPage)} className='w-2 cursor-pointer' src={bottomArrow} alt='bottom-arrow' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-around gap-2'>
                                <input placeholder="Type to search..."
                                    value={searchText}
                                    onChange={(e) => handleChange(e.target.value)}
                                    type="text"
                                    className="
                                        bg-white text-sm text-gray-900 text-center 
                                        focus:outline-none border border-gray-800 focus:border-gray-600 
                                         rounded-sm w-18 h-8"
                                />
                                <div>
                                    {!selectedID.length <= 0 ? <button onClick={() => dispatch(deleteTestQuestions(selectedID, navigate, alert))} className='py-2 px-4 bg-myBg text-xs '>Delete Selected Product</button> : ''}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col  justify-center h-full py-4">
                            <div className="w-full  mx-auto bg-white shadow-lg rounded-sm ">
                                <div className="py-3 ">
                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full ">
                                            <thead className="text-sm w-full h-14 bg-myBg font-semibold uppercase text-gray-600 ">
                                                <tr>
                                                    {props.checkBox ? (
                                                        <th className='py-4'>
                                                            <p className="p-2 whitespace-nowrap flex items-center w-1/2">
                                                                {/* <input className='mx-2' type="checkbox" id="selectAll" name="A3-confirmation" value="selectAll" /> */}
                                                            </p>
                                                        </th>
                                                    ) : ''}

                                                    {
                                                        tableColumns.map((item, index) => (
                                                            <th key={index} className="p-2 whitespace-nowrap font-semibold text-left">
                                                                {item}
                                                            </th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm  divide-gray-100">
                                                {console.log(data, 'Data')}
                                                {!searchText ? <>
                                                    {data.slice(pagesVisited, pagesVisited + itemsPerPage).map((item, index) => (
                                                        <tr key={index}>
                                                            {props.checkBox ? (
                                                                <td className={`text-left text-xs px-2 py-8 whitespace-nowrap  ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <input onChange={() => handleSelectedID(item._id)} className='mx-2 cursor-pointer' type="checkbox" />
                                                                </td>
                                                            ) : (
                                                                ''
                                                            )}
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.image}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.question}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.options.map((option) => {return (option.text)}).join(' / ')}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.correctAnswer}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <button onClick={() => {
                                                                    props.modal(true)
                                                                    global.testEditId = index;
                                                                    global.testIndex = index;
                                                                }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddTestQuestionForm key={parseInt(Math.random() * 10000)}  isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </> : <>
                                                    {myFilteredData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className={`text-left text-xs px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <input onChange={() => console.log(item.DBID, "check box value simple")} className='mx-2' type="checkbox" id="DBID" name="DBID" value={item.DBID} />
                                                            </td>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.image}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.question}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.options.map((option) => {return (option.text)}).join(' / ')}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.correctAnswer}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <button onClick={() => {
                                                                    props.modal(true)
                                                                    global.testEditId = index;
                                                                    global.testIndex = index;
                                                                }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddTeacherForm key={parseInt(Math.random() * 10000)} isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </>
                                                }
                                                {data.length === 0 && <p className='py-8 px-2 font-semibold'>No Records Found By This Key Word </p>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='text-xs text-left'>
                                Showing {data.slice(pagesVisited, pagesVisited + itemsPerPage).length} results of {data.length}
                            </p>
                            <div className='flex items-center justify-center'>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    pageCount={pageCount}
                                    onPageChange={changePage}
                                    containerClassName={"flex justify-between gap-3 items-center w-full text-xs rounded no-underline"}
                                    previousLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    nextLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    disabledClassName={"pointer-events-none no-underline"}
                                    activeClassName={"py-2 px-4 rounded bg-myBg hover:bg-[#edcb58] hover:text-white text-xs mx-2 no-underline"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }else if (props.isEngQuestion) {
        return (
            <div className='py-2 bg-gray-50'>
                <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                    <div className='px-5 pt-4 h-10 my-0 flex flex-col items-start justify-between'>
                        <h2 className='font-semibold text-gray-800 text-lg'>Questions</h2>
                        <p className='text-xs'>Details</p>
                    </div>
                    <div className="w-full px-4 py-4 my-8 bg-white ">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center justify-start gap-2 h-12">
                                <h2 className='text-xs'>
                                    Show
                                </h2>
                                <div className="flex w-20">
                                    <input type="text"
                                        value={itemsPerPage}
                                        disabled={true}
                                        className="bg-white text-sm text-gray-900 text-center 
                                                 focus:outline-none border border-gray-800 focus:border-gray-600 
                                                rounded-sm w-full h-8 "/>
                                    <div className='flex flex-col items-center gap-2 justify-center ml-[-15px]'>
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage < data.length ? itemsPerPage + 1 : itemsPerPage)} className='w-2 cursor-pointer' src={topArrow} alt='top-arrow' />
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage > 5 ? itemsPerPage - 1 : itemsPerPage)} className='w-2 cursor-pointer' src={bottomArrow} alt='bottom-arrow' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-around gap-2'>
                                <input placeholder="Type to search..."
                                    value={searchText}
                                    onChange={(e) => handleChange(e.target.value)}
                                    type="text"
                                    className="
                                        bg-white text-sm text-gray-900 text-center 
                                        focus:outline-none border border-gray-800 focus:border-gray-600 
                                         rounded-sm w-18 h-8"
                                />
                                <div>
                                    {!selectedID.length <= 0 ? <button onClick={() => dispatch(deleteQuestions(selectedID, params.id , navigate, alert))} className='py-2 px-4 bg-myBg text-xs '>Delete Selected Product</button> : ''}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col  justify-center h-full py-4">
                            <div className="w-full  mx-auto bg-white shadow-lg rounded-sm ">
                                <div className="py-3 ">
                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full ">
                                            <thead className="text-sm w-full h-14 bg-myBg font-semibold uppercase text-gray-600 ">
                                                <tr>
                                                    {props.checkBox ? (
                                                        <th className='py-4'>
                                                            <p className="p-2 whitespace-nowrap flex items-center w-1/2">
                                                                {/* <input className='mx-2' type="checkbox" id="selectAll" name="A3-confirmation" value="selectAll" /> */}
                                                            </p>
                                                        </th>
                                                    ) : ''}

                                                    {
                                                        tableColumns.map((item, index) => (
                                                            <th key={index} className="p-2 whitespace-nowrap font-semibold text-left">
                                                                {item}
                                                            </th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm  divide-gray-100">
                                                {console.log(data, 'Data')}
                                                {!searchText ? <>
                                                    {data?.slice(pagesVisited, pagesVisited + itemsPerPage).map((item, index) => (
                                                        <tr key={index}>
                                                            {props.checkBox ? (
                                                                <td className={`text-left text-xs px-2 py-8 whitespace-nowrap  ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <input onChange={() => handleSelectedID(item._id)} className='mx-2 cursor-pointer' type="checkbox" />
                                                                </td>
                                                            ) : (
                                                                ''
                                                            )}
                                                            {item.video !== '' ?
                                                                <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <video controls className="rounded-t-lg w-20  h-20">
                                                                        <source src={item?.video !== '' ? baseURL + item?.video : `https://flowbite.com/docs/images/blog/image-1.jpg`} ></source>
                                                                    </video>
                                                                </td>
                                                            :
                                                            item.image !== '' ?
                                                                <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <img src={`${baseURL}${item.image}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                                </td>
                                                            :
                                                                <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <img src={defaultImage} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                                </td>
                                                            }
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.question}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.options.map((option) => {return (option.text)}).join(' / ')}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.correctAnswer}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <button onClick={() => {
                                                                    props.modal(true)
                                                                    global.editId = index;
                                                                    global.index = index;
                                                                }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddQuestionForm key={parseInt(Math.random() * 10000)}  isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </> : <>
                                                    {myFilteredData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className={`text-left text-xs px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <input onChange={() => console.log(item.DBID, "check box value simple")} className='mx-2' type="checkbox" id="DBID" name="DBID" value={item.DBID} />
                                                            </td>
                                                            {item.video !== '' ?
                                                                <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <video controls className="rounded-t-lg w-20  h-20">
                                                                        <source src={item?.video !== '' ? baseURL + item?.video : `https://flowbite.com/docs/images/blog/image-1.jpg`} ></source>
                                                                    </video>
                                                                </td>
                                                            :
                                                                <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <img src={`${baseURL}${item.image}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                                </td>
                                                            }
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.question}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.options.map((option) => {return (option.text)}).join(' / ')}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.correctAnswer}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <button onClick={() => {
                                                                    props.modal(true)
                                                                    global.editId = index;
                                                                    global.index = index;
                                                                }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddTeacherForm key={parseInt(Math.random() * 10000)} isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </>
                                                }
                                                {data?.length === 0 && <p className='py-8 px-2 font-semibold'>No Records Found By This Key Word </p>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='text-xs text-left'>
                                Showing {data?.slice(pagesVisited, pagesVisited + itemsPerPage)?.length} results of {data?.length}
                            </p>
                            <div className='flex items-center justify-center'>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    pageCount={pageCount}
                                    onPageChange={changePage}
                                    containerClassName={"flex justify-between gap-3 items-center w-full text-xs rounded no-underline"}
                                    previousLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    nextLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    disabledClassName={"pointer-events-none no-underline"}
                                    activeClassName={"py-2 px-4 rounded bg-myBg hover:bg-[#edcb58] hover:text-white text-xs mx-2 no-underline"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }else if (props.isResultofEachDevice) {
        return (
            <div className='py-2 bg-gray-50'>
                <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                    <div className='px-5 pt-4 h-10 my-0 flex flex-col items-start justify-between'>
                        <h2 className='font-semibold text-gray-800 text-lg'>Result of Each Device</h2>
                        <p className='text-xs'>Details</p>
                    </div>
                    <div className="w-full px-4 py-4 my-8 bg-white ">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center justify-start gap-2 h-12">
                                <h2 className='text-xs'>
                                    Show
                                </h2>
                                <div className="flex w-20">
                                    <input type="text"
                                        value={itemsPerPage}
                                        disabled={true}
                                        className="bg-white text-sm text-gray-900 text-center 
                                                 focus:outline-none border border-gray-800 focus:border-gray-600 
                                                rounded-sm w-full h-8 "/>
                                    <div className='flex flex-col items-center gap-2 justify-center ml-[-15px]'>
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage < data.length ? itemsPerPage + 1 : itemsPerPage)} className='w-2 cursor-pointer' src={topArrow} alt='top-arrow' />
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage > 5 ? itemsPerPage - 1 : itemsPerPage)} className='w-2 cursor-pointer' src={bottomArrow} alt='bottom-arrow' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-around gap-2'>
                                <input placeholder="Type to search..."
                                    value={searchText}
                                    onChange={(e) => handleChange(e.target.value)}
                                    type="text"
                                    className="
                                        bg-white text-sm text-gray-900 text-center 
                                        focus:outline-none border border-gray-800 focus:border-gray-600 
                                         rounded-sm w-18 h-8"
                                />
                                <div>
                                    {!selectedID.length <= 0 ? <button onClick={() => dispatch(deleteProducts(selectedID, navigate, alert))} className='py-2 px-4 bg-myBg text-xs '>Delete Selected Product</button> : ''}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col  justify-center h-full py-4">
                            <div className="w-full  mx-auto bg-white shadow-lg rounded-sm ">
                                <div className="py-3 ">
                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full ">
                                            <thead className="text-sm w-full h-14 bg-myBg font-semibold uppercase text-gray-600 ">
                                                <tr>
                                                    {/* {props.checkBox ? (
                                                        <th className='py-4'>
                                                            <p className="p-2 whitespace-nowrap flex items-center w-1/2">
                                                                <input className='mx-2' type="checkbox" id="selectAll" name="A3-confirmation" value="selectAll" />
                                                            </p>
                                                        </th>
                                                    ) : ''} */}

                                                    {
                                                        tableColumns.map((item, index) => (
                                                            <th key={index} className="p-2 whitespace-nowrap font-semibold text-left">
                                                                {item}
                                                            </th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm  divide-gray-100">

                                                {!searchText ? <>
                                                    {data.slice(pagesVisited, pagesVisited + itemsPerPage).map((item, index) => (
                                                        <tr key={index}>
                                                            {/* {props.checkBox ? (
                                                                <td className={`text-left text-xs px-2 py-8 whitespace-nowrap  ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <input onChange={() => handleSelectedID(item._id)} className='mx-2 cursor-pointer' type="checkbox" />
                                                                </td>
                                                            ) : (
                                                                ''
                                                            )} */}
                                                            
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.deviceId}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.totalTests}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.testResult}</p>
                                                            </td>
                                                            {/* <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <button onClick={() => {
                                                                    props.modal(true)
                                                                    global.editId = item._id;
                                                                    global.index = index;
                                                                }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                    View
                                                                </button>
                                                            </td> */}
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddPerQuestionForm key={parseInt(Math.random() * 10000)}  isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </> : <>
                                                    {myFilteredData.map((item, index) => (
                                                        <tr key={index}>
                                                            {/* <td className={`text-left text-xs px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <input onChange={() => console.log(item.DBID, "check box value simple")} className='mx-2' type="checkbox" id="DBID" name="DBID" value={item.DBID} />
                                                            </td> */}
                                                           <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.deviceId}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.totalTests}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.testResult}</p>
                                                            </td>
                                                            {/* <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <button onClick={() => {
                                                                    props.modal(true)
                                                                    global.editId = item._id;
                                                                    global.index = index;
                                                                }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                    View
                                                                </button>
                                                            </td> */}
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddPerQuestionForm key={parseInt(Math.random() * 10000)} isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </>
                                                }
                                                {data.length === 0 && <p className='py-8 px-2 font-semibold'>No Records Found By This Key Word </p>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='text-xs text-left'>
                                Showing {data.slice(pagesVisited, pagesVisited + itemsPerPage).length} results of {data.length}
                            </p>
                            <div className='flex items-center justify-center'>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    pageCount={pageCount}
                                    onPageChange={changePage}
                                    containerClassName={"flex justify-between gap-3 items-center w-full text-xs rounded no-underline"}
                                    previousLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    nextLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    disabledClassName={"pointer-events-none no-underline"}
                                    activeClassName={"py-2 px-4 rounded bg-myBg hover:bg-[#edcb58] hover:text-white text-xs mx-2 no-underline"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    else if (props.isCategory) {
        return (
            <div className='py-2 bg-gray-50'>
                <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                    <div className='px-5 pt-4 h-10 my-0 flex flex-col items-start justify-between'>
                        <h2 className='font-semibold text-gray-800 text-lg'>Categories</h2>
                        <p className='text-xs'>Details</p>
                    </div>
                    <div className="w-full px-4 py-4 my-8 bg-white ">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center justify-start gap-2 h-12">
                                <h2 className='text-xs'>
                                    Show
                                </h2>
                                <div className="flex w-20">
                                    <input type="text"
                                        value={itemsPerPage}
                                        disabled={true}
                                        className="bg-white text-sm text-gray-900 text-center 
                                                 focus:outline-none border border-gray-800 focus:border-gray-600 
                                                rounded-sm w-full h-8 "/>
                                    <div className='flex flex-col items-center gap-2 justify-center ml-[-15px]'>
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage < data.length ? itemsPerPage + 1 : itemsPerPage)} className='w-2 cursor-pointer' src={topArrow} alt='top-arrow' />
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage > 5 ? itemsPerPage - 1 : itemsPerPage)} className='w-2 cursor-pointer' src={bottomArrow} alt='bottom-arrow' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-around gap-2'>
                                <input placeholder="Type to search..."
                                    value={searchText}
                                    onChange={(e) => handleChange(e.target.value)}
                                    type="text"
                                    className="
                                        bg-white text-sm text-gray-900 text-center 
                                        focus:outline-none border border-gray-800 focus:border-gray-600 
                                         rounded-sm w-18 h-8"
                                />
                                <div>
                                    {!selectedID.length <= 0 ? <button onClick={() => dispatch(deleteCategory(selectedID, navigate, alert))} className='py-2 px-4 bg-myBg text-xs '>Delete Selected Categories</button> : ''}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col  justify-center h-full py-4">
                            {console.log(props.tableDataReal, ': data')}
                            <div className="w-full  mx-auto bg-white shadow-lg rounded-sm ">
                                <div className="py-3 ">
                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full ">
                                            <thead className="text-sm w-full h-14 bg-myBg font-semibold uppercase text-gray-600 ">
                                                <tr>
                                                    {props.checkBox ? (
                                                        <th className='py-4'>
                                                            <p className="p-2 whitespace-nowrap flex items-center w-1/2">
                                                                {/* <input className='mx-2' type="checkbox" id="selectAll" name="A3-confirmation" value="selectAll" /> */}
                                                            </p>
                                                        </th>
                                                    ) : ''}

                                                    {
                                                        tableColumns.map((item, index) => (
                                                            <th key={index} className="p-2 whitespace-nowrap font-semibold text-left">
                                                                {item}
                                                            </th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm  divide-gray-100">

                                                {!searchText ? <>
                                                    {data.slice(pagesVisited, pagesVisited + itemsPerPage).map((item, index) => (
                                                        <tr key={index}>
                                                            {props.checkBox ? (
                                                                <td className={`text-left text-xs px-2 py-8 whitespace-nowrap  ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <input onChange={() => handleSelectedID(item._id)} className='mx-2 cursor-pointer' type="checkbox" />
                                                                </td>
                                                            ) : (
                                                                ''
                                                            )}
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.categoryPhoto}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.brand}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.category.join(' / ')}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.subCategory.join(' / ')}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.type.join(' / ')}</p>
                                                            </td>
                                                            {props.isProduct ? (
                                                                <td className={`text-left text-md px-2 py-8 whitespace-nowrap  ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <button onClick={() => {
                                                                        props.modal(true)
                                                                        global.editId = item._id
                                                                    }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                        View
                                                                    </button>
                                                                </td>
                                                            ) :
                                                                <>
                                                                    <td className={`text-left text-md px-2 py-8 whitespace-nowrap  ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                        <button onClick={() => {
                                                                            props.modal(true)
                                                                            global.editId = item._id
                                                                        }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                            View
                                                                        </button>
                                                                    </td>
                                                                </>}
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddCategoriesForm key={parseInt(Math.random() * 10000)} isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </> : <>
                                                    {myFilteredData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className={`text-left text-xs px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <input onChange={() => console.log(item.DBID, "check box value simple")} className='mx-2' type="checkbox" id="DBID" name="DBID" value={item.DBID} />
                                                            </td>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.categoryPhoto}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.brand}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.category}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.subCategory}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className="text-left text-md">{item.type}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <button onClick={() => {
                                                                    props.modal(true)
                                                                    global.editId = item._id
                                                                }} className='py-2 px-4 bg-myBg text-xs rounded-lg'>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <Modal open={props.isOpen} onClose={() => props.modal(false)} >
                                                        <AddCategoriesForm key={parseInt(Math.random() * 10000)} isAdd={false} modal={props.modal} />
                                                    </Modal>
                                                </>
                                                }
                                                {data.length === 0 && <p className='py-8 px-2 font-semibold'>No Records Found By This Key Word </p>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='text-xs text-left'>
                                Showing {data.slice(pagesVisited, pagesVisited + itemsPerPage).length} results of {data.length}
                            </p>
                            <div className='flex items-center justify-center'>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    pageCount={pageCount}
                                    onPageChange={changePage}
                                    containerClassName={"flex justify-between gap-3 items-center w-full text-xs rounded no-underline"}
                                    previousLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    nextLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    disabledClassName={"pointer-events-none no-underline"}
                                    activeClassName={"py-2 px-4 rounded bg-myBg hover:bg-[#edcb58] hover:text-white text-xs mx-2 no-underline"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )















    }
    else if (props.isUser) {
        return (
            <div className='py-2 bg-gray-50'>
                <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                    <div className='px-5 pt-4 h-10 my-0 flex flex-col items-start justify-between'>
                        <h2 className='font-semibold text-gray-800 text-lg'>{props.type}</h2>
                        <p className='text-xs'>Details</p>
                    </div>
                    <div className="w-full px-4 py-4 my-8 bg-white ">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center justify-start gap-2 h-12">
                                <h2 className='text-xs'>
                                    Show
                                </h2>
                                <div className="flex w-20">
                                    <input type="text"
                                        value={itemsPerPage}
                                        // onChange={(e) => { setItemsPerPage(e.target.value) }}
                                        disabled={true}
                                        className="bg-white text-sm text-gray-900 text-center 
                                             focus:outline-none border border-gray-800 focus:border-gray-600 
                                            rounded-sm w-full h-8 "/>
                                    <div className='flex flex-col items-center gap-2 justify-center ml-[-15px]'>
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage < data.length ? itemsPerPage + 1 : itemsPerPage)} className='w-2 cursor-pointer' src={topArrow} alt='top-arrow' />
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage > 5 ? itemsPerPage - 1 : itemsPerPage)} className='w-2 cursor-pointer' src={bottomArrow} alt='bottom-arrow' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-around gap-2'>
                                <input placeholder="Type to search..."
                                    value={searchText}
                                    onChange={(e) => handleChange(e.target.value)}
                                    type="text"
                                    className="
                                    bg-white text-sm text-gray-900 text-center 
                                    focus:outline-none border border-gray-800 focus:border-gray-600 
                                     rounded-sm w-18 h-8"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col  justify-center h-full py-4">
                            <div className="w-full  mx-auto bg-white shadow-lg rounded-sm ">
                                <div className="py-3 ">
                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full ">
                                            <thead className="text-sm w-full h-14 bg-myBg font-semibold uppercase text-gray-600 ">
                                                <tr>
                                                    {props.checkBox ? (
                                                        <th className='py-4'>
                                                            <p className="p-2 whitespace-nowrap flex items-center w-1/2">
                                                                {/* <input className='mx-2' type="checkbox" id="selectAll" name="A3-confirmation" value="selectAll" /> */}
                                                            </p>
                                                        </th>
                                                    ) : ''}

                                                    {
                                                        tableColumns.map((item, index) => (
                                                            <th key={index} className="p-2 whitespace-nowrap font-semibold text-left">
                                                                {item}
                                                            </th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm  divide-gray-100">

                                                {!searchText ? <>
                                                    {data?.slice(pagesVisited, pagesVisited + itemsPerPage).map((item, index) => (
                                                        <tr key={index}>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.profilePhoto}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}> {item.fullName}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.email}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.phoneNumber}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.deactivate == 1 ? "Activate" : "Deactivated"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.verified ? "verified" : "un-verified"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.blocked ? "blocked" : "un-blocked"}</p>
                                                            </td>

                                                            {/* {props.type === 'Deactivate Users' ?
                                                                <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    <p className={`text-left text-md `}>{item.deactivate == 1 ? "Activate" : "Deactivated"}</p>
                                                                </td>
                                                            :null}
                                                            {props.type === 'Users' ?
                                                                <>
                                                                    <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                        <p className={`text-left text-md `}>{item.verified ? "verified" : "un-verified"}</p>
                                                                    </td>
                                                                    <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                        <p className={`text-left text-md `}>{item.blocked ? "blocked" : "un-blocked"}</p>
                                                                    </td>
                                                                </>
                                                            :null} */}


                                                            <td className={`text-left text-md relative px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <Dropdown isUser={true} id={item._id} verified={item.verified} blocked={item.blocked} deactivate={item.deactivate} />
                                                            </td>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>
                                                                    <button
                                                                        onClick={() => {
                                                                            setShowDetails(item)
                                                                            setIsOpen(true)
                                                                        }}
                                                                        className='py-2 px-4 bg-myBg text-xs rounded-lg hover:bg-[#050504]'>
                                                                        View Details
                                                                    </button>
                                                                </p>
                                                            </td>

                                                        </tr>
                                                    ))}
                                                    <div className="px-4">
                                                        {showDetails ? (
                                                            <Modal open={isOpen} onClose={() => setIsOpen(false)} >
                                                                <ViewUserDetails showDetails={showDetails} />
                                                            </Modal>
                                                        ) : null}
                                                    </div>
                                                </> : <>
                                                    {myFilteredData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.profilePhoto}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}> {item.fullName}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.email}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.phoneNumber}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.deactivate == 1 ? "Activate" : "Deactivated"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.verified ? "verified" : "un-verified"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.blocked ? "blocked" : "un-blocked"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 relative py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <Dropdown id={item._id} isUser={true} verified={item.verified} blocked={item.blocked} deactivate={item.deactivate} />
                                                            </td>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>
                                                                    <button
                                                                        onClick={() => {
                                                                            setShowDetails(item)
                                                                            setIsOpen(true)
                                                                        }}
                                                                        className='py-2 px-4 bg-myBg text-xs rounded-lg hover:bg-[#050504]'>
                                                                        View Details
                                                                    </button>
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                </>
                                                }
                                                {data.length === 0 && <p className='py-8 px-2 font-semibold'>No Records Found By This Key Word </p>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='text-xs text-left'>
                                Showing {data.slice(pagesVisited, pagesVisited + itemsPerPage).length} results of {data.length}
                            </p>
                            <div className='flex items-center justify-center'>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    pageCount={pageCount}
                                    onPageChange={changePage}
                                    containerClassName={"flex justify-between gap-3 items-center w-full text-xs rounded no-underline"}
                                    previousLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    nextLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    disabledClassName={"pointer-events-none no-underline"}
                                    activeClassName={"py-2 px-4 rounded bg-myBg hover:bg-[#edcb58] hover:text-white text-xs mx-2 no-underline"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
    else {
        return (
            <div className='py-2 bg-gray-50'>
                <div className='divide-y  divide-gray-100 bg-white rounded-lg  shadow-lg'>
                    <div className='px-5 pt-4 h-10 my-0 flex flex-col items-start justify-between'>
                        <h2 className='font-semibold text-gray-800 text-lg'>Drivers</h2>
                        <p className='text-xs'>Details</p>
                    </div>
                    <div className="w-full px-4 py-4 my-8 bg-white ">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center justify-start gap-2 h-12">
                                <h2 className='text-xs'>
                                    Show
                                </h2>
                                <div className="flex w-20">
                                    <input type="text"
                                        value={itemsPerPage}
                                        // onChange={(e) => { setItemsPerPage(e.target.value) }}
                                        disabled={true}
                                        className="bg-white text-sm text-gray-900 text-center 
                                             focus:outline-none border border-gray-800 focus:border-gray-600 
                                            rounded-sm w-full h-8 "/>
                                    <div className='flex flex-col items-center gap-2 justify-center ml-[-15px]'>
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage < data.length ? itemsPerPage + 1 : itemsPerPage)} className='w-2 cursor-pointer' src={topArrow} alt='top-arrow' />
                                        <img onClick={(e) => setItemsPerPage(itemsPerPage > 5 ? itemsPerPage - 1 : itemsPerPage)} className='w-2 cursor-pointer' src={bottomArrow} alt='bottom-arrow' />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-around gap-2'>
                                <input placeholder="Type to search..."
                                    value={searchText}
                                    onChange={(e) => handleChange(e.target.value)}
                                    type="text"
                                    className="
                                    bg-white text-sm text-gray-900 text-center 
                                    focus:outline-none border border-gray-800 focus:border-gray-600 
                                     rounded-sm w-18 h-8"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col  justify-center h-full py-4">
                            <div className="w-full  mx-auto bg-white shadow-lg rounded-sm ">
                                <div className="py-3 ">
                                    <div className="overflow-x-auto">
                                        <table className="table-auto w-full ">
                                            <thead className="text-sm w-full h-14 bg-myBg font-semibold uppercase text-gray-600 ">
                                                <tr>
                                                    {props.checkBox ? (
                                                        <th className='py-4'>
                                                            <p className="p-2 whitespace-nowrap flex items-center w-1/2">
                                                                {/* <input className='mx-2' type="checkbox" id="selectAll" name="A3-confirmation" value="selectAll" /> */}
                                                            </p>
                                                        </th>
                                                    ) : ''}

                                                    {
                                                        tableColumns.map((item, index) => (
                                                            <th key={index} className="p-2 whitespace-nowrap font-semibold text-left">
                                                                {item}
                                                            </th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm  divide-gray-100">

                                                {!searchText ? <>
                                                    {data.slice(pagesVisited, pagesVisited + itemsPerPage).map((item, index) => (
                                                        <tr key={index}>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.profilePhoto}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}> {item.fullName}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.email}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.phoneNumber}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.drivingLicense}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.deactivate == 1 ? "Activate" : "Deactivated"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.verified ? "verified" : "un-verified"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.blocked ? "blocked" : "un-blocked"}</p>
                                                            </td>
                                                            <td className={`text-left text-md relative px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <Dropdown id={item._id} verified={item.verified} blocked={item.blocked} deactivate={item.deactivate} />
                                                            </td>

                                                        </tr>
                                                    ))}

                                                </> : <>
                                                    {myFilteredData.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <img src={`${baseURL}${item.profilePhoto}`} className={`text-left text-xs w-14 h-14 rounded-[50%]`} />
                                                            </td>
                                                            <td className={`text-left  px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}> {item.fullName}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.email}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.phoneNumber}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.drivingLicense}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.deactivate == 1 ? "Activate" : "Deactivated"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.verified ? "verified" : "un-verified"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <p className={`text-left text-md `}>{item.blocked ? "blocked" : "un-blocked"}</p>
                                                            </td>
                                                            <td className={`text-left text-md px-2 relative py-8 whitespace-nowrap ${index % 2 !== 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                <Dropdown id={item._id} verified={item.verified} blocked={item.blocked} deactivate={item.deactivate} />
                                                            </td>


                                                        </tr>
                                                    ))}

                                                </>
                                                }
                                                {data.length === 0 && <p className='py-8 px-2 font-semibold'>No Records Found By This Key Word </p>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <p className='text-xs text-left'>
                                Showing {data.slice(pagesVisited, pagesVisited + itemsPerPage).length} results of {data.length}
                            </p>
                            <div className='flex items-center justify-center'>
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    pageCount={pageCount}
                                    onPageChange={changePage}
                                    containerClassName={"flex justify-between gap-3 items-center w-full text-xs rounded no-underline"}
                                    previousLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    nextLinkClassName={"py-2 px-4 rounded bg-gray-200 w-24 hover:bg-gray-300 mx-2 no-underline"}
                                    disabledClassName={"pointer-events-none no-underline"}
                                    activeClassName={"py-2 px-4 rounded bg-myBg hover:bg-[#edcb58] hover:text-white text-xs mx-2 no-underline"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

}