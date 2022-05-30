import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SearchLog: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    name: 'menuLogSearch'
  },
  name: 'searchLog',
  children: [
    {
      path: 'search-log',
      component: () => import(/* webpackChunkName: "admins" */ '@/views/search-log/index.vue'),
      name: 'SearchLog',
      meta: {
        title: 'logSearch',
        name: 'menuLogSearch',
        alwaysShow: false
      }
    }
  ]
}

export default SearchLog
