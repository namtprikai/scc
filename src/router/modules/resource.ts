import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const Resource: RouteConfig = {
  path: '/',
  component: Layout,
  meta: {
    name: 'menuResourceFrame'
  },
  children: [
    {
      path: 'media',
      component: () => import(/* webpackChunkName: "list-media" */ '@/views/media/list.vue'),
      name: 'ListMedia',
      meta: {
        title: 'mediaList',
        name: 'menuMediaList'
      }
    }
  ]
}

export default Resource
