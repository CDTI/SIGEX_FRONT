import axios from 'axios'

export const base_url = process.env.REACT_APP_BASE_URL

const api = axios.create({
    baseURL: base_url?.concat('extensao/')
})

export default api