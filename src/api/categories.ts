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
export const addCategoryProduct = (id: number, data: any) =>
  request({
    url: `/category/${id}/product/add/`,
    method: 'post',
    data
  })
export const delCategory = (id: number) =>
  request({
    url: `/category/${id}/`,
    method: 'delete'
  })
export const delCategoryProduct = (id: number, data: any) =>
  request({
    url: `/category/${id}/product/remove/`,
    method: 'post',
    data
  })
