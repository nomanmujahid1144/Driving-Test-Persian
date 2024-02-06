
export const IconBg = ({ svg, ...rest }) => {
    return (
        <div className="h-8 w-8 overflow-hidden rounded-[5px] top-0 right-0 bg-white shadow-md flex justify-center items-center flex-shrink-0">
            <img className={`${rest.open ? 'bg-[#E9C95D]' : ''} w-4`} src={svg} alt="icon-bg" />
        </div>
    )
}