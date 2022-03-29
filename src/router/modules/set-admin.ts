import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SettingAdmin: RouteConfig = {
  path: '/set-admin',
  component: Layout,
  name: 'Setting Admin',
  meta: {
    title: 'menuAdminSettingFrame'
    // icon: 'setting'
  },
  children: [
    {
      path: 'admins',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-admin/list-admin/index.vue'),
      name: 'List Admin',
      meta: { title: 'menuAdminList' }
    },
    {
      path: 'roles',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/role/list.vue'),
      name: 'Set Permission',
      meta: { title: 'menuPolicySetting' }
    }
  ]
}

export default SettingAdmin
