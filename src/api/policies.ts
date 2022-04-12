import request from '@/utils/request'

export const getPolicies = () =>
  request({
    url: '/policy/',
    method: 'get'
  })

export const detailPolicy = (id: number) =>
  request({
    url: `/policy/${id}/`,
    method: 'get'
  })

export const updatePolicy = (id: number, data: any) =>
  request({
    url: `/policy/${id}/`,
    method: 'patch',
    data
  })
