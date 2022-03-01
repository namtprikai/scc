import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SetFAQ: RouteConfig = {
  path: '/set-faq',
  component: Layout,
  redirect: '/set-faq/edit_csv',
  name: 'Set FAQ',
  meta: {
    title: 'menuFaqSettingFrame'
    // icon: 'setting'
  },
  children: [
    {
      path: 'edit-csv',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-faq/edit-csv/index.vue'),
      name: 'Edit CSV',
      meta: { title: 'menuCsvModify' }
    },
    {
      path: 'direct-edit',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-faq/direct-edit/index.vue'),
      name: 'Direct Edit',
      meta: { title: 'menuDirectEdit' }
    },
    {
      path: 'set-keyword',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-faq/set-keyword/index.vue'),
      name: 'Set Keyword',
      meta: { title: 'menuKeywordList' }
    }
  ]
}

export default SetFAQ
