import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, checkToken, getPoliciesAdmin, getDetailAdmin } from '@/api/admins'
import { getAcToken, setAcToken, removeAcToken, getRfToken, setRfToken, removeRfToken, decodeToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'
/* eslint-disable */
import jwt_decode from 'jwt-decode'
/* eslint-enable */

export interface Policy {
  id: number
  isActive: boolean
  description: string
  label: string
  uriName: string
  method: string
  modified: string
  created: string
}

export interface IAdminState {
  id: number
  acToken: string
  rfToken: string
  name: string
  config: object | null
  isMailauthCompleted: boolean
  isMaster: boolean
  policyGroups: number[]
  roles: string[]
  email: string
  isEnabled: boolean
  isLock: boolean
  created: string
  modified: string
  policyList: Policy[]
  products: number[]
}

@Module({ dynamic: true, store, name: 'admin' })
class Admin extends VuexModule implements IAdminState {
  public id = 0
  public acToken = getAcToken() || ''
  public rfToken = getRfToken() || ''
  public name = ''
  public config: object | null = null
  public isMailauthCompleted = false
  public isEnabled = true
  public isLock = false
  public created = ''
  public modified = ''
  public policyList: Policy[] = []
  public isMaster = false
  public policyGroups: number[] = []
  public roles: string[] = []
  public products: number[] = []
  public email = ''

  @Mutation
  private SET_AC_TOKEN(token: string) {
    this.acToken = token
  }

  @Mutation
  private SET_RF_TOKEN(token: string) {
    this.rfToken = token
  }

  @Mutation
  private SET_POLICY_LIST(policyList: Policy[]) {
    this.policyList = policyList
  }

  @Mutation
  private SET_PRODUCTS(products: number[]) {
    this.products = products
  }

  @Mutation
  private SET_ADMIN_INFO(adminInfo: IAdminState) {
    this.id = adminInfo.id
    this.name = adminInfo.name
    this.email = adminInfo.email
    this.config = adminInfo.config
    this.isMailauthCompleted = adminInfo.isMailauthCompleted
    this.isMaster = adminInfo.isMaster
    this.isEnabled = adminInfo.isEnabled
    this.isLock = adminInfo.isLock
    this.created = adminInfo.created
    this.modified = adminInfo.modified
    this.policyList = adminInfo.policyList
    this.products = adminInfo.products
    this.policyGroups = adminInfo.policyGroups
    this.roles = adminInfo.roles
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_IS_MASTER(isMaster: boolean) {
    this.isMaster = isMaster
  }

  @Mutation
  private SET_POLICY_GROUPS(policyGroups: number[]) {
    this.policyGroups = policyGroups
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Action
  public async ChangeRoles() {
    // Dynamically modify permissions
    // const token = role + '-token'
    // this.SET_TOKEN(token)
    // setToken(token)
    // await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    PermissionModule.dynamicRoutes.forEach(route => {
      router.addRoute(route)
    })
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async Login(adminInfo: { username: string, password: string }) {
    let { username, password } = adminInfo
    username = username.trim()
    const { data } = await login({ name: username, password: password })
    const tokenObject = decodeToken(data.access_token)
    setAcToken(data.access_token)
    setRfToken(data.refresh_token)
    this.SET_AC_TOKEN(data.access_token)
    this.SET_RF_TOKEN(data.refresh_token)
    this.SET_ROLES(['admin'])
    this.ChangeRoles()
    this.SET_NAME(tokenObject.name)
    this.SET_IS_MASTER(tokenObject.is_master)
    this.SET_POLICY_GROUPS(tokenObject.policy_groups)
  }

  @Action
  public ResetToken() {
    removeAcToken()
    removeRfToken()
    this.SET_AC_TOKEN('')
    this.SET_RF_TOKEN('')
  }

  @Action
  public async CheckToken(refreshToken: string) {
    const { data } = await checkToken({ refresh_token: refreshToken })
    debugger
    setAcToken(data.access_token)
  }

  @Action
  public async GetAdminInfo() {
    if (this.acToken === '') {
      throw Error('GetAdminInfo: token is undefined!')
    }
    const tokenInfo = decodeToken(this.acToken)
    const adminId = tokenInfo.id
    const products = tokenInfo.products
    const policyGroups = tokenInfo.policy_groups
    const policyList: Policy[] = []

    // Get policyList
    if (policyGroups.length > 0) {
      for (const policyGroup of policyGroups) {
        const { data } = await getPoliciesAdmin(policyGroup)
        data.forEach((element: any) => {
          const policy: Policy = {
            id: element.id,
            label: element.label,
            isActive: element.is_active,
            description: element.description,
            uriName: '',
            method: '',
            modified: element.modified,
            created: element.created
          }
          policyList.push(policy)
        })
      }
    }
    const { data } = await getDetailAdmin(adminId)
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }

    const adminInfo: IAdminState = {
      id: data.id,
      acToken: this.acToken,
      rfToken: this.rfToken,
      name: data.name,
      email: data.email,
      config: data.config,
      isMailauthCompleted: data.is_mailauth_completed,
      isMaster: data.is_master,
      isEnabled: data.is_enabled,
      isLock: data.is_lock,
      created: data.created,
      modified: data.modified,
      policyList: policyList,
      products: products,
      policyGroups: policyGroups,
      roles: ['admin']
    }

    // this.SET_POLICY_LIST(policyList)
    this.SET_ADMIN_INFO(adminInfo)
    // this.SET_PRODUCTS(products)
  }

  @Action
  public async LogOut() {
    if (this.acToken === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout()
    removeAcToken()
    removeRfToken()
    resetRouter()

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_AC_TOKEN('')
    this.SET_RF_TOKEN('')
    this.SET_ROLES([])
  }
}

export const AdminModule = getModule(Admin)
