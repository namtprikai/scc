import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { AdminModule } from '@/store/modules/admin'
import { getRfToken } from '@/utils/cookies'
/* eslint-disable */
import jwt_decode from 'jwt-decode'
/* eslint-enable */

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    if (AdminModule.acToken) {
      const decodeToken: any = jwt_decode(AdminModule.acToken)
      if (decodeToken.exp >= Date.now) {
        const token: any = getRfToken()
        AdminModule.CheckToken(token)
      }
      config.headers.Authorization = `Bearer ${AdminModule.acToken}`
      config.headers['Content-type'] = 'application/json'
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.is_error) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (response.status === 401) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          AdminModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
