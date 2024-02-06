import { baseURL } from "../../constants/baseURL";
import { Link } from "react-router-dom";


export const TestQuestionWebsitePagesCardComponent = (props) => {

    return (
        <>
            <div className="text-center pb-12 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <Link to={`/test-questions/${props.id}/english`}>
                    <img className="rounded-t-lg w-full  h-44" src={baseURL + props.iconName} /> 
                </Link>
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white" >{props.componentName}</h5>
            </div>
        </>
    )
}