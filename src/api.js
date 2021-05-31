import axios from 'axios'

export const API_BASE_URL = 'http://192.168.50.162:3000/api/v1/users/'
export const API = axios.create({
    baseURL: API_BASE_URL,
})