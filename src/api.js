import axios from 'axios'

export const API_BASE_URL = 'http://localhost:3000/api/v1/users/'
export const API = axios.create({
    baseURL: API_BASE_URL,
})