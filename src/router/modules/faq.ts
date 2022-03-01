import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const FAQ: RouteConfig = {
  path: '/faq',
  component: Layout,
  redirect: '/faq/list-user',
  name: 'FAQ',
  meta: {
    title: 'menuFaqFrame'
    // icon: 'setting'
  },
  children: [
    {
      path: 'list-user',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/faq/list-user/index.vue'),
      name: 'List User',
      meta: { title: 'menuUserList' }
    },
    {
      path: 'manager-user',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/faq/manager-user/index.vue'),
      name: 'Manager User',
      meta: { title: 'menuUserRole' }
    }
  ]
}

export default FAQ
