import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SettingAdmin: RouteConfig = {
  path: '/set-admin',
  component: Layout,
  redirect: '/set-admin/list-admin',
  name: 'Setting Admin',
  meta: {
    title: 'menuAdminSettingFrame'
    // icon: 'setting'
  },
  children: [
    {
      path: 'list-admin',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-admin/list-admin/index.vue'),
      name: 'List Admin',
      meta: { title: 'menuAdminList' }
    },
    {
      path: 'set-permission',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-admin/set-permission/index.vue'),
      name: 'Set Permission',
      meta: { title: 'menuPolicySetting' }
    }
  ]
}

export default SettingAdmin
