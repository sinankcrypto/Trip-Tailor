import axios from 'axios'

const  adminApi = axios.create({
    baseURL: 'http://localhost:8000/api/admin-panel/',
    withCredentials: true,
})

adminApi.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        await axios.post('http://localhost:8000/api/token/refresh-cookie/', {}, { withCredentials: true })

        // Retry the original request
        return adminApi(error.config)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default adminApi
