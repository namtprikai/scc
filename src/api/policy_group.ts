import request from '@/utils/request'

export const getPolicyGroup = (data: any) =>
  request({
    url: '/policy_group/',
    method: 'get',
    data
  })
