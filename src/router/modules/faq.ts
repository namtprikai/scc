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
      component: () => import(/* webpackChunkName: "list-user" */ '@/views/user/list.vue'),
      name: 'ListUser',
      meta: {
        title: 'userList',
        name: 'menuUserList'
      }
    },
    {
      path: 'users/create',
      component: () => import(/* webpackChunkName: "user-create" */ '@/views/user/create.vue'),
      name: 'CreateUser',
      meta: {
        title: 'userCreate',
        activeMenu: '/users',
        noCache: true,
        hidden: true
      }
    },
    {
      path: 'users/:id(\\d+)',
      component: () => import(/* webpackChunkName: "user-edit" */ '@/views/user/edit.vue'),
      name: 'DetailEditUser',
      meta: {
        title: 'userDetail',
        activeMenu: '/users',
        noCache: true,
        hidden: true
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
      name: 'DetailEditRole',
      meta: {
        title: 'roleDetail',
        hidden: true,
        activeMenu: '/roles'
      }
    }
  ]
}

export default FAQ
