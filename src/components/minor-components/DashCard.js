import CountUp from 'react-countup'
export const DashCard = ({ bg, header, footer,icon, data }) => {
    return (
        <div className={`${bg} flex flex-col my-2 justify-between rounded-lg py-2 px-4 h-36 w-64 shadow-xl border w-xl`}>
            <p>
                {header}
            </p>
            <div className="flex justify-between">
                <div className="font-medium text-3xl">
                    <CountUp start={data-50 > 0  ? data-50 : 0  ?? 0} end={data ?? 0} delay={0} duration={0.75}>
                        {({ countUpRef }) => (
                            <div>
                                <span ref={countUpRef} />
                            </div>
                        )}
                    </CountUp>

                </div>
                <img className="w-12" src={icon} alt="dash-icon" />
            </div>


            <p>
                {footer ?? 0} from last 24 hours
            </p>

        </div>

    )
}