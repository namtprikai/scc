import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SetProvider: RouteConfig = {
  path: '/set_provider',
  component: Layout,
  redirect: '/set_provider/list-validation',
  name: 'SetProvider',
  meta: {
    name: 'menuPresentAnalysis'
    // icon: 'set_provider'
  },
  children: [

    {
      path: 'list-validation',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-provider/list-validation/index.vue'),
      name: 'ListValidation',
      meta: {
        title: 'menuValidateList',
        name: 'menuValidateList'
      }
    }

  ]
}

export default SetProvider
