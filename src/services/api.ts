import axios from 'axios'

export const base_url = process.env.REACT_APP_BASE_URL

const axiosInstance = axios.create({ baseURL: `${base_url}/extensao` });

export default axiosInstance;