import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const SetFAQ: RouteConfig = {
  path: '/set-faq',
  component: Layout,
  redirect: '/set-faq/edit_csv',
  name: 'SetFaq',
  meta: {
    name: 'menuFaqSettingFrame'
  },
  children: [
    {
      path: 'edit-csv',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-faq/edit-csv/index.vue'),
      name: 'EditCsv',
      meta: {
        title: 'menuCsvModify',
        name: 'menuFaqSettingFrame'
      }
    },
    {
      path: 'direct-edit',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-faq/direct-edit/index.vue'),
      name: 'DirectEdit',
      meta: {
        title: 'menuDirectEdit',
        name: 'menuDirectEdit'
      }
    },
    {
      path: 'keywords',
      component: () => import(/* webpackChunkName: "list-keyword" */ '@/views/keyword/list.vue'),
      name: 'ListKeyword',
      meta: {
        title: 'keywordList',
        name: 'menuKeywordList'
      }
    }
  ]
}

export default SetFAQ
