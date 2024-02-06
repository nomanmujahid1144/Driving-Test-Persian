import { GoogleMap, Marker } from "@react-google-maps/api";
import cannabisForm from "../../assets/cannabis-form.jpg";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../../constants/axiosInstance";
import { baseURL } from "../../constants/baseURL";

const containerStyle = {
  width: "60vw",
  height: "70vh",
  marginTop: "40px",
  marginBottom: "40px",
  marginRight: "auto",
  marginLeft: "auto",
};

export const ViewUserDetails = ({ showDetails }) => {
  const [user, setSingleUser] = useState(showDetails);

  return (
    <>
      {showDetails ? (
        <>
          <div class="w-full h-[85vh] p-7">
            <div
              style={{ scrollbarWidth: "thin" }}
              className="container h-full mx-auto overflow-y-scroll"
            >
              <div className="flex justify-center">
                <div className="w-full flex flex-col">
                  <div className="w-full xl:w-[100%] md:w-full bg-white rounded-lg ">
                    <h3 className="pt-4 text-2xl mt-8 font-bold">
                      User Detail
                    </h3>
                    <div className="bg-gray-100">
                      <div className=" mx-auto my-5 p-5">
                        <div className="md:flex no-wrap md:-mx-2 ">
                          <div className="w-full md:w-9/12 mx-2 h-auto">
                            <div className="bg-white p-3 shadow-sm rounded-sm">
                              <div className="text-gray-700">
                                <div className="grid md:grid-cols-2 text-sm">
                                  <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">
                                      Name
                                    </div>
                                    <div className="px-4 py-2">
                                      {user.fullName}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">
                                      Phone Number
                                    </div>
                                    <div className="px-4 py-2">
                                      {user.phoneNumber}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">
                                      Email
                                    </div>
                                    <div className="px-4 py-2">
                                      {user.email}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <div className="px-4 py-2 font-semibold">
                                      Govt Id Card
                                    </div>
                                    <div className="px-4 py-2">
                                        <img className="border-2 border-black rounded-lg" src={baseURL  + user.govtIdImage} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="w-full xl:w-[100%] bg-white rounded-lg ">
                                <h3 className="pt-4 text-2xl  mt-8 font-bold">Order Detail</h3>
                                 <div className=" ">
                                    <div className="border border-1 border-gray-400  bg-white rounded mt-4 p-4  justify-between leading-normal">
                                    <div className="overflow-x-auto relative">
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-myBg dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                            <th scope="col" className="py-3 px-6">
                                                ID
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Product name
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Product Price
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Quantity
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Total Price
                                            </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {driverArr.map((item , index) => {console.log(item.totalPrice)})}
                                            {driverArr.map((items , index) => {
                                                // {console.log(items.details[index])}
                                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                            <td className="py-4 px-6">
                                                                {index + 1}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {items.productName}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {items.productQuantity}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {items.productPrice}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {items.productPrice * items.productQuantity}
                                                            </td>
                                                    </tr>
                                            })}
                                        </tbody>
                                    </table>
                                        
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-right p-7">
                                <h2>Grand Total :R {placesArr.totalPrice}</h2>
                            </div> */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
