import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const AnalysisPresentState: RouteConfig = {
  path: '/analysis-present-state',
  component: Layout,
  redirect: '/analysis-present-state/usage-history',
  name: 'analysis-present-state',
  meta: {
    title: 'menuPresentAnalysis'
  },
  children: [

    {
      path: 'usage-history',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/analysis-present-state/usage-history/index.vue'),
      name: 'Usage History',
      meta: { title: 'menuLogSearch' }
    }
  ]
}

export default AnalysisPresentState
