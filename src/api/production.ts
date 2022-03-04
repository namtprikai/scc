import request from '@/utils/request'

export const createProduct = (data: any) =>
  request({
    url: '/product/',
    method: 'post',
    data
  })
