import request from '@/utils/request'

export const createMedia = (params: any) =>
  request({
    url: '/media/',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })

export const getMedia = (params: any) =>
  request({
    url: '/media/',
    method: 'get',
    params
  })

export const deleteMedia = (id: number) =>
  request({
    url: `/media/${id}/`,
    method: 'delete'
  })

export const deleteMediaAll = (data: any) =>
  request({
    url: '/media/delete/',
    method: 'post',
    data
  })
