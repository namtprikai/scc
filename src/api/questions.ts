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
// export const editCategory = (id: number, data: any) =>
//   request({
//     url: `/category/${id}/`,
//     method: 'patch',
//     data
//   })
// export const lockCategory = (id: number) =>
//   request({
//     url: `/category/${id}/lock/`,
//     method: 'get'
//   })
