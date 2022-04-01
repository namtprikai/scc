import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const Resource: RouteConfig = {
  path: '/resource',
  component: Layout,
  redirect: '/resource/list-media',
  meta: {
    name: 'menuResourceFrame'
  },
  children: [
    {
      path: 'list-media',
      component: () => import(/* webpackChunkName: "list-media" */ '@/views/resource/list-media/index.vue'),
      name: 'ListMedia',
      meta: {
        title: 'menuMediaList',
        name: 'menuMediaList'
      }
    }
  ]
}

export default Resource
