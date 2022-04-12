import request from '@/utils/request'

export const getPolicies = () =>
  request({
    url: '/policy/',
    method: 'get'
  })
