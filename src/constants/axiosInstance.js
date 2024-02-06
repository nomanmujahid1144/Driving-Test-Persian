//https://cannabis-server.herokuapp.com
import axios from 'axios'
export const axiosInstance = axios.create({
    baseURL: 'https://server.theorytestinpersian.co.uk',
    // baseURL: 'http://localhost:1212'
});
