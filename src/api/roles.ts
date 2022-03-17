import request from '@/utils/request'
import { IEditRole, IRole, IRoleListItemData } from './types'

export const getRoles = () => request.get<IRoleListItemData[]>('/role/')

export const createRole = (data: any) =>
  request({
    url: '/role/',
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

export const deleteRole = (id: number) => request.delete(`/role/${id}/`)

export const getRoutes = (params: any) =>
  request({
    url: '/routes',
    method: 'get',
    params
  })

export const categoryRole = (id: number) =>
  request({
    url: `/role/${id}/category/`,
    method: 'get'
  })
export const questionRole = (id: number) =>
  request({
    url: `/role/${id}/question/`,
    method: 'get'
  })
