import request from '@/utils/request'
export const getDetailCategory = (id: number) =>
  request({
    url: `/category/${id}/`,
    method: 'get'
  })
export const editCategory = (id: number, data: any) =>
  request({
    url: `/category/${id}/`,
    method: 'patch',
    data
  })
export const lockCategory = (id: number) =>
  request({
    url: `/category/${id}/lock/`,
    method: 'get'
  })
