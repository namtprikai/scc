import request from '@/utils/request'
import { IUserCreate } from './types'
import { ICreateUserResponse } from './types/response'

export const createUser = (data: IUserCreate) => {
  return request.post<ICreateUserResponse>('/user/', data)
}
export const getListUser = () => {
  return request.get('/user/')
}

export const detailUser = (id: number) =>
  request({
    url: `/user/${id}/`,
    method: 'get'
  })

export const updateUser = (id: number, data: IUserCreate) =>
  request({
    url: `/user/${id}/`,
    method: 'patch',
    data
  })

export const getUserConditions = (id: number) =>
  request({
    url: `/user/${id}/condition/`,
    method: 'get'
  })

export const updateUserConditions = (id: number, data: any) =>
  request({
    url: `/user/${id}/condition/`,
    method: 'post',
    data
  })

export const getUserProducts = (id: number) =>
  request({
    url: `/user/${id}/product/`,
    method: 'get'
  })

export const updateUserProducts = (id: number, data: any) =>
  request({
    url: `/user/${id}/product/`,
    method: 'post',
    data
  })

export const getUserRoles = (id: number) =>
  request({
    url: `/user/${id}/role/`,
    method: 'get'
  })

export const updateUserRoles = (id: number, data: any) =>
  request({
    url: `/user/${id}/role/`,
    method: 'post',
    data
  })

export const unlockUser = (id: number) => {
  return request.post('/user/unlock/', { user_id: id })
}

export const enabledUser = (id: number) => {
  return request.post('/user/enabled/', { user_id: id })
}

export const disabledUser = (id: number) => {
  return request.post('/user/disabled/', { user_id: id })
}
