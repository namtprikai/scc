/* eslint-disable camelcase */
export interface ICreateAdminResponse{
    id: number
    name: string
    email: string
    is_mailauth_completed: boolean
    is_master: boolean
    is_enabled: boolean
    is_lock: boolean
  }
