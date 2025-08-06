import axios from "axios";

const agencyApi = axios.create({
    baseURL : 'http://localhost:8000/api/agency/',
    withCredentials : true,
})

agencyApi.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        await axios.post('http://localhost:8000/api/token/refresh-cookie/', {}, { withCredentials: true })

        // Retry the failed request
        return agencyApi(error.config)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default agencyApi