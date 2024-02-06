import verticleStepperIcon from '../../assets/verticle-stepper-icon.svg'
export const TimeLine = () => {
    return (
        <div className='bg-white shadow-lg rounded-md flex flex-col w-[30%] items-cente'>
            <header className=" py-6 px-4 border-b border-gray-100 flex items-center justify-between">
                <div className='flex '>
                    <h2 className="font-semibold text-gray-800 text-lg">TimeLine</h2>

                </div>

            </header>
            <div className='px-8 '>
                <div className='flex items-center justify-start flex-nowrap gap-4 pt-6 '>
                    <div className='flex flex-col h-96'>
                        <img className='w-4' alt="verticle" src={verticleStepperIcon} />
                        <p className='h-12 border-l-2 ml-[6.5px]'></p>
                        <img className='w-4' alt='verticle' src={verticleStepperIcon} />
                        <p className='h-12 border-l-2 ml-[6.5px]'></p>
                        <img className='w-4' alt='verticle' src={verticleStepperIcon} />
                        <p className='h-12 border-l-2 ml-[6.5px]'></p>
                        <img className='w-4' alt='verticle' src={verticleStepperIcon} />
                        <p className='h-12 border-l-2 ml-[6.5px]'></p>
                        <img className='w-4' alt='verticle' src={verticleStepperIcon} />
                        <p className='h-12 border-l-2 ml-[6.5px]'></p>
                        <img className='w-4' alt='verticle' src={verticleStepperIcon} />
                    </div>
                    <div className='flex flex-col items-start h-96 gap-2'>
                        <div className='flex flex-col h-[53px]'>
                            <p className='text-xs text-gray-300'>10 minutes ago</p>
                            <h2 className='text-xs'> New order received</h2>
                        </div>
                        <div className='flex flex-col h-[53px]'>
                            <p className='text-xs text-gray-300'>10 minutes ago</p>
                            <h2 className='text-xs'> New order received</h2>
                        </div>
                        <div className='flex flex-col h-[53px]'>
                            <p className='text-xs text-gray-300'>10 minutes ago</p>
                            <h2 className='text-xs'> New order received</h2>
                        </div>
                        <div className='flex flex-col h-[53px]'>
                            <p className='text-xs text-gray-300'>10 minutes ago</p>
                            <h2 className='text-xs'> New order received</h2>
                        </div>
                        <div className='flex flex-col h-[53px]'>
                            <p className='text-xs text-gray-300'>10 minutes ago</p>
                            <h2 className='text-xs'> New order received</h2>
                        </div>
                        <div className='flex flex-col h-[53px]'>
                            <p className='text-xs text-gray-300'>10 minutes ago</p>
                            <h2 className='text-xs'> New order received</h2>
                        </div>

                    </div>

                </div>
            </div>
        </div>



    )
}