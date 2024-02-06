import React, { useState, useEffect , useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLogo from "../../assets/logo.png";
import search from "../../assets/bx-search.svg";
import shoppingCart from "../../assets/shopping-cart.svg";
import notificationBell from "../../assets/bell-regular.svg";
import { IconBgRound } from "../minor-components/IconBgRound";
import { EarnDollars } from "../minor-components/EarnDollars";
import { Help } from "../minor-components/Help";
import { OrderHistory } from "../minor-components/OrderHistory";
import { Modal } from "../minor-components/Modal";
import { axiosInstance } from '../../constants/axiosInstance';
import { useAlert } from 'react-alert'

export const Navbar = () => {
  let nevigate = useNavigate();
  const alert = useAlert();
  const buttonRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    nevigate("/");
    alert.show("Logout Successfully")

  };

  const [showSidebar, setshowSidebar] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenHelp, setIsOpenHelp] = useState(false);
  const [isOpenOrderHistory, setIsOpenOrderHistory] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(0);
  const [notificationPopUp, setNotificationPopUp] = useState(false);
  const config = {
    headers: {
      "Authorization": localStorage.getItem('token')
    }
  }
  useEffect(() => {
    getBrands();
    getOrders();
    getCart();
  }, [cart])

  useEffect(() => {
    getAnnouncementList();
  }, []);

  
  const calculatePopupPosition = () => {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const offsetX = buttonRect.left;
    const offsetY = buttonRect.bottom;
    return `translate3d(${offsetX - 270}px, ${offsetY + 10}px, 0px)`;
  };

  const getBrands = async (e) => {
    try {
      axiosInstance.get('/api/v1/category/getcategories')
        .then((res) => {
          if (res.data.success) {
            setBrands(res.data.data)
          }
          else {
          }
        })
        .catch((error) => {
        })

    }
    catch (e) {
    }

  }

  const getOrders = async (e) => {
    try {

      let page = 1;
      let limit = 5;
      // if(req.query.page && req.query.limit){
      //     page = req.query.page;
      //     limit = req.query.limit;
      // }else{
      //   page = 1;
      //   limit = 4;
      // }

      axiosInstance.get('/api/v1/order/getallordersbyid', config, {
        params: { page, limit }
      })
        .then((res) => {
          if (res.data.success) {
            setOrders(res.data.data)
          }
          else {
          }
        })
        .catch((error) => {
        })

    }
    catch (e) {
    }

  }
  const getCart = async (e) => {
    try {
      axiosInstance.get('/api/v1/order/getcart', config)
        .then((res) => {
          if (res.data.success) {
            setCart(res.data.data.details.length)
          }
          else {
          }
        })
        .catch((error) => {
        })

    }
    catch (e) {
    }

  }

  const handleBrand = async (e) => {
    const brand = e.target.innerHTML.toLowerCase();
    try {
      nevigate(`/brand/${brand.toString()}`, { state: { brand: brand } });
      setshowSidebar(!showSidebar)
    }
    catch (e) {
    }
  }

  const getAnnouncementList = async () => {
    await axiosInstance.get('/api/v1/announcement/getannouncement')
      .then((res) => {
        let aboutUs = res.data.data;
        if (aboutUs.length !== 0) {
          setAnnouncement(aboutUs[0].announcement)
        }
      })
      .catch((err) => {

      })
  }


  const handleNotificaionPopUp = () => {
    setNotificationPopUp(!notificationPopUp)
  }

  const handleNavigate = () => {
    window.location.href = '/notifications'
    setNotificationPopUp(!notificationPopUp)
  }
  return (
    <>
      <div className="grid sticky top-0 z-30 bg-white lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-2  lg:px-16 md:px-12 xxs:px-7  items-center  pt-4">
        <div className="flex  items-center">
          <>
            {showSidebar ? (
              <button className="w12 flex items-center cursor-pointer" onClick={() => setshowSidebar(!showSidebar)} >
                <svg fill="black" viewBox="0 0 100 80" width="25" height="25">
                  <rect width="100" height="10"></rect>
                  <rect y="30" width="100" height="10"></rect>
                  <rect y="60" width="100" height="10"></rect>
                </svg>
              </button>
            ) : (
              <div className={`top-0 left-0 w-64 bg-white  z-[5]  text-white fixed h-full ${showSidebar ? "-translate-x-full" : "-translate-x-0"} ease-in-out duration-300`}>
                <div className="z-10 w-full">
                  <button className=" text-xl text-black fixed top-7 left-9 " onClick={() => setshowSidebar(!showSidebar)} >
                    X
                  </button>
                  <div className="fixed w-full  h-[70%] px-5 left-2 top-20 flex flex-col  justify-between  rounded bg-transparent">
                    <div className="">
                      {!localStorage.getItem("token") ? (
                        <>
                          <Link to="/sign-up">
                            <button className="w-full py-2 my-2 text-lg text-primaryText font-semibold bg-myBg rounded text-center">
                              Sign Up
                            </button>
                          </Link>
                          <Link to="/login">
                            <button className="text-lg py-2 my-2 w-full text-primaryText font-semibold bg-white border-2 rounded text-center">
                              Sign In
                            </button>
                          </Link>
                        </>
                      ) : (
                        <button onClick={handleLogout} className=" text-lg py-3 my-2 w-full text-primaryText font-semibold bg-white border-2 rounded text-center" >
                          Logout
                        </button>
                      )}
                      <div className="pt-2 pb-1 text-lg font-bold text-primaryText">
                        Shop
                      </div>
                      <div className="flex flex-wrap gap-1 overflow-y-auto max-h-40">
                        {brands.map((brnad) => (
                          <div onClick={handleBrand} className="my-1 flex flex-wrap cursor-pointer  text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4  font-medium rounded-full text-sm px-5 py-2.5 w-fit ">
                            {brnad.brand.charAt(0).toUpperCase() + brnad.brand.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <ul className="">
                      <li className="pt-1 pb-1 cursor-pointer text-md font-bold text-primaryText" onClick={() => { setIsOpenOrderHistory(true) }}>
                        Order History
                      </li>
                      <li className="pt-1 pb-1 cursor-pointer text-md font-bold text-primaryText">
                        <Link to="/about-us">About Us</Link>
                      </li>
                      <li className="pt-1 pb-1 cursor-pointer text-md font-bold text-primaryText">
                        <Link to="/delivery">Delivery</Link>
                      </li>
                      <li className="pt-1 pb-1 cursor-pointer text-md font-bold text-primaryText">
                        <Link to="/blog">Blogs</Link>
                      </li>
                      <li className="pt-1 pb-1 cursor-pointer text-md font-bold text-primaryText">
                        <Link to="/faq">FAQ's</Link>
                      </li>
                      <li className="pt-1 pb-1 cursor-pointer text-md font-bold text-primaryText">
                        <Link to="/accounts">Account</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="bottom-0 fixed w-full text-center">
                    <div className="flex justify-center">
                      <img alt="missing" className="w-[55px] rounded-lg " src={NavLogo}></img>
                    </div>
                    <div className="pt-2 pb-5 text-lg font-normal text-primaryText ">
                      CodeBreaker Technologies
                    </div>
                  </div>
                </div>
              </div>
            )}

          </>
          <Link to='/'>
            <img alt="missing" className="w-[50px] ml-3 rounded-lg" src={NavLogo} />
          </Link>
        </div>
        <div className="md:flex justify-center items-center md:visible hidden">
          <div className="mr-[-30px] z-50">
            <IconBgRound svg={search} bg="bg-myBg" width="12" imgWidth={4} />
          </div>
          <input
            className="h-10 pl-10 bg-blue-50 rounded-full w-60 text-xs outline-0  hover:outline-0 focus:outline-none  "
            type="text"
            name="search"
            placeholder="product search..."
          />
        </div>
        <div className="flex justify-around items-center gap-4 w-full">
          <div className="flex gap-3">
            <Link to="/checkout">
              <IconBgRound svg={shoppingCart} bg="bg-myBg" width="12" imgWidth={5} isCart={true} totalCartItems={cart} />
            </Link>
            <button ref={buttonRef} onClick={handleNotificaionPopUp} type="button" data-dropdown-toggle="notification-dropdown" className="p-2 w-12 relative text-gray-500 rounded-[50%] shadow-md flex justify-center items-center flex-shrink-0 bg-myBg">
              <span className="sr-only">View notifications</span>
              <img className={`w-5`} src={notificationBell} alt='bg-round' />
                {/* <div class="inline-flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white"></div> */}
            </button>
            <div className={`overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white rounded divide-y divide-gray-100 shadow-lg shadow-gray-300 ${notificationPopUp === true ? 'block' : 'hidden'}`}
              id="notification-dropdown"
              data-popper-placement="bottom"
              style={{
                position: "absolute",
                inset: "0px auto auto 0px",
                margin: 0,
                transform: notificationPopUp ? calculatePopupPosition() : "translate3d(0px, 0px, 0px)",
              }}
            >
              <div className="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50">
                Notifications
              </div>
              <div>

                {/* <a href="#" className="flex py-3 px-4 border-b hover:bg-gray-100">
                  <div className="flex-shrink-0">
                    <img
                      className="w-11 h-11 rounded-full"
                      src="https://demos.creative-tim.com/soft-ui-flowbite-pro/images/users/bonnie-green.png"
                      alt="Jese image"
                    />
                    <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-fuchsia-600 rounded-full border border-white">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                        <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="pl-3 w-full">
                    <div className="text-gray-500 font-normal text-sm mb-1.5">
                      New message from{" "}
                      <span className="font-semibold text-gray-900">Bonnie Green</span>:
                      "Hey, what's up? All set for the presentation?"
                    </div>
                    <div className="text-xs font-medium text-fuchsia-500">
                      a few moments ago
                    </div>
                  </div>
                </a> */}
                <p className="flex w-full py-3 px-28 border-b hover:bg-gray-100">No Notification yet</p>
              </div>
              <div onClick={handleNavigate} className="block py-2 text-base font-normal text-center text-gray-900 bg-gray-50 hover:bg-gray-100">
                <div className="inline-flex items-center ">
                  <svg
                    className="mr-2 w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View all
                </div>
              </div>
              
            </div>


          </div>
          <div className="lg:block hidden">
            {!localStorage.getItem("token") ? (
              <>
                <Link to="/sign-up">
                  <button className="w-24  py-3 mx-1 text-lg text-primaryText font-semibold bg-myBg rounded text-center">
                    Sign Up
                  </button>
                </Link>
                <Link to="/login">
                  <button className="text-lg w-24 py-3 mx-1 text-primaryText font-semibold bg-white border-2 rounded text-center">
                    Sign In
                  </button>
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-lg w-24 py-3 mx-1 text-secondaryText bg-myBg rounded text-center" >
                Logout
              </button>
            )}
          </div>
        </div>
        {announcement !== '' ?
          <div className="col-span-3 mt-4 bg-myBg justify-center flex overflow-x-hidden" style={{
            marginLeft: '-28px',
            marginRight: '-28px'
          }}>
            <marquee width="80%" direction="left">
              <span className="text-xl">{announcement}</span>
            </marquee>
          </div>
          : null}
      </div>
      <div>
        <Modal open={isOpenOrderHistory} onClose={() => setIsOpenOrderHistory(false)} >
          <OrderHistory modal={setIsOpenOrderHistory} isAdd={true} isOrders={orders} />
        </Modal>
        <Modal open={isOpen} onClose={() => setIsOpen(false)} >
          <EarnDollars modal={setIsOpen} isAdd={true} />
        </Modal>
        <Modal open={isOpenHelp} onClose={() => setIsOpenHelp(false)} >
          <Help modal={setIsOpenHelp} isAdd={true} />
        </Modal>
      </div>
    </>
  );
};
