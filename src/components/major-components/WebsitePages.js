import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Loader } from "../minor-components/Loader";
import { WebsitePagesCardComponent } from "../minor-components/WebsitePagesCardComponent";
import { getCategories } from "../../redux/Actions/CategoryActions";

export const WebsitePages = () => {

    const dispatch = useDispatch();
    const { categories } = useSelector(
        (state) => state.categoryReducer
    );

    const loading = useSelector(
        (state) => state.ProgressBarReducer
    );

    useEffect(() => {
        dispatch(getCategories());
    }, []);


    return (

        <div className=" z-0">
            {!loading ? (
                <div className="mt-24  ml-[20%]  w-[78%]">
                    <div className=' bg-white rounded-lg  shadow-lg my-5'>
                        <div className='px-5 pt-4 mb-11 flex justify-between '>
                            <h2 className='font-semibold text-gray-800 text-lg'>All Categories</h2>
                        </div>
                        <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-3 gap-3 p-3">
                            {categories.map((comp, index) => (
                                <WebsitePagesCardComponent componentName={comp?.categoryTitle} iconName={comp?.categoryImage} id={comp?._id} />
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    )
}