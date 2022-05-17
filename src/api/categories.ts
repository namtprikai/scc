import request from '@/utils/request'
export const getDetailCategory = (id: number) =>
  request({
    url: `/category/${id}/`,
    method: 'get'
  })

export const lockCategory = (id: number) =>
  request({
    url: `/category/${id}/lock/`,
    method: 'get'
  })
