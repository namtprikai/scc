import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SetProvider: RouteConfig = {
  path: '/set_provider',
  component: Layout,
  redirect: '/set_provider/list-validation',
  name: 'set_provider',
  meta: {
    title: 'menuPresentAnalysis'
    // icon: 'set_provider'
  },
  children: [

    {
      path: 'list-validation',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-provider/list-validation/index.vue'),
      name: 'List Validation',
      meta: { title: 'menuValidateList' }
    }

  ]
}

export default SetProvider
