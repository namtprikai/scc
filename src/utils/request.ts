import axios, { AxiosError, AxiosResponse } from 'axios'
import { Message, MessageBox } from 'element-ui'
import { AdminModule } from '@/store/modules/admin'
import { getRfToken, removeAcToken, removeRfToken } from '@/utils/cookies'
import i18n from '@/lang'
import { camelCase } from 'lodash'
import router from '@/router'
/* eslint-disable */
import jwt_decode from 'jwt-decode'
/* eslint-enable */

export enum APIErrorCode {
  Redirect = 'redirect',
  Unauthorized = 'unauthorized_error',
  Forbidden = 'forbidden_error',
  NotFound = 'not_found_error',
  Validation = 'validation_error',
  Locked = 'locked_error',
  InternalServerError = 'internal_server_error',
}

export enum ValidationType {
  Empty = 'empty',
  Min = 'min',
  Max = 'max',
  MinLength = 'minLength',
  MaxLength = 'maxLength',
  Pattern = 'pattern',
  Exists = 'exists',
  Role = 'role',
  Mismatch = 'mismatch',
  Limit = 'limit',
  Unique = 'unique',
  Lock = 'lock',
  Hierarchy = 'hierarchy',
}

export interface IValidationData {
  value: string
  type: ValidationType[]
}

export class APIError<T = any> extends Error {
  constructor(
    public status: number,
    public errorCode: APIErrorCode,
    public data?: T,
    message?: string
  ) {
    super(message)
  }
}

export class ValidationError extends APIError<IValidationData[]> {
  constructor(data: IValidationData[], message?: string) {
    super(422, APIErrorCode.Validation, data, message)
  }
}

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
      if (decodeToken.exp <= Date.now) {
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
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError) => {
    if (!error?.response) {
      Message({
        message: i18n.tc('message.serverConnectError'),
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(i18n.tc('message.serverConnectError')))
    }

    const {
      status,
      data: { message, data }
    } = error.response

    // Redirection exception
    if (
      status === 301 &&
      data?.errors &&
      data?.errors[0]?.code === APIErrorCode.Redirect
    ) {
      // If is logged in, redirect to the home page
      router.push('/')

      return Promise.reject(
        new APIError(status, APIErrorCode.Redirect, data?.errors, message)
      )
    }

    if (status === 401) {
      if (error.response.config.url !== '/admin/login/') {
        removeAcToken()
        removeRfToken()
        router.push('/login')
      }

      return Promise.reject(
        new APIError(status, APIErrorCode.Unauthorized, data?.errors, message)
      )
    }

    // Validation exception
    if (status === 422) {
      const validationData = data?.errors?.map(
        ({ value, type }: { value: string, type: string[] }) =>
          ({ value, type } as IValidationData)
      )
      return Promise.reject(new ValidationError(validationData, message))
    }

    // Locked exception
    if (status === 423) {
      MessageBox.alert(i18n.tc('message.lockedError'), {
        confirmButtonText: i18n.tc('text.ok'),
        type: 'error'
      })

      return Promise.reject(
        new APIError(status, APIErrorCode.Locked, data?.errors, message)
      )
    }

    // Forbidden, Not Found, Internal Server Error
    if ([403, 404, 500].includes(status)) {
      const errorCode = data?.errors && data?.errors[0]?.code
      if (errorCode && Object.values(APIErrorCode).includes(errorCode)) {
        Message({
          message: i18n.tc(`message.${camelCase(errorCode)}`),
          type: 'error',
          duration: 5 * 1000
        })

        return Promise.reject(
          new APIError(status, <APIErrorCode>errorCode, data.errors, message)
        )
      }
      return Promise.reject(new Error(error.message))
    }
  }
)

export default service
