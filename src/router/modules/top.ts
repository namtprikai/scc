import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const Top: RouteConfig = {
  path: '/',
  component: Layout,
  redirect: '/top',
  name: 'Top',
  meta: {
    title: 'menuTop',
    name: 'menuTop'
  }
}

export default Top
