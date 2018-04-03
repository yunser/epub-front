import axios from 'axios'
import {apiDomain} from '@/config'

// axios.defaults.withCredentials = true

const instance = axios.create({
    baseURL: apiDomain
})

export default instance
