import { Link } from "react-router-dom"
import React , {useState} from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../constants/axiosInstance";
import logo from '../assets/logo.png'


export const Signup = () => {

    const [credentials, setcredentials] = useState({
        name : "",
        email: "",
        password: ""
      });
      let navigate = useNavigate();
      // let alert = useAlert();
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const { name ,email, password  } = credentials;
        const res = await axiosInstance.post('/api/v1/admin/signup', {name ,email, password })
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          navigate("/");
          alert.show('Logged in successfully')
        }else{
          // alert.show('Invalid')
        }
      };
    
      const onChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value });
      };

    return (
        <div className="bg-grey-lighter min-h-screen flex flex-col">
            <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div className="bg-white px-6 py-8 rounded shadow-lg text-black w-full">
                    <img className='rounded-lg  w-20 mx-auto' src={logo} alt="logo" />
                    <h1 className="mb-8 text-md my-4 text-center text-2xl">SIGN UP</h1>
                    <form onSubmit={handleSubmit}>
                    <h2 className="text-sm my-2.5">User Name</h2>
                    <input
                        type="text"
                        className="block border border-grey-light w-full p-2 rounded mb-4"
                        name="name"
                        value={credentials.name}
                        onChange={onChange}
                        placeholder="Full Name" />

                    <h2 className="text-sm my-2.5">Email</h2>
                    <input
                        type="text"
                        className="block border border-grey-light w-full p-2 rounded mb-4"
                        name="email"
                        value={credentials.email}
                        onChange={onChange}
                        placeholder="Email" />
                    <h2 className="text-sm my-2.5">Password</h2>
                    <input
                        type="password"
                        className="block border border-grey-light w-full p-2 rounded mb-4"
                        name="password"
                        value={credentials.password}
                        onChange={onChange}
                        placeholder="Password" />


                    <button
                        type="submit"
                        className="w-full text-center py-2 rounded bg-[#E9C95D] hover:bg-green-dark focus:outline-none my-1"
                    >Sign Up</button>

                    <div className="text-left text-sm text-grey-dark mt-4 my-4">
                        Already have an account? <span className="text-blue-600"><Link to='/login'>Sign In</Link></span>
                    </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}