import request from '@/utils/request'

export const getConditions = () =>
  request({
    url: '/condition/',
    method: 'get'
  })
