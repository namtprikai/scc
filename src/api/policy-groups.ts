import request from '@/utils/request'
import { ICreatePolicy, IUpdatePolicyPolicyGroup } from './types'

export const createPolicyGroup = (data: ICreatePolicy) =>
  request.post<{ id: string }>('/policy_group/', data)

export const updatePolicyOfPolicyGroup = (policyGroupId: string, data: IUpdatePolicyPolicyGroup) =>
  request.post(`/policy_group/${policyGroupId}/policy/`, data)
