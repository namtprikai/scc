import request from '@/utils/request'
import { IUpdatePolicyPolicyGroup } from './types'

export const getPolicyPolicyGroup = (id: number, params: any) =>
  request({
    url: `/policy_group/${id}/policy/`,
    method: 'get',
    params
  })

export const getDetailPolicyGroup = (id: number) =>
  request({
    url: `/policy_group/${id}/`,
    method: 'get'
  })

export const getListPolicy = (data: any) =>
  request({
    url: '/policy/',
    method: 'get',
    data
  })

export const updatePolicyGroup = (id: number, data: any) =>
  request({
    url: `/policy_group/${id}/`,
    method: 'patch',
    data

  })

export const updatePolicyPolicyGroup = (id: number, data: IUpdatePolicyPolicyGroup) =>
  request({
    url: `/policy_group/${id}/policy/`,
    method: 'post',
    data
  })
