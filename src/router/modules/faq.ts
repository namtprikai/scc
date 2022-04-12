import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const FAQ: RouteConfig = {
  path: '/',
  component: Layout,
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
      path: 'roles',
      component: () => import(/* webpackChunkName: "roles" */ '@/views/role/list.vue'),
      name: 'ListRole',
      meta: {
        title: 'roleList',
        name: 'menuUserRole'
      }
    },
    {
      path: '/roles/create',
      component: () => import(/* webpackChunkName: "role-create" */ '@/views/role/create.vue'),
      name: 'CreateRole',
      meta: {
        hidden: true,
        title: 'roleCreate',
        activeMenu: '/roles'
      }
    },
    {
      path: '/roles/:id(\\d+)',
      component: () => import(/* webpackChunkName: "role-edit" */ '@/views/role/edit.vue'),
      name: 'EditRole',
      meta: {
        title: 'roleDetail',
        hidden: true,
        activeMenu: '/roles'
      }
    }
  ]
}

export default FAQ
