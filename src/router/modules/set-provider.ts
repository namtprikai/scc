import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SetProvider: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    title: 'menuProviderSetting',
    name: 'menuProviderSetting'
  },
  children: [
    // {
    //   path: 'validations',
    //   component: () => import(/* webpackChunkName: "list-validation" */ '@/views/validation/list.vue'),
    //   name: 'ListValidation',
    //   meta: {
    //     title: 'menuValidateList',
    //     name: 'menuValidateList'
    //   }
    // },
    {
      path: '/validations/:id(\\d+)',
      component: () => import(/* webpackChunkName: "list-validation" */ '@/views/validation/edit.vue'),
      name: 'DetailEditValidation',
      meta: {
        title: 'validationDetail',
        hidden: true,
        activeMenu: '/validations'
      }
    }
  ]
}

export default SetProvider
