import request from '@/utils/request'

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
