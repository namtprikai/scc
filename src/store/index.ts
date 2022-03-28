import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IAdminState } from './modules/admin'
import { ITagsViewState } from './modules/tags-view'
import { IErrorLogState } from './modules/error-log'
import { IPermissionState } from './modules/permission'
import { ISettingsState } from './modules/settings'
import { RoleState } from './modules/role'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  admin: IAdminState
  tagsView: ITagsViewState
  errorLog: IErrorLogState
  permission: IPermissionState
  settings: ISettingsState
  role: RoleState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
