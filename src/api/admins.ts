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
