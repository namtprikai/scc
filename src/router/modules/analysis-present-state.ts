import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const AnalysisPresentState: RouteConfig = {
  path: '/analysis-present-state',
  component: Layout,
  redirect: '/analysis-present-state/usage-history',
  name: 'MenuPresentAnalysis',
  meta: {
    name: 'menuPresentAnalysis'
  },
  children: [
    {
      path: 'usage-history',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/analysis-present-state/usage-history/index.vue'),
      name: 'MenuLogSearch',
      meta: {
        title: 'menuLogSearch',
        name: 'menuLogSearch'
      }
    }
  ]
}

export default AnalysisPresentState
