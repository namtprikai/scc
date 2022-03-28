import request from '@/utils/request'
import { IEditRole, IRole } from './types'

export const getRoles = (params: any) =>
  request({
    url: '/roles',
    method: 'get',
    params
  })

export const createRole = (data: any) =>
  request({
    url: '/roles',
    method: 'post',
    data
  })

export const detailRole = (id: number) =>
  request({
    url: `/role/${id}/`,
    method: 'get'
  })

export const updateRole = (id: number, data: IEditRole) =>
  request({
    url: `/role/${id}/`,
    method: 'patch',
    data
  })

export const deleteRole = (id: number) =>
  request({
    url: `/roles/${id}`,
    method: 'delete'
  })

export const getRoutes = (params: any) =>
  request({
    url: '/routes',
    method: 'get',
    params
  })

export const categoryRole = (id: number, params:any = undefined) =>
  request({
    url: `/role/${id}/category/`,
    method: 'get',
    params
  })
export const questionRole = (id: number) =>
  request({
    url: `/role/${id}/question/`,
    method: 'get'
  })
