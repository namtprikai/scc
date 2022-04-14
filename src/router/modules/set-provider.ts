import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SetProvider: RouteConfig = {

  path: '/',
  component: Layout,
  name: 'SetProvider',
  meta: {
    name: 'menuPresentAnalysis'
  },
  children: [
  {
      path: 'validations',
      component: () => import(/* webpackChunkName: "search validation" */ '@/views/search-validation/index.vue'),
      name: 'SearchValidation',
      meta: {
        title: 'validationSearch',
        name: 'menuValidateList'
      }
    },
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
