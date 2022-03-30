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
      path: 'policy-groups',
      component: () => import(/* webpackChunkName: "policy-groups" */ '@/views/policy-group/list.vue'),
      name: 'ListPolicyGroup',
      meta: {
        name: 'menuPolicySetting',
        title: 'policyGroupList'
      }
    },
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
    },
    {
      path: '/policy-groups/:id(\\d+)',
      component: () => import(/* webpackChunkName: "detail-edit-policy-group" */ '@/views/policy-group/edit.vue'),
      name: 'DetailEditPolicyGroup',
      meta: {
        title: 'policyGroupDetail',
        noCache: true,
        hidden: true,
        activeMenu: '/policy-group'
      }
    },
    {
      path: 'policy-groups/policies',
      component: () => import(/* webpackChunkName: "list-policy" */ '@/views/policy/list.vue'),
      name: 'Policies',
      meta: {
        title: 'policyList',
        activeMenu: '/policy-groups',
        hidden: true
      }
    },
    {
      path: 'policy-groups/policies/:id(\\d+)',
      component: () => import(/* webpackChunkName: "detail-edit-policy" */ '@/views/policy/detail.vue'),
      name: 'DetailEditPolicy',
      meta: {
        title: 'policyDetail',
        activeMenu: '/policy-groups',
        hidden: true
      }

    }
  ]
}

export default SettingAdmin
