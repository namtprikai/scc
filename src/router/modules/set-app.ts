import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SettingApp: RouteConfig = {
  path: '/settings',
  component: Layout,
  redirect: '/setting/manager',
  name: 'Setting',
  meta: {
    title: 'menuGeneralSettingFrame'
    // icon: 'setting'
  },
  children: [
    {
      path: 'manager',
      component: () => import(/* webpackChunkName: "manager app" */ '@/views/setting/manager/index.vue'),
      name: 'managerapp',
      meta: { title: 'menuAppList' }
    }
  ]
}

export default SettingApp
