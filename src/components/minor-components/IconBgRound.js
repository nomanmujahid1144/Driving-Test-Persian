export const IconBgRound = ({ svg, ...rest }) => {
    return (
        <div className={`h-12 w-12 overflow-hidden rounded-[50%] ${rest.bg} top-0 right-0 shadow-md flex justify-center items-center flex-shrink-0`}>
            <img className="w-4" src={svg} alt='bg-round' />
        </div>
    )
}