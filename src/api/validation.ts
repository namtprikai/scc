import request from '@/utils/request'

export const searchValidation = (data : any, param :String) =>
  request({
    url: `/validation/search/?${param}`,
    method: 'get',
    data
  })
