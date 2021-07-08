import axios from 'axios'

export const API_BASE_URL = 'http://192.168.50.162:3000/api/v1/'
export const API = axios.create({
    baseURL: '',
})

