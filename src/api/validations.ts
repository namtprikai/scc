import request from '@/utils/request'
import { IEditValidation } from './types'

export const detailValidation = (id: number) =>
  request({
    url: `/validation/${id}/`,
    method: 'get'
  })

export const updateValidation = (id: number, data: IEditValidation) =>
  request({
    url: `/validation/${id}/`,
    method: 'patch',
    data
  })
