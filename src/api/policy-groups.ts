import request from '@/utils/request'
import { ICreatePolicy, IUpdatePolicyPolicyGroup } from './types'

export const getPolicyGroup = (data: any) =>
  request({
    url: '/policy_group/',
    method: 'get',
    data
  })

export const createPolicyGroup = (data: ICreatePolicy) =>
  request.post<{ id: string }>('/policy_group/', data)

export const updatePolicyOfPolicyGroup = (policyGroupId: string, data: IUpdatePolicyPolicyGroup) =>
  request.post(`/policy_group/${policyGroupId}/policy/`, data)

export const getListPolicyGroup = () => {
  return request.get('/policy_group/')
}

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
