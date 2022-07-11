// 专门用于那些别的域名的情况，比较杂的域名接口

import axios from 'axios'
import store from '@/store'
import qs from 'qs'
import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth'

axios.defaults.timeout = 1000 *30

const requestCus = (pms) => {
    const service = axios.create({
        baseURL: pms,
      })
      
      // json转FormData
      const jsonToFormData = (jsonData) => {
        const formData = new FormData()
        for (const key in jsonData) {
          formData.append(key, jsonData[key])
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
      
      service.interceptors.response.use(
        response => {
          const res = response.data
          if (+res.code !== 0) {
            Message({
              message: res.msg || 'status 错误',
              type: 'error',
              duration: 3 * 1000
            })
            return Promise.reject(res.msg || 'Error')
          } else {
            return res.data
          }
        },
        error => {
          Message({
            message: error && error.msg || '服务器报错',
            type: 'error',
            duration: 5 * 1000
          })
          return Promise.reject(error)
        }
      )
      return service
}

export default requestCus
