import request from '@/utils/request'
import { IUserCreate } from './types'
import { ICreateUserResponse } from './types/response'

export const createUser = (data: IUserCreate) => {
  return request.post<ICreateUserResponse>('/user/', data)
}
export const getListUser = () => {
  return request.get('/user/')
}

export const unlockUser = (id: number) => {
  return request.post('/user/unlock/', { user_id: id })
}

export const enabledUser = (id: number) => {
  return request.post('/user/enabled/', { user_id: id })
}

export const disabledUser = (id: number) => {
  return request.post('/user/disabled/', { user_id: id })
}
