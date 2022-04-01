import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SettingApp: RouteConfig = {
  path: '/products',
  component: Layout,
  meta: {
    name: 'menuGeneralSettingFrame'
  },
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "list-product" */ '@/views/product/list.vue'),
      name: 'ListProduct',
      meta: {
        title: 'productList',
        name: 'menuAppList',
        alwaysShow: false
      }
    },
    {
      path: 'create',
      component: () => import(/* webpackChunkName: "create-product" */ '@/views/product/create.vue'),
      name: 'CreateProduct',
      meta: {
        title: 'productCreate',
        hidden: true,
        activeMenu: '/products'
      }
    },
    {
      path: ':id(\\d+)',
      component: () => import(/* webpackChunkName: "detail-product" */ '@/views/product/detail.vue'),
      name: 'EditProduct',
      meta: {
        title: 'productDetail',
        hidden: true,
        activeMenu: '/products'
      }
    }
  ]
}

export default SettingApp
