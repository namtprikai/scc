import Vue from 'vue';
import 'normalize.css';
import ElementUI from 'element-ui';
import SvgIcon from 'vue-svgicon';
import '@/styles/index.scss';
import '@/icons/components';
import './permission';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

import VirtualStream from '@/libs/vue-virtual-stream.esm';
import VueSanitize from 'vue-sanitize';
// import InputTag from 'vue-input-tag';
// Vue.component('input-tag', InputTag);
// import Chat from 'vue-beautiful-chat';
// Vue.use(Chat);
/**
 * This project originally used easy-mock to simulate data requests,
 * but its official service is not stable.
 * So here We use Mock.js for a local emulation,
 * it will intercept your request and you won't see the request in the network.
 * If you remove `import '../mock'` it will automatically request easy-mock data.
 */
// import '../../../mock'; // simulation data requests
import VModal from 'vue-js-modal';
import App from './App.vue';
// import parentstore from '@/store';
import store from './store';
import router from './router';
import './registerServiceWorker';
import { eventHub } from '@/init/eventHub';
import { VueConfiguration } from 'vue/types/vue';
import { version } from './utils/configration';
import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './styles/custom.scss';
// import { MessageListService } from './services/messageList';
import { TagService } from './services/tag';
import VueScrollto from 'vue-scrollto';
import VueMoment from 'vue-moment';
import {
	ScriptDataTree,
	TalkScript,
	TalkScriptModule,
} from "@/store/modules/talkScript";
import { UpdateServer } from '@/api/updateServer';
// import Accordion from "@/components/BotConfigTemp/Accordion.vue";
import Treedion from '@/components/TreeFile/index.vue';
import { TabHeader } from '@/components/TabHeader';
import { BCardAccordion } from '@/components/BCardAccodion';
import locale from 'element-ui/lib/locale/lang/ja';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
// import {Moment,Moment} from 'moment';
import { updateServerParams } from '@pconfig/config';
declare module 'vue/types/vue' {
	interface Vue {
		$moment: any;
	}
}

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VirtualStream);
Vue.use(VueSanitize);

Vue.use(VModal, { dynamic: true, dialog: true });
UpdateServer.setDefaultParam({
	public: true,
	with_tag_package: true,
	with_bot_package: false,
	version: "1",
	...updateServerParams
});
Vue.component('BCardAccordion', BCardAccordion);
Vue.component('TabHeader', TabHeader);
// Vue.component("accordion", Accordion);
Vue.component('treedion', Treedion);
// import * as history from 'connect-history-api-fallback';
// Vue.use(history);
Vue.use(VueMoment);
// Object.assign(store, parentstore);
Vue.use(VueScrollto);
eventHub.$on('loginAfterInit', async () => {
  console.log('loginAfterInit');
    await TalkScriptModule.getTalkScript();
	// await MessageListService.init();
	TagService.init();
});
Vue.use(ElementUI, { locale });
Vue.use(SvgIcon, {
	tagName: 'svg-icon',
	defaultWidth: '1em',
	defaultHeight: '1em',
});
router.beforeEach((to, from, next) => {
	console.log(to);
	if (from.meta.confirmation?.is) {
		Vue.prototype.$modal.show('dialog', {
			title: from.meta.confirmation.message,
			buttons: [
				{
					title: '編集終了',
					handler: () => {
						next();
						if (from.meta.confirmation.after) {
							from.meta.confirmation.after();
						}
						Vue.prototype.$modal.hide('dialog');
					},
				},
				{
					title: 'キャンセル',
					handler: () => {
						next(false);
						Vue.prototype.$modal.hide('dialog');
					},
				},
			],
		});
		// if (window.confirm(from.meta.confirmation.message)) {
		// 	next();
		// } else {
		// 	next(false);
		// }
	} else {
		next();
	}
});
Vue.use(VueGoodTablePlugin);

Vue.config.productionTip = false;

const vue = new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
Vue.prototype.version = version;
