/* eslint-disable camelcase */
export interface ICreateAdminRequest{
    name: string
    email: string
    is_master: boolean
    config?: object
  }
