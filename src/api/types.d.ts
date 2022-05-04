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

export interface IEditRole {
  label: string
  is_login: boolean
}

export interface ICategory {
  id: number
  label: string
  text: string
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

export interface IRoleListItemData {
  id: number
  label: string
  created: string
  modified: string
}

export interface ICreateRole {
  label: string
  isLogin: boolean
}

export interface IProductListItemData {
  id: number
  name: string
  created: string
  modified: string
}

export interface IAdminListItemData {
  id: number
  name: string
  email: string
  productId: number[]
  productName: string[]
  isMailauthCompleted: boolean
  isMaster: boolean
  isEnabled: boolean
  isEnabledStr: string
  isLock: boolean
  create: string
  modified: string
}
export interface IPolicyItem {
  id: number
  label: string
  description: string | null
  method: string
  uri: string
  isActive: boolean
  created: string
  modified: string
}

export interface ICreatePolicy {
  label: string
  description?: string
  config?: any
}

export interface IUpdatePolicyPolicyGroup {
  policy_id: number[]
  delete_id: number[]
}
export interface IEditPolicy {
  id: number
  label: string
  description: string | null
  isActive: boolean
}
export interface IUserCreate {
  name: string
  email: string
  config: object | null
}
export interface IUser {
  id: number
  name: string
  email: string
  config: object | null
  isMailauthCompleted: boolean
  isAuto: boolean
  isEnabled: boolean
  isLock: boolean
  created: Date | null
  modified: Date | null
}

export interface IConditionGroup{
  id: number
  level: string
  label: string
  config: object | null
  isSetting: boolean
  created: Date | null
  modified: Date | null
}
export interface ICondition{
  id: number
  label: string
  conditionGroupId: number
  created: Date | null
  modified: Date | null
}

export interface IPolicyGroupListItemData {
  id: number
  label: string
  description: string
  method: string
  uri: string
  isActive: boolean
  created: string
  modified: string
}

export interface IPolicyListItemData {
  id: number
  label: string
  description: string
  method: string
  uri: string
  isActive: boolean
  created: string
  modified: string
  isCheck : boolean
}
export interface IPolicyGroup {
  label: string
  description: string
  config: object
  created: string
  modified: string
}

export interface IListChangeProductAdminItem {
  id: number
  name: string
  isCheck: boolean
  created: string
  modified: string
}

export interface IUpdateProductAdmin {
  productId: number[]
  deleteId: number[]
}

export interface IListChangePolicyGroupAdminItem {
  id: number
  label: string
  isCheck: boolean
  created: string
  modified: string
}

export interface IUpdatePolicyGroupAdmin {
  policyGroupId: number[]
  deleteId: number[]
}

export interface IEditValidation {
  pattern: string | null
  max: number | null
  min: number | null
}

export interface IValidationDetail {
  id: number
  tableName: string
  columnName: string
  type: string
  pattern: string | null
  systemMaximum: number
  max: number | null
  min: number | null
  created: string
  modified: string
}
export interface IUserListItemData {
  id:number
  productId:number[]
  productName: string[]
  name:string
  email:string
  isMailauthCompleted:boolean
  isAuto:boolean
  isEnabled:boolean|string
  isLock:boolean
  created:string
  modified:string
}

export interface IListValidation {
  id: number
  table_name: string
  column_name: string
  type: string
  pattern: number[]
  system_maximum: string[]
  max: number
  min: number
  create: string
  modified: string
}
