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
      component: () => import(/* webpackChunkName: "admins" */ '@/views/set-admin/list-admin/index.vue'),
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
    // {
    //   path: '/policy-groups',
    //   component: () => import(/* webpackChunkName: "policy-group-list" */ '@/views/policy-group/list.vue'),
    //   name: 'ListPolicyGroup',
    //   meta: {
    //     title: 'policyGroupList',
    //     name: 'menuPolicySetting'
    //   }
    // },
    {
      path: '/policy-groups/create',
      component: () => import(/* webpackChunkName: "policy-group-create" */ '@/views/policy-group/create.vue'),
      name: 'CreatePolicyGroup',
      meta: {
        title: 'policyGroupCreate',
        noCache: true,
        hidden: true,
        activeMenu: '/policy-groups'
      }
    }
  ]
}

export default SettingAdmin
