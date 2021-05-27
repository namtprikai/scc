<template>
	<div v-if="!listLoading">
		<h2>シナリオ</h2>
		<b-row>
			<b-col lg="4" class="pb-2">
				<b-button v-on:click="add()">追加</b-button>
			</b-col>
		</b-row>
		<edit-wrap />
		<div v-for="(scenario, i) in ScenarioList" :key="i" class="scenarioWrap" style="text-align: right">
			<div v-if="'id' in scenario">
				<!-- <b-badge v-on:click="deleate(scenario.id)" type="sm" class="mr-1">X</b-badge> -->
				<accordion v-for="(flow, j) in scenario.flow" :key="j" :step="scenario.step" :data="flow" :parentstep="flow" :title="scenario.title" :scenario="scenario" :isroot="isroot" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import ScenarioParent from '@/views/talkscript/index';
// import SlVueTree from "sl-vue-tree";
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import ScenarioTemp from '@/components/ScenarioTemp/index.vue';
import { Scenario, ScenarioModule } from '@/store/modules/scenario';
import EditWrap from '@/components/EditWrap/index.vue';
import Accordion from '@/components/ScenarioTemp/Accordion.vue';
import { UpdateServer } from '@/api/updateServer';
import { Ajax } from '@/utils/parts';
import { PRODUCT_ID } from './../../utils/configration';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: 'success',
				draft: 'gray',
				deleted: 'danger',
			};
			return statusMap[status];
		},
	},
	components: {
		EditWrap,
		Accordion,
	},
})
export default class ScenarioListComp extends Vue {
	private listLoading = true;
	get isroot() {
		return true;
	}

	private ajax: Ajax = new Ajax();
	public created() {
		this.fetchData();
		// this.$forceUpdate();
	}

	private async fetchData() {
		this.listLoading = true;
		await ScenarioModule.getScenario();
		this.listLoading = false;
		this.$forceUpdate();
	}

	public update() {
		this.$forceUpdate();
	}

	public add() {
		ScenarioModule.addScenario();
	}

	// deleate(id: string) {
	// 	if (id) {
	// 		this.$modal.show("dialog", {
	// 			title: "削除してよろしいですか？",
	// 			text: "",
	// 			buttons: [
	// 				{
	// 					title: "はい",
	// 					handler: () => {
	// 						this.doDeleate(id);
	// 						this.$modal.hide("dialog");
	// 					}
	// 				},
	// 				{
	// 					title: "いいえ"
	// 				}
	// 			]
	// 		});
	// 	}
	// }
	// public async doDeleate(id: string) {
	// 	this.$modal.show("dialog", {
	// 		title: "削除中",
	// 		text: "削除しています"
	// 	});
	// 	await this.ajax.http({
	// 		url: `product/${PRODUCT_ID}/scenario/${id}`,
	// 		method: "DELETE",
	// 		data: {}
	// 	});
	// 	await UpdateServer.update();
	// 	await ScenarioModule.getScenario();
	// 	this.$modal.show("dialog", {
	// 		title: "削除完了",
	// 		text: "削除が完了しました",
	// 		buttons: [
	// 			{
	// 				title: "閉じる"
	// 			}
	// 		]
	// 	});
	// }
	get ScenarioList() {
		return ScenarioModule.scenarioList;
	}

	set ScenarioList(scenarioList) {
		ScenarioModule.setScenarioList(scenarioList);
	}

	private setScenario(scenario: any, e: Event) {
		eventHub.$emit('setCurrentScenario', scenario);
	}
}
</script>
<style type="sass">
.sl-vue-tree-title {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
<style type="sass" scoped>
@import '~sl-vue-tree/dist/sl-vue-tree-minimal.css';
/* .sl-vue-tree-node {
	margin-left: 20px;
	padding-left: 20px;
}
.sl-vue-tree {
	margin-left: 20px;
	padding-left: 20px;
} */
.addButton {
	right: 0px;
	display: block;
	float: right;
}
.sl-vue-tree-title {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.scenarioWrap {
	/* border: 1px #aaa solid; */
}
.contextmenu {
	position: fixed;
	background-color: white;
	color: black;
	border-radius: 2px;
	cursor: pointer;
}
.contextmenu > div {
	padding: 10px;
}
.contextmenu > div:hover {
	background-color: rgba(100, 100, 255, 0.5);
}
.last-event {
	color: white;
	background-color: rgba(100, 100, 255, 0.5);
	padding: 10px;
	border-radius: 2px;
}
.tree-container {
	flex-grow: 1;
}
.sl-vue-tree.sl-vue-tree-root {
	flex-grow: 1;
	overflow-x: hidden;
	overflow-y: auto;
	/* height: 300px; */
}
.json-preview {
	flex-grow: 1;
	margin-left: 10px;
	background-color: #13242d;
	border: 1px solid black;
	padding: 10px;
}
.item-icon {
	display: inline-block;
	text-align: left;
	width: 20px;
}
</style>
