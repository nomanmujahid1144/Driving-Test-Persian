import cannabisForm from '../../assets/cannabis-form.jpg'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Slider } from 'rsuite';
import ImageHolder from '../../assets/upload.svg'
import 'rsuite/dist/rsuite.min.css';
import { useEffect,useRef,  useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert'
import { baseURL } from '../../constants/baseURL';
import {  getLatLng } from 'use-places-autocomplete';
import { addTeacher, updateTeacher } from '../../redux/Actions/TeacherActions';


const apiKey = 'AIzaSyC7bLhDH_v6YSanp-5f41zwMgoio0eO-6Y';
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';
const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';
let lats, lngs;
let formatted_address;

function loadAsyncScript(src) {
  return new Promise(resolve => {
    const script = document.createElement("script");
    Object.assign(script, {
      type: "text/javascript",
      async: true,
      src
    })
    script.addEventListener("load", () => resolve(script));
    document.head.appendChild(script);
  })
}

const extractAddress = (place) => {

  // const results = await getGeocode({ place });

  if (typeof (place.geometry.location.lat) && typeof (place.geometry.location.lng) != 'function') {
    lats = place.geometry.location.lat;
    lngs = place.geometry.location.lng;
  } else {
    const { lat, lng } = getLatLng(place);
    lats = lat;
    lngs = lng;
  }

  formatted_address = place.formatted_address;

  const address = {
    sublocal2: "",
    sublocal: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    plain() {
      const sublocal2 = this.sublocal2 ? this.sublocal2 + ", " : "";
      const sublocal = this.sublocal ? this.sublocal + ", " : "";
      const city = this.city ? this.city + ", " : "";
      const zip = this.zip ? this.zip + ", " : "";
      const state = this.state ? this.state + ", " : "";
      return sublocal2 + sublocal + city + zip + state + this.country;
    }
  }

  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach(component => {
    const types = component.types;
    const value = component.long_name;

    if (types.includes("sublocality_level_2")) {
      address.sublocal2 = value;
    }
    if (types.includes("sublocality_level_1")) {
      address.sublocal = value;
    }
    if (types.includes("locality")) {
      address.city = value;
    }

    if (types.includes("administrative_area_level_2")) {
      address.state = value;
    }

    if (types.includes("postal_code")) {
      address.zip = value;
    }

    if (types.includes("country")) {
      address.country = value;
    }

  });

  return address;
}


const SignupSchema = Yup.object().shape({
    institutePhoto: Yup.string().required('Image is required'),
    instituteName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    teacherName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    phoneno: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    address: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!'),
});

export const AddTeacherForm = (props) => {
    const status = !props.isAdd ? props.isAdd : true
    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [filePreview, setFilePreview] = useState(null)
    const [editItem, setEditItem] = useState([])
    const [imgCheck, setImgCheck] = useState(false)

    const { teachers } = useSelector(
        (state) => state.teacherReducer
    );
    const token = useSelector(
        (state) => state.ProfileReducer
    );
    useEffect(() => {
        if (!status) {
            setEditItem(teachers.filter(
                (teacher) => teacher._id === global.editId
            ))
        }
    }, [])




    const searchInput = useRef(null);
    const [address, setAddress] = useState({});

    // init gmap script
    const initMapScript = () => {
        // if script already loaded
        if (window.google) {
        return Promise.resolve();
        }
        const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
        return loadAsyncScript(src);
    }

    // do something on address change
    const onChangeAddress = async (autocomplete) => {
        const place = autocomplete.getPlace();
        setAddress(extractAddress(place));
    }

    // init autocomplete
    const initAutocomplete = () => {
        if (!searchInput.current) return;
        const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current);
        autocomplete.setFields(["address_component", "formatted_address", "geometry"]);
        autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete));

    }
    
    // load map script after mounted
    useEffect(() => {
        initMapScript().then(() => initAutocomplete())
    }, []);


    return (
        <>
            <div className='w-full h-[85vh]'>
                <div style={{ scrollbarWidth: 'thin' }} className="container h-full mx-auto overflow-y-scroll">
                    <div className="flex justify-center">
                        <div className="w-full flex ">
                            <div
                                className="w-2/3 h-auto  lg:block lg:w-5/12 bg-cover md:hidden "
                                style={{
                                    backgroundImage: `linear-gradient( to right, rgba(0,0,0,0.2) ,rgba(0, 0, 0, 0.2)) ,url(${cannabisForm})`, backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >

                            </div>

                            <div className="w-full xl:w-[65%] md:w-full bg-white rounded-lg ">
                                <h3 className="pt-4 text-2xl text-center mt-8 font-bold">{!status ? 'Teacher Details' : "Add Teacher"}</h3>
                                <Formik
                                    enableReinitialize
                                    initialValues={
                                        {
                                            institutePhoto: editItem.length !== 0 ? `${editItem[0].institutePhoto}` : '',
                                            instituteName: editItem.length !== 0 ? `${editItem[0].instituteName}` : '',
                                            teacherName: editItem.length !== 0 ? `${editItem[0].teacherName}` : '',
                                            phoneno: editItem.length !== 0 ? `${editItem[0].phoneno}` : '',
                                            email: editItem.length !== 0 ? `${editItem[0].email}` : '',
                                            address: editItem.length !== 0 ? `${editItem[0].address}` : '',
                                        }
                                    }
                                    validationSchema={SignupSchema}
                                    onSubmit={async (values) => {
                                        let obj = {
                                            geometry: {type: 'Point' ,coordinates: [lats, lngs] },
                                            address: formatted_address,
                                        }
                                        values.address = obj.address;
                                        values.geometry = obj.geometry;
                                        var formData = new FormData();
                                        if (!status) {
                                            if (imgCheck) {
                                                let image = values.institutePhoto
                                                formData.append('institutePhoto', image)
                                                dispatch(updateTeacher(values, formData, navigate, alert, props.modal))
                                            }
                                            else {

                                                dispatch(updateTeacher(values, formData, navigate, alert, props.modal))
                                            }
                                        }
                                        else {
                                            let image = values.institutePhoto
                                            formData.append('institutePhoto', image)
                                            dispatch(addTeacher(values, formData, navigate, alert, props.modal))
                                        }
                                    }}
                                >
                                    {({ isSubmitting, values, setFieldValue, handleChange }) => (
                                        <Form className="px-8 pt-6 pb-8 mb-4  bg-white rounded">
                                            <div className="flex mx-auto justify-center">
                                                <div className=" md:mr-2 md:mb-0 md:w-full justify-center mx-auto">
                                                    <label htmlFor="upload" className='w-[120px] h-[120px] block rounded-[50%] cursor-pointer mx-auto mb-2'>
                                                        <img className='w-[125px] h-[125px] block rounded-[50%] cursor-pointer mb-2 ' src={!status && editItem.length !== 0 && !imgCheck ? baseURL + editItem[0].institutePhoto : !values.institutePhoto ? ImageHolder : filePreview} alt='img' />
                                                        <input className='hidden' id="upload" name="image" type="file" accept="image/*" onChange={(event) => {
                                                            setFieldValue("institutePhoto", event.currentTarget.files[0]);
                                                            setFilePreview(URL.createObjectURL(event.target.files[0]))
                                                            setImgCheck(true)
                                                        }} />
                                                    </label>
                                                    <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2 text-center " name='institutePhoto'>
                                                        Institute Image
                                                    </label>
                                                    <ErrorMessage className='text-red-600 text-xs text-center' name="institutePhoto" component="div" />
                                                </div>
                                            </div>
                                            <div className='flex justify-around '>

                                                <div className='flex flex-col'>
                                                    <div className='flex flex-col justify-around  my-3'>

                                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="name">
                                                                    Institute Name
                                                                </label>
                                                                <Field className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="instituteName" />
                                                                <ErrorMessage className='text-red-600 text-xs' name="instituteName" component="div" />

                                                            </div>
                                                        </div>
                                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="name">
                                                                    Teacher Name
                                                                </label>
                                                                <Field className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="teacherName" />
                                                                <ErrorMessage className='text-red-600 text-xs' name="teacherName" component="div" />
                                                            </div>
                                                        </div>
                                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="name">
                                                                    Phone Number
                                                                </label>
                                                                <Field className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="phoneno" />
                                                                <ErrorMessage className='text-red-600 text-xs' name="phoneno" component="div" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <div className='flex flex-col justify-around my-3'>
                                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="name">
                                                                    Email
                                                                </label>
                                                                <Field className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="email" />
                                                                <ErrorMessage className='text-red-600 text-xs' name="email" component="div" />
                                                            </div>
                                                        </div>
                                                        <div className=" md:flex md:justify-between w-60 xl:w-44 lg:w-36 md:w-full md:mb-0">
                                                            <div className=" md:mr-2 md:mb-0 md:w-full">
                                                                <label className="block mb-2 text-sm font-bold text-gray-700 md:mt-2" htmlFor="name">
                                                                    Address
                                                                </label>
                                                                <input ref={searchInput} defaultValue={editItem[0]?.address} className='w-full px-3 py-2  text-xs leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' type="text" name="address" />
                                                                {/* <ErrorMessage className='text-red-600 text-xs' name="address" component="div" /> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="mb-6 flex items-center justify-center gap-2 sm:flex-col text-center">
                                                <button
                                                    className="w-36 px-4 py-2 font-semibold text-gray-600 bg-[#E9C95D] rounded hover:bg-[#E9D95D] focus:outline-none focus:shadow-outline"
                                                    type="submit" disabled={isSubmitting}
                                                >
                                                    {!status ? 'Update' : 'Submit'}
                                                </button>
                                                <button className={`w-36 px-4 py-2 font-semibold text-gray-600 bg-[#E9C95D] rounded hover:bg-[#E9D95D] focus:outline-none focus:shadow-outline ${!status ? 'hidden' : ''}`} type="reset">Reset</button>
                                            </div>


                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}