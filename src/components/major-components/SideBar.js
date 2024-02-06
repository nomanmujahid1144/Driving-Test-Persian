import logo2 from '../../assets/logo.png'
import { useState } from "react"
import dashboardHome from '../../assets/dashboard-home.svg'
import tips from '../../assets/tips.svg'
import video from '../../assets/video.svg'
import category from '../../assets/category.svg'
import questions from '../../assets/question-mark.svg'
import logout from '../../assets/logout.svg'
import slider from '../../assets/sliders-icon.svg'
import results from '../../assets/results.svg'
import { IconBg } from '../minor-components/IconBg'
import { NavLink, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SideBar = () => {

    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    
    const sidebarData = [
        {
            title: 'Dashboard',
            path: '/',
            svg: dashboardHome,


        },
        {
            title: 'Categories',
            path: '/categories',
            svg: category,

        },
        {
            title: 'Questions',
            path: '/questions',
            svg: questions,

        },
        {
            title: 'Dummy Questions',
            path: '/test-questions',
            svg: questions,

        },
        {
            title: 'Results',
            path: '/results',
            svg: results,

        },
        {
            title: 'Video',
            path: '/videos',
            svg: video,

        },
        {
            title: 'Useful Tips',
            path: '/useful-tips',
            svg: tips,

        },
        {
            title: 'Statistics Banner',
            path: '/add-banner',
            svg: slider,

        },
        {
            title: 'Logout',
            path: '/logout',
            svg: logout
        }
    ]

    return (
        <>

            <div style={{ scrollbarWidth: 'none' }} className=' shadow-xl bg-white fixed overflow-y-auto scroll-thin top-0 h-full left-0 w-[18%] 
             md:hidden'>
                <div className=' h-24 bg-gray-50 flex justify-center items-center p-0 m-0'>
                    <img className='mx-auto mt-0 rounded-lg  w-20' src={logo2} alt='logo' />
                </div>
                <ul className='flex flex-col'>
                    {sidebarData.map((item, index) => (
                        <li key={index} className={`font-semibold p-5 flex justify-between  cursor-pointer`}>
                            <IconBg svg={item.svg} />
                            <div className='flex-1 flex justify-between items-center  pl-[20%] text-xs'>
                                {item.path === '/logout' ? (
                                    <p className='text-gray-800' onClick={() => {
                                        localStorage.removeItem('token')
                                        navigate('/login')
                                    }}>{item.title}</p>
                                ) : (
                                    <>
                                        {item.childrens ? (
                                            <>
                                                {console.log(item)}
                                                <div className={open ? "sidebar-item w-full open" : "sidebar-item w-full"}>
                                                    <div className="sidebar-title w-full flex justify-between ">
                                                        <span>
                                                            {item.icon && <i className={item.icon}></i>}
                                                            {item.title}
                                                        </span>
                                                        <FontAwesomeIcon className=" bi-chevron-down toggle-btn " icon="fa-solid fa-angle-up fa-2xl" onClick={() => setOpen(!open)} size='lg' />
                                                    </div>
                                                    <div className="sidebar-content">
                                                        <ul className='flex flex-col'>
                                                            <li className=' p-1 mt-2  flex justify-between  cursor-pointer'>
                                                                <NavLink end to='/all-shops' className={({ isActive }) => (isActive ? 'text-myBg block ml-2' : 'text-gray-800 block ml-2')}>All Shops</NavLink>
                                                            </li>
                                                            <li className=' p-1 mt-2  flex justify-between  cursor-pointer'>
                                                                <NavLink end to='/add-shop' className={({ isActive }) => (isActive ? 'text-myBg block ml-2' : 'text-gray-800 block ml-2')}>Add Shop</NavLink>
                                                            </li>
                                                            {/* <li key={index} onClick={loadWindow}   className={({ isActive }) => (isActive ? 'text-myBg ' : 'text-gray-800 ')}><span className='mt-2 block ml-4'>{child.title.charAt(0).toUpperCase() + child.title.slice(1)}</span> </li>  */}


                                                        </ul>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <NavLink end to={item.path} className={({ isActive }) => (isActive ? 'text-myBg' : 'text-gray-800')}>
                                                {item.title}

                                            </NavLink>
                                        )}

                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
        </>
    )
}
export default SideBar