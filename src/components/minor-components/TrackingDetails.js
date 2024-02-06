
export const TrakingDetails = () => {
    return (
        <div className="flex items-center w-full px-4">
            <div className="bg-white rounded-md w-full  mx-auto shadow-lg flex justify-between flex-col px-4 py-8 ">
                <div>
                    <div>
                        <h2 className="font-semibold text-gray-800 text-lg">Track Order</h2>
                        <p className="text-xs">Tracking Details</p>
                    </div>
                </div>
                <div className="flex items-center justify-around py-4 gap-8">

                    <div className="w-full">
                        <input className='py-2 px-2 mb-[5px] mt-0 text-[#E9C95D] placeholder-orange-300 outline-0 text-xs rounded hover:outline-0 focus:outline-none border border-orange-300 w-60' placeholder="#tracking id" type='text' name='tracking' />
                        <span className="bg-myBg pb-[10px] pt-[8px] px-4 mt-[5px] ml-[-3px] inline-block mb-[-5px] rounded text-sm cursor-pointer">
                            Track
                        </span>
                        <p className="text-xs mt-[-5px] text-[#E9C95D]">Your Order is preparing</p>
                    </div>



                    <div className="flex flex-col flex-2 items-start justify-center  ">
                        <div className="flex items-center justify-center ">
                            <div className="flex items-center justify-center  border-2 border-orange-300 h-8 w-8 rounded">
                                <p className=" text-xs text-[#E9C95D]">1</p>
                            </div>
                            <span className="border-b-2 border-orange-300 w-24"></span>
                            <div className="flex items-center justify-center  border-2 border-orange-300 h-8 w-8 rounded">
                                <p className=" text-xs text-[#E9C95D]">2</p>
                            </div>
                            <span className="border-b-2 border-orange-300 w-24"></span>
                            <div className="flex items-center justify-center  border-2 border-orange-300 h-8 w-8 rounded">
                                <p className=" text-xs text-[#E9C95D]">3</p>
                            </div>
                            <span className="border-b-2 border-orange-300 w-24"></span>
                            <div className="flex items-center justify-center  bg-gray-200  h-8 w-8 rounded">
                                <p className=" text-xs">4</p>
                            </div>
                            <span className="border-b-2 border-orange-300 w-24"></span>
                            <div className="flex items-center justify-center  bg-gray-200  h-8 w-8 rounded">
                                <p className=" text-xs">5</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="text-xs text-[#E9C95D]">
                                Ordered
                            </p>
                            <span className="w-20"></span>
                            <p className="text-xs text-[#E9C95D]">
                                Pending
                            </p>
                            <span className="w-20"></span>
                            <p className="text-xs text-[#E9C95D]">
                                Preparing
                            </p>
                            <span className="w-20"></span>
                            <p className="text-xs ">
                                Delivery
                            </p>
                            <span className="w-20"></span>
                            <p className="text-xs ">
                                Received
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}