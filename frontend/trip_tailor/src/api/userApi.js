import axios from "axios";

const userApi = axios.create({
    baseURL: 'http://localhost:8000/api/user/',
    withCredentials: true,
})

userApi.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        await axios.post('http://localhost:8000/api/token/refresh-cookie/', {}, { withCredentials: true })

        // Retry the original request
        return userApi(error.config)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default userApi