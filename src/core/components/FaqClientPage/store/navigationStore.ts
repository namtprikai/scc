import Vue from "vue";
import Vuex from "vuex";
// import dataResource from '../dataResource';
import { DataResource } from "../dataResource";
import store from "@/store";
import { VuexModule, Module, MutationAction, Mutation, Action, getModule } from "vuex-module-decorators";
// import { eventHub } from '@/init/eventHub';
/* eslint-disable */
// Vue.use(Vuex);
@Module({ dynamic: true, store, name: 'navigationStore', namespaced: true })
class navigationStore extends VuexModule {
	[x: string]: any;
	dataResource: DataResource = new DataResource();
	index: any = 0;
	eventHub: any = {};
	routes: any[] = [
		{
			componentName: 'ResourceList',
			resourceName: 'talkScript',
			talkScriptId: '#',
			viewType: 'talkScript',
			// parentViewType: 'talkScript',
		},
	];
	get DataResource() {
		console.log(this.dataResource);
		return this.dataResource;
	}
	@Mutation
	SET_DATA_RESOURCE(scriptPackage: any) {
		console.log(scriptPackage);
		this.dataResource.setDataResource(scriptPackage);
	}
	@Action({ commit: 'SET_DATA_RESOURCE' })
	setDataResource(scriptPackage: any) {
		return scriptPackage;
	}
	get Index() {
		return this.index;
	}
	get Routes() {
		return this.routes;
	}
	@Mutation
	movePositionTo(index: any) {
		console.log(this);
		const _: any = this;

		if (this.routes && this.routes[index]) {
			this.index = index;
		}
	}
	@Action({ commit: 'movePositionTo' })
	movePositionBy(relative: any): any {
		console.log(this.Index);
		return navigationStoreModule.Index + relative;
	}
	@MutationAction({ mutate: ['routes', 'index'] })
	setRoutes(routes: any): any {
		console.log(routes);
		if (
			this.dataResource &&
			this.dataResource.isEquals({ a: this.routes, b: routes })
		) {
			console.log('cancel navigation routes update');
			return;
		}
		return {
			routes: routes,
			index: routes.length - 2,
		};
	}
	@MutationAction({ mutate: ['eventHub'] })
	setEventHub(eventHub: any): any {
		return { eventHub };
	}
	@Mutation
	hoge() {
		console.log('hoge');
	}
	@Mutation
	SETROUTES_BY_SCRIPTID(scriptId: string) {}
	@Action({
		commit: 'SETROUTES_BY_SCRIPTID',
	})
	setScriptById(scriptId: string) {
		// dataResource.getList();
		return scriptId;
	}
	@Mutation
	setResultScript(route: any) {
		this.eventHub.$emit(
			'setResultScript',
			Object.assign({}, route, { query: '-', routes: this.routes }),
		);
	}
	// indexの次の位置で開く
	@MutationAction({ mutate: ['routes', 'index'] })
	open({ route, index }: any): any {
		const getters: any = this.getters;
		console.log(getters.Routes);
		let routes = [];
		console.log(route.viewType);
		if (route.viewType == 'scenario') {
			routes = getters.Routes.slice(0, index + 1).concat([route]);
			this.commit('setResultScript', route);
		} else if (route.viewType == 'result') {
			routes = getters.Routes.slice(0, index + 1).concat([route]);
			this.commit('setResultScript', route);
		} else {
			routes = getters.Routes.slice(0, index + 1).concat([route]);
			index = index + 1;
		}

		// let index = getters.Index;
		// const routes = getters.Routes.slice(0, index + 1).concat([route]);
		// console.log(getters.Routes);
		// index = index + 1;
		return {
			routes,
			index,
		};
	}

	@Mutation
	close({ index }: any) {
		if (index > 0) {
			this.routes = this.routes.slice(0, index);
			this.index = index - 1;
		}
	}

	@Mutation
	canClose(index: any) {
		return index > 0;
	}
	@Mutation
	canMovePositionBy(relative: any) {
		return this.canMovePositionTo(this.index + relative);
	}
	canMovePositionTo(index: any) {
		return this.routes[index] != null;
	}

	get efficientRoutes() {
		return this.routes.slice(0, this.index + 1);
	}
}
export const navigationStoreModule = getModule(navigationStore);
// export const createNavigationStore = () => new Vuex.Store(navigationStoreConfig);

class BoundedNavigation {
	constructor(public navigationStore: any, public index: any) {}
	public open(route: any) {
		console.log(route);
		navigationStoreModule.open({ index: this.index, route });
	}
	public close() {
		navigationStoreModule.close({ index: this.index });
	}
	public canClose() {
		return this.index > 0;
	}
}

// export const getBoundedNavigationStore = (navigationStore: any, index: any): BoundedNavigation => {
// 	navigationStore.cachedBoundedStores =
// 		navigationStore.cachedBoundedStores || {};
// 	if (!navigationStore.cachedBoundedStores[index]) {
// 		navigationStore.cachedBoundedStores[index] = new BoundedNavigation(
// 			navigationStore,
// 			index
// 		);
// 	}
// 	return navigationStore.cachedBoundedStores[index];
// };
