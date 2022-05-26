import request from '@/utils/request'
export const getDetailQuestion = (id: number) =>
  request({
    url: `/question/${id}/`,
    method: 'get'
  })
export const getFullDetailQuestion = (id: number) =>
  request({
    url: `/question/${id}/details`,
    method: 'get'
  })
export const addQuestionProduct = (id: number, data: any) =>
  request({
    url: `/question/${id}/product/add/`,
    method: 'post',
    data
  })
export const delQuestion = (id: number) =>
  request({
    url: `/question/${id}/`,
    method: 'delete'
  })
export const delQuestionProduct = (id: number, data: any) =>
  request({
    url: `/question/${id}/product/`,
    method: 'post',
    data
  })
export const createQuestionAnswer = (data: any) =>
  request({
    url: '/question/direct_answer/',
    method: 'post',
    data
  })
