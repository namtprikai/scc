import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const FAQ: RouteConfig = {
  path: '/',
  component: Layout,
  redirect: '/faq/list-user',
  meta: {
    title: 'menuFaqFrame',
    name: 'menuFaqFrame'
  },
  children: [
    {
      path: 'users',
      component: () => import(/* webpackChunkName: "list-user" */ '@/views/faq/list-user/index.vue'),
      name: 'ListUser',
      meta: {
        title: 'menuUserList',
        name: 'menuUserList'
      }
    },
    {
      path: 'manager-user',
      component: () => import(/* webpackChunkName: "manage-user" */ '@/views/faq/manager-user/index.vue'),
      name: 'ManagerUser',
      meta: {
        title: 'menuUserRole',
        name: 'menuUserRole'
      }
    }
  ]
}

export default FAQ
