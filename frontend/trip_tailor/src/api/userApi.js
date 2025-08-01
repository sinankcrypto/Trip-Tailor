import axios from "axios";

const userApi = axios.create({
    baseURL: 'http://localhost:8000/api/user/',
    withCredentials: true,
})

export default userApi