/* eslint-disable camelcase */
export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}

export interface IAdminData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}
export interface IRole {
  label: string
  isLogin: boolean
  created: Date | null
  modified: Date | null
}

export interface IEditRole{
  label:string
  is_login:boolean
}

export interface ICategory {
  id: number
  label: string
  text:string
  isLogin: boolean
  created: Date | null
  modified: Date | null
}
export interface IProductDetailData {
  id: number
  name: string
  maxFailureCountUser: number | null
  maxFailureTimeUser: number | null
  config: object
  created: string
  modified: string
}
