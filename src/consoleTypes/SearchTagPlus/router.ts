import Vue from 'vue';
import Router from 'vue-router';
import Layout from './views/layout/Layout.vue';
import Frame1 from '@/frames/b_1.vue';
import Frame2 from '@/frames/b_2.vue';
import Frame3 from '@/frames/b_3.vue';
import Frame4 from '@/frames/b_4.vue';
import Frame5 from '@/frames/b_5.vue';
import Frame6 from '@/frames/b_6.vue';
import Frame7 from '@/frames/b_7.vue';
import Box from '@/boxes/box.vue';
import { RouterConfig } from './config';
Vue.use(Router);

/*
		redirect:                      if `redirect: noredirect`, it won't redirect if click on the breadcrumb
		meta: {
				title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
				icon: 'svg-name'             the icon showed in the sidebar
				breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
				hidden: true                 if true, this route will not show in the sidebar (default is false)
		}
*/
console.log(process.env.BASE_URL);
export default new Router(RouterConfig(Layout, Box));
