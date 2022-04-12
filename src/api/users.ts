import request from '@/utils/request'
import { IUserCreate } from './types'
import { ICreateUserResponse } from './types/response'

export const createUser = (data: IUserCreate) => {
  return request.post<ICreateUserResponse>('/user/', data)
}
