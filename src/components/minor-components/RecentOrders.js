import menu from '../../assets/menu.svg'
import downArrow from '../../assets/down-arrow.svg'
export const Recentorders = () => {
    return (
        <section className="w-[65%]  py-0">
            <div className="flex flex-col justify-center ">
                <div className="w-full max-w-3xl bg-white shadow-lg rounded-md">
                    <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className='flex flex-col'>
                            <h2 className="font-semibold text-gray-800 text-lg">Customers</h2>
                            <p className="text-xs">Lorem Ipsum</p>
                        </div>
                        <div className='flex w-18'>
                            <p className=" w-full flex-2 pr-8 pl-2 py-2.5 bg-slate-300 border-1 text-xs text-green-700 rounded-2xl">Newest</p>
                            <img className="w-4 mt-1 ml-[-22px]" src={downArrow} alt="filter" />
                        </div>

                    </header>
                    <div className="p-3">
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                    {/* <tr>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">Name</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">Email</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">Spent</div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-center">Country</div>
                                        </th>
                                    </tr> */}
                                </thead>
                                <tbody className="text-xs divide-y  divide-gray-100">
                                    <tr className=''>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full border border-gray-500" src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="40" height="40" alt="Alex Shatov" /></div>
                                                <div className="font-medium text-gray-800 flex flex-col justify-center">
                                                    <h2 className='text-xs'>Alex Shatov</h2>
                                                    <p className="text-xs text-orange-300">#112233</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left flex flex-col">
                                                <h2 className='text-xs'>Aftab Alam</h2>
                                                <p className="text-xs text-gray-500">XYZ room 2 Islamabad</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left text-sm flex flex-col gap-2">
                                                <p className="text-sm">$21</p>
                                                <p className="text-xs">&#215;4</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-center flex items-between justify-around">
                                                <p className=" flex-2 px-8 py-2.5 bg-blue-300 border-1 text-xs text-orange-300 rounded-2xl">Pending</p>
                                                <img className="w-1 cursor-pointer" src={menu} alt="menu" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=''>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full border border-gray-500" src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="40" height="40" alt="Alex Shatov" /></div>
                                                <div className="font-medium text-gray-800 flex flex-col justify-center">
                                                    <h2 className='text-xs'>Alex Shatov</h2>
                                                    <p className="text-xs text-orange-300">#112233</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left flex flex-col">
                                                <h2 className='text-xs'>Aftab Alam</h2>
                                                <p className="text-xs text-gray-500">XYZ room 2 Islamabad</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left text-sm flex flex-col gap-2">
                                                <p className="text-sm">$21</p>
                                                <p className="text-xs">&#215;4</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-center flex items-between justify-around">
                                                <p className=" flex-2 px-8 py-2.5 bg-blue-300 border-1 text-xs text-orange-300 rounded-2xl">Pending</p>
                                                <img className="w-1 cursor-pointer" src={menu} alt="menu" />
                                            </div>
                                        </td>
                                    </tr><tr className=''>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full border border-gray-500" src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="40" height="40" alt="Alex Shatov" /></div>
                                                <div className="font-medium text-gray-800 flex flex-col justify-center">
                                                    <h2 className='text-xs'>Alex Shatov</h2>
                                                    <p className="text-xs text-orange-300">#112233</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left flex flex-col">
                                                <h2 className='text-xs'>Aftab Alam</h2>
                                                <p className="text-xs text-gray-500">XYZ room 2 Islamabad</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left text-sm flex flex-col gap-2">
                                                <p className="text-sm">$21</p>
                                                <p className="text-xs">&#215;4</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-center flex items-between justify-around">
                                                <p className=" flex-2 px-8 py-2.5 bg-blue-300 border-1 text-xs text-orange-300 rounded-2xl">Pending</p>
                                                <img className="w-1 cursor-pointer" src={menu} alt="menu" />
                                            </div>
                                        </td>
                                    </tr><tr className=''>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full border border-gray-500" src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="40" height="40" alt="Alex Shatov" /></div>
                                                <div className="font-medium text-gray-800 flex flex-col justify-center">
                                                    <h2 className='text-xs'>Alex Shatov</h2>
                                                    <p className="text-xs text-orange-300">#112233</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left flex flex-col">
                                                <h2 className='text-xs'>Aftab Alam</h2>
                                                <p className="text-xs text-gray-500">XYZ room 2 Islamabad</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left text-sm flex flex-col gap-2">
                                                <p className="text-sm">$21</p>
                                                <p className="text-xs">&#215;4</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-center flex items-between justify-around">
                                                <p className=" flex-2 px-8 py-2.5 bg-blue-300 border-1 text-xs text-orange-300 rounded-2xl">Pending</p>
                                                <img className="w-1 cursor-pointer" src={menu} alt="menu" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className=''>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full border border-gray-500" src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="40" height="40" alt="Alex Shatov" /></div>
                                                <div className="font-medium text-gray-800 flex flex-col justify-center">
                                                    <h2 className='text-xs'>Alex Shatov</h2>
                                                    <p className="text-xs text-orange-300">#112233</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left flex flex-col">
                                                <h2 className='text-xs'>Aftab Alam</h2>
                                                <p className="text-xs text-gray-500">XYZ room 2 Islamabad</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-left text-sm flex flex-col gap-2">
                                                <p className="text-sm">$21</p>
                                                <p className="text-xs">&#215;4</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-center flex items-between justify-around">
                                                <p className=" flex-2 px-8 py-2.5 bg-blue-300 border-1 text-xs text-orange-300 rounded-2xl">Pending</p>
                                                <img className="w-1 cursor-pointer" src={menu} alt="menu" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}