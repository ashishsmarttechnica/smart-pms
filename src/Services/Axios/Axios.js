import axios from 'axios'

import { url } from '../../url'
export const axiosClient = axios.create({
  baseURL: `${url}/api/v1`
})
