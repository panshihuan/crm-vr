import axios from 'axios'
import store from '@/store'
import qs from 'qs'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000*30
})

// service.defaults.timeout = 1000*30

// json转FormData
const jsonToFormData = (jsonData) => {
  const formData = new FormData()
  for (const key in jsonData) {
    if (key == 'file') {
      formData.append(key, jsonData[key])
    } else {
      formData.append(key, jsonData[key])
    }
  }
  return formData
}

// request interceptor
service.interceptors.request.use(
  config => {
    config.data = config.data ? { tmpUserid: store.state.user.userId, ...config.data } : { tmpUserid: store.state.user.userId }
    if (config.data) {
      if (config.method === 'post' && !config.data.isNotFormData) {
        config.data = jsonToFormData(config.data)
      }
      if (config.method === 'get') {
        config.paramsSerializer = function(params) {
          
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      }
      return config
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)


// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status != 1) {
      Message({
          message: res?.msg || 'status 错误',
          type: 'error',
          duration: 3 * 1000
      })
      return Promise.reject(res)
    } else {
      return res.data
    }
  },
  error => {
    Message({
      message: error?.msg || '服务器报错',
      type: 'error',
      duration: 3 * 1000
  })
    return Promise.reject(error)
  }
)

export default service
