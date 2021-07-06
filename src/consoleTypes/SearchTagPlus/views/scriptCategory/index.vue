<template>
	<div>
		<b-input type="text" v-model="searchText"></b-input>
		<!-- <b-button v-on:click="search(searchText)">検索</b-button> -->
		<b-list-group>
			<b-list-group-item>asdf</b-list-group-item>
		</b-list-group>
		<faq-client-page-wrapper :talkscript="talkscript" />
	</div>
</template>

<script lang="ts">
import { v4 } from "uuid";
import { getList } from "@/api/table";
import { Component, Vue } from "vue-property-decorator";
import { eventHub } from "@/init/eventHub";
import _ from "lodash";
import FaqClientPageWrapper from "@/components/FaqClientPage/index.vue";
// import { createAutocompleteStore } from "@/store/modules/autocompleteStore";
// import { createHistoryStore } from '@/store/modules/historyStore';
import { Search } from "@/components/FaqClientPage/search";
// import dataResource from "@/components/FaqClientPage/dataResource";
import { Watch } from "vue-property-decorator";
import { navigationStoreModule } from "@/components/FaqClientPage/store/navigationStore";
// import {
//   fromRoute,
//   toRoute,
//   openByResource,
// } from '@/components/FaqClientPage/resourceNavigationUtil';

// @ts-ignore
@Component({
	filters: {},
	components: {
		FaqClientPageWrapper,
	},
})
export default class ScriptCategory extends Vue {
	searchText = "";
	get talkscript() {
		return [];
	}
	// async search(text: string) {
	// 	const idList = await search.searchScore(text);
	// 	// idList.map((talkScriptId: string) => {
	// 	// 	return dataResource.getItemSync({
	// 	// 		resourceName: "talkScript",
	// 	// 		talkScriptId
	// 	// 	});
	// 	// });
	// console.log(idList);
	// 	navigationStoreModule.hoge();
	// 	if (idList && idList.length > 0) {
	// 		const routes = await dataResource.getRoutesById(idList[0].id);
	// 		console.log(routes);
	// 		navigationStoreModule.setRoutes(routes);
	// 		// openByResource(this.navigationStore, await fromRoute({talkScriptId:idList[0],stepEncoded:atob(idList[0])}));
	// 	}
	// }
}
</script>
<style type="sass" lang="scss"></style>
<style type="sass" lang="scss" scoped></style>
