import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SettingApp: RouteConfig = {
  path: '/',
  component: Layout,
  name: 'Setting',
  meta: {
    title: 'menuGeneralSettingFrame'
    // icon: 'setting'
  },
  children: [
    {
      path: 'products',
      component: () => import(/* webpackChunkName: "product-list" */ '@/views/product/list.vue'),
      name: 'managerapp',
      meta: { title: 'menuAppList' }
    }
  ]
}

export default SettingApp
