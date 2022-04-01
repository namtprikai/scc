import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const componentsRouter: RouteConfig = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  meta: {
    title: 'components',
    icon: 'component'
  },
  children: [
    {
      path: 'tinymce',
      component: () => import(/* webpackChunkName: "tinymce" */ '@/views/components-demo/tinymce.vue'),
      meta: { title: 'tinymce' }
    },
    {
      path: 'markdown',
      component: () => import(/* webpackChunkName: "markdown" */ '@/views/components-demo/markdown.vue'),
      meta: { title: 'markdown' }
    },
    {
      path: 'json-editor',
      component: () => import(/* webpackChunkName: "json-editor" */ '@/views/components-demo/json-editor.vue'),
      meta: { title: 'jsonEditor' }
    },
    {
      path: 'split-pane',
      component: () => import(/* webpackChunkName: "split-pane" */ '@/views/components-demo/split-pane.vue'),
      meta: { title: 'splitPane' }
    },
    {
      path: 'avatar-upload',
      component: () => import(/* webpackChunkName: "avatar-upload" */ '@/views/components-demo/avatar-upload.vue'),
      meta: { title: 'avatarUpload' }
    },
    {
      path: 'dropzone',
      component: () => import(/* webpackChunkName: "dropzone" */ '@/views/components-demo/dropzone.vue'),
      meta: { title: 'dropzone' }
    },
    {
      path: 'sticky',
      component: () => import(/* webpackChunkName: "sticky" */ '@/views/components-demo/sticky.vue'),
      meta: { title: 'sticky' }
    },
    {
      path: 'count-to',
      component: () => import(/* webpackChunkName: "count-to" */ '@/views/components-demo/count-to.vue'),
      meta: { title: 'countTo' }
    },
    {
      path: 'mixin',
      component: () => import(/* webpackChunkName: "component-mixin" */ '@/views/components-demo/mixin.vue'),
      meta: { title: 'componentMixin' }
    },
    {
      path: 'back-to-top',
      component: () => import(/* webpackChunkName: "back-to-top" */ '@/views/components-demo/back-to-top.vue'),
      name: 'BackToTopDemo',
      meta: { title: 'backToTop' }
    },
    {
      path: 'draggable-dialog',
      component: () => import(/* webpackChunkName: "draggable-dialog" */ '@/views/components-demo/draggable-dialog.vue'),
      meta: { title: 'draggableDialog' }
    },
    {
      path: 'draggable-kanban',
      component: () => import(/* webpackChunkName: "draggable-kanban" */ '@/views/components-demo/draggable-kanban.vue'),
      meta: { title: 'draggableKanban' }
    },
    {
      path: 'draggable-list',
      component: () => import(/* webpackChunkName: "draggable-list" */ '@/views/components-demo/draggable-list.vue'),
      meta: { title: 'draggableList' }
    },
    {
      path: 'draggable-select',
      component: () => import(/* webpackChunkName: "draggable-select" */ '@/views/components-demo/draggable-select.vue'),
      meta: { title: 'draggableSelect' }
    }
  ]
}

export default componentsRouter
