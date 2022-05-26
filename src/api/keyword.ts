import request from '@/utils/request'

export const getListKeyword = () =>
  request({
    url: '/keyword/',
    method: 'get'
  })

export const deleteKeyword = (data: any) =>
  request({
    url: '/keyword/delete/',
    method: 'post',
    data
  })

export const updateKeyword = (data: any) =>
  request({
    url: '/keyword/edit/',
    method: 'post',
    data
  })

export const searchValidation = (params: any) =>
  request({
    url: '/validation/search/',
    method: 'get',
    params
  })
