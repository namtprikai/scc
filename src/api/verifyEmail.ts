import request from '@/utils/request'

export const enabledVerifyEmail = (params: string) =>
  request({
    url: `/admin/enabled/${params}/`,
    method: 'get'
  })
