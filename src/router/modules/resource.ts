import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const Resource: RouteConfig = {
  path: '/resource',
  component: Layout,
  redirect: '/resource/list-media',
  name: 'resource',
  meta: {
    title: 'menuResourceFrame'
    // icon: 'setting'
  },
  children: [
    {
      path: 'list-media',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/resource/list-media/index.vue'),
      name: 'List Media',
      meta: { title: 'menuMediaList' }
    }
  ]
}

export default Resource
