import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.wiseshop.kro.kr/api/v1',
  // baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.response)
    return Promise.reject(error)
  },
)

export default axiosInstance
