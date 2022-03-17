import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { createRole } from '@/api/roles'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'

export interface RoleState {
  label: string
  isLogin: boolean
}

@Module({ dynamic: true, store, name: 'role' })
class Role extends VuexModule implements RoleState {
  public label = ''
  public isLogin = false

  @Mutation
  private SET_LABEL(label: string) {
    this.label = label
  }

  @Mutation
  private SET_IS_LOGIN(isLogin: boolean) {
    this.isLogin = isLogin
  }

  @Action({ rawError: true })
  public async Create(RoleInfo: { label: string, isLogin: boolean }) {
    let { label, isLogin } = RoleInfo
    label = label.trim()
    const { data } = await createRole({ label: label, is_login: isLogin })
  }
}

export const RoleModule = getModule(Role)
