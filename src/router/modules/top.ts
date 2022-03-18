import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const Top: RouteConfig = {
  path: '/',
  component: Layout,
  redirect: '/top',
  name: 'top',
  meta: {
    title: 'menuTop'
  }
}

export default Top
