import request from '@/utils/request'
import { ICreateAdminRequest } from './types/request'
import { ICreateAdminResponse } from './types/response'

export const getAdminInfo = (data: any) =>
  request({
    url: '/admin/login/',
    method: 'post',
    data
  })

export const login = (data: any) =>
  request({
    url: '/admin/login/',
    method: 'post',
    data
  })

export const resetPassword = (data: any) =>
  request({
    url: '/admin/reset-password/',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/admin/logout/',
    method: 'post'
  })

export const checkToken = (data: any) =>
  request({
    url: '/admin/check/',
    method: 'post',
    data
  })

export const getDetailAdmin = (id: number) =>
  request({
    url: `/admin/${id}/`,
    method: 'get'
  })

export const getPoliciesAdmin = (id: number) =>
  request({
    url: `/policy_group/${id}/policy/`,
    method: 'get'
  })

export const enabledVerifyEmail = (params: string) =>
  request({
    url: `/admin/enabled/${params}/`,
    method: 'get'
  })

export const createAdmin = (data: ICreateAdminRequest) => {
  return request.post<ICreateAdminResponse>('/admin/', data)
}

export const changePassword = (data: any) => {
  const { password, hash } = data
  return request({
    url: `/admin/reset-password/${hash}/`,
    method: 'post',
    data: { password: password }
  })
}

export const getListAdmin = () => {
  return request.get('/admin/')
}

export const unlockAdmin = (id: number) => {
  return request.post('/admin/unlock/', { admin_id: id })
}

export const enabledAdmin = (id: number) => {
  return request.post('/admin/enabled/', { admin_id: id })
}

export const disabledAdmin = (id: number) => {
  return request.post('/admin/disabled/', { admin_id: id })
}
