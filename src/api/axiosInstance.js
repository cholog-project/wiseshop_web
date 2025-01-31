import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://wiseshop.kro.kr/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(error.response);
        return Promise.reject(error);
    }
);

export default axiosInstance;