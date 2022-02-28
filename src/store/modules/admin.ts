import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getAdminInfo, checkToken } from '@/api/admins'
import { getAcToken, setAcToken, removeAcToken, getRfToken, setRfToken, removeRfToken, decodeToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'
/* eslint-disable */
import jwt_decode from 'jwt-decode'
/* eslint-enable */

export interface IAdminState {
  acToken: string
  rfToken: string
  name: string
  isMaster: boolean
  policyGroups: number[]
  roles: string[]
  email: string
}

@Module({ dynamic: true, store, name: 'admin' })
class Admin extends VuexModule implements IAdminState {
  public acToken = getAcToken() || ''
  public rfToken = getRfToken() || ''
  public name = ''
  public isMaster = false
  public policyGroups: number[] = []
  public roles: string[] = []
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
    const { data } = await getAdminInfo({ /* Your params here */ })
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const { roles } = data.admin
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetAdminInfo: roles must be a non-null array!')
    }
    // TODO
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
