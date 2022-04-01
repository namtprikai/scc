import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SettingAdmin: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    name: 'menuAdminSettingFrame'
  },
  name: 'menu',
  children: [
    {
      path: 'admins',
      component: () => import(/* webpackChunkName: "admins" */ '@/views/admin/list.vue'),
      name: 'ListAdmin',
      meta: {
        title: 'adminList',
        name: 'menuAdminList',
        alwaysShow: false
      }
    },
    {
      path: '/admins/create',
      component: () => import(/* webpackChunkName: "admin-create" */ '@/views/admin/create.vue'),
      name: 'CreateAdmin',
      meta: {
        title: 'adminCreate',
        noCache: true,
        hidden: true,
        name: 'adminCreate',
        activeMenu: '/admins'
      }
    },
    {
      path: '/admins/:adminId(\\d+)',
      component: () => import(/* webpackChunkName: "admin-show" */ '@/views/admin/edit.vue'),
      name: 'EditAdmin',
      meta: {
        title: 'adminEdit',
        noCache: true,
        hidden: true,
        name: 'adminEdit',
        activeMenu: '/admins'
      }
    },
    {
      path: 'roles',
      component: () => import(/* webpackChunkName: "roles" */ '@/views/role/list.vue'),
      name: 'ListRole',
      meta: {
        name: 'menuPolicySetting',
        title: 'roleList'
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

export default SettingAdmin
