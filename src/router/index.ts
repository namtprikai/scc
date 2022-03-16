import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
import SettingApp from './modules/set-app'
import SettingAdmin from './modules/set-admin'
import FAQ from './modules/faq'
import SetFAQ from './modules/set-faq'
import Resource from './modules/resource'
import AnalysisPresentState from './modules/analysis-present-state'
import SetProvider from './modules/set-provider'
import top from './modules/top'
Vue.use(VueRouter)

export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: 'login'
    }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/reset-password/:hash',
    component: () => import('@/views/reset-password/index.vue'),
    meta: {
      hidden: true,
      title: 'resetPassword'
    },

    props: (route) => ({ hash: route.query })
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/notification',
    component: () => import(/* webpackChunkName: "notification" */ '@/views/notification/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/active-admin/:hash',
    component: () => import('@/views/active-admin/index.vue'),
    meta: {
      hidden: true,
      title: 'activeAdmin'
    }
  },
  {
    path: '/products',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: 'create',
        component: () => import(/* webpackChunkName: "create-product" */ '@/views/product/create.vue'),
        name: 'CreateProduct',
        meta: {
          title: 'productCreate',
          hidden: true
        }
      },
      {
        path: ':id(\\d+)',
        component: () => import(/* webpackChunkName: "detail-product" */ '@/views/product/detail.vue'),
        name: 'DetailProduct',
        meta: {
          title: 'productDetail',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index.vue'),
        name: 'Profile',
        meta: {
          title: 'profile',
          icon: 'user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/roles',
    component: Layout,
    redirect: '/roles/list',
    meta: { hidden: true },
    children: [
      {
        path: '',
        component: () => import('@/views/role/list.vue'),
        name: 'RoleList',
        meta: {
          title: 'roleList'
        }
      },
      {
        path: ':id(\\d+)',
        component: () => import(/* webpackChunkName: "edit-role" */ '@/views/role/edit.vue'),
        name: 'DetailEditRole',
        meta: {
          title: 'roleDetail'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    meta: { hidden: true }
  },
  {
    path: '/admins',
    component: Layout,
    redirect: '/admins',
    meta: {
      title: 'admin'
    },
    children: [
      {
        path: 'create',
        component: () => import(/* webpackChunkName: "example-create" */ '@/views/admin/create.vue'),
        name: 'CreateAdmin',
        meta: {
          title: 'adminCreate',
          noCache: true,
          hidden: true
        }
      },
      {
        path: ':adminId(\\d+)',
        component: () => import(/* webpackChunkName: "example-create" */ '@/views/admin/edit.vue'),
        name: 'EditAdmin',
        meta: {
          title: 'adminEdit',
          noCache: true,
          hidden: true
        }
      }
    ]
  }
]

export const asyncRoutes: RouteConfig[] = [
  top,
  SettingApp,
  SettingAdmin,
  FAQ,
  SetFAQ,
  Resource,
  AnalysisPresentState,
  SetProvider
]

const createRouter = () => new VueRouter({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
