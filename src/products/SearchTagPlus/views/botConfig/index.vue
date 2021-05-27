<template>
	<div>
		<div v-if="BotConfigFlow && isSet">
			<!--<b-row v-if="isSet">
			<b-col lg="3" class="pb-2">-->
			<b-button class="button" v-on:click="save"><b-spinner small v-if="isSave"></b-spinner>保存</b-button>
			<!--</b-col>
			<b-col lg="3" class="pb-2">-->
			<!-- <b-button class="button" v-on:click="deleate">削除</b-button> -->
			<!--</b-col>
			</b-row>-->
		</div>
		<!--<h3>
      <b-form-input
        type="text"
        v-model="BotConfigFlow.condition.value"
        style="padding:0;"
        :disabled="!isEdit"
      />
      <b-form-textarea v-model="BotConfigFlow.title"></b-form-textarea>
		</h3>-->
		<div v-if="BotConfigFlow && isSet">
			<bot-config-temp :bot-flow="BotConfigFlow" :buttons="getButtons(BotConfigFlow.title)" :is-edit="isEdit" :key="BotConfigFlow.step"></bot-config-temp>
			<!-- <p><button v-on:click="addNext(BotConfigFlow.step,'number')" v-if="isEdit">+</button></p>
			<div v-if="isSet">
				{{BotConfigFlow.next}}
				<bot-config-temp
					:bot-flow="item"
					:step="BotConfigFlow.step"
					:parentstep="item.step"
					:sibling="BotConfigFlow.next"
					v-for="(item,index) in BotConfigFlow.next"
					:buttons="getButtons(BotConfigFlow.title)"
					:is-edit="isEdit"
					:key="index"
				></bot-config-temp>
			</div>-->
		</div>

		<!-- <div class="contextmenu" ref="contextmenu" v-show="contextMenuIsVisible">
			<div @click="removeNode">Remove</div>
		</div>-->
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import { UpdateServer } from '@/api/updateServer';
import { BotConfigModule } from '@/store/modules/botConfig';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
import BotConfigParent from '@/views/botConfig/index';
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';

import BotConfigTemp from '@/components/BotConfigTemp/index.vue';
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
		SlVueTree,
		BotConfigTemp,
	},
})
export default class BotConfigComp extends BotConfigParent {
	private isEdit = true;
	private getButtons(title: string) {
		const buttonMatchList = title.replace(/<log-.+?:.+?>/g, '').match(/<button:(\d+?)\.(.+?)>/g);
		const buttons = [];
		if (buttonMatchList) {
			for (const buttonMatch of buttonMatchList) {
				const buttonText = buttonMatch.replace(/<log-.+?:.+?>/g, '').match(/<button:(\d+?)\.(.+?)>/);
				if (buttonText) {
					buttons.push({ condition: buttonText[1], text: buttonText[2] });
				}
			}
		}
		return buttons;
	}

	public saveId: any = null;
	public save() {
		this.isSave = true;
		if (this.saveId !== null) {
			clearTimeout(this.saveId);
		}
		this.saveId = setTimeout(() => {
			this.doSave().then(r => {
				this.$modal.show('dialog', {
					title: '保存しました',
					text: '',
					buttons: [
						{
							title: '閉じる',
						},
					],
				});
				this.isSave = false;
				UpdateServer.update();
			});
		}, 1000);
	}

	// public addNext(step: string, type: "number" | "or") {
	// 	BotConfigModule.addTestFlow(step);
	// }
	public doSave() {
		// console.log(this.ajax);
		// return this.ajax.http({
		// 	url: `product/${PRODUCT_ID}/botConfig`,
		// 	method: "POST",
		// 	data: JSON.stringify(this.botConfig)
		// })
		return BotConfigModule.saveTestBotConfig();
	}

	public created() {
		// this.is_show = true;
	}
}
</script>
<style type="sass" lang="scss">
.sl-vue-tree-title {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.botConfig {
	width: 90%;
	margin: auto;

	&__botConfigTemp {
		&__ar {
			margin: auto;
		}

		&__textarea {
			resize: both;
			width: 100%;
		}

		&__list {
			position: relative;
			border: solid 1px #aaa;
			padding: 6px;
		}
	}

	&__next {
		padding-left: 10px;
	}
}

// .firest {
// 	.scenario__scenarioTemp__boder {
// 		&::after {
// 			z-index: 0;
// 			content: '';
// 			position: absolute;
// 			border-left: solid 1px #aaa;
// 			border-bottom: solid 1px #aaa;
// 			width: 30px;
// 			height: calc(50% + 12px);
// 			bottom: 50%;
// 			left: -30px;
// 		}
// 	}

// }
</style>
<style type="sass" lang="scss" scoped>
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
.button {
	margin: 5px;
}
</style>
