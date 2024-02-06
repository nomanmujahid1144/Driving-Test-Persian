import Loading from '../../assets/loading.gif'
export const Loader = () => {
    return (
        <div className='bg-loaderBg/60 flex items-center justify-center h-screen w-screen absolute top-0 right-0 left-0 bottom-0 z-40'>
             <img className='mx-auto w-72 z-50' src={Loading} alt="Loading..."/>
        </div>
    )
} 