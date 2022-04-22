import request from '@/utils/request'

export const getConditionGroups = () =>
  request({
    url: '/condition_group/',
    method: 'get'
  })
