import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

export default AxiosInstance;
