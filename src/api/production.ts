import request from '@/utils/request'

export const createProduct = (data: any) =>
  request({
    url: '/product/',
    method: 'post',
    data
  })

export const getProduct = (data : any) =>
  request({
    url: '/product/',
    method: 'get',
    data
  })

export const deleteProduct = (id: number) =>
  request({
    url: `/product/${id}/`,
    method: 'delete'
  })

export const getDetailProduct = (id: number) =>
  request({
    url: `/product/${id}/`,
    method: 'get'
  })

export const updateProduct = (id: number, data: any) =>
  request({
    url: `/product/${id}/`,
    method: 'patch',
    data
  })