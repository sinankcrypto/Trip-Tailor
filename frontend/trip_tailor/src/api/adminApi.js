import axios from 'axios'

const  adminApi = axios.create({
    baseURL: 'http://localhost:8000/api/admin-panel/',
    withCredentials: true,
})

export default adminApi
