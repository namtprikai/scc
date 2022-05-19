import request from '@/utils/request'

export const getCategoryQuestions = (idProduct: number) =>
  request({
    url: `/product/${idProduct}/category/`,
    method: 'get'
  })
