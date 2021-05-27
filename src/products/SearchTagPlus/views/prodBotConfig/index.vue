<template>
	<div class="tab-body">
		<div v-if="BotConfigFlow && isSet">
			<!--<h3>
				<b-form-textarea v-model="BotConfigFlow.title"></b-form-textarea>
			</h3>-->
			<div v-if="isSet">
				<!-- <bot-config-temp
					:bot-flow="item"
					:step="BotConfigFlow.step"
					:parentstep="item.step"
					:sibling="BotConfigFlow.next"
					v-for="(item,index) in BotConfigFlow.next"
					:buttons="getButtons(BotConfigFlow.title)"
					:is-edit="isEdit"
					:key="index"
				></bot-config-temp> -->
				<bot-config-temp :bot-flow="BotConfigFlow" :buttons="getButtons(BotConfigFlow.title)" :is-edit="isEdit" :key="BotConfigFlow.step"></bot-config-temp>
			</div>
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
import BotConfigParent from '@/views/botConfig/index';
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';

import BotConfigTemp from '@/components/BotConfigTemp/index.vue';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
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
	// setCurrentProdBotFlow
	private isEdit = false;
	protected created() {
		// this.fetchData();
		eventHub.$on('setCurrentProdBotFlow', this.setBotConfig);
	}

	protected setBotConfig(botConfigFlow: OldScenario.BotConfigFlow) {
		console.log(botConfigFlow);
		this.botConfigFlow = botConfigFlow;
		// BotConfigModule.setCurrentFlow(botConfigFlow);
		this.isSet = true;
	}

	protected destroyed() {
		eventHub.$off('setCurrentProdBotFlow', this.setBotConfig);
	}

	private getButtons(title: string) {
		const buttonMatchList = title.match(/<button:(\d+?)\.(.+?)>/g);
		const buttons = [];
		if (buttonMatchList) {
			for (const buttonMatch of buttonMatchList) {
				const buttonText = buttonMatch.match(/<button:(\d+?)\.(.+?)>/);
				if (buttonText) {
					buttons.push({ condition: buttonText[1], text: buttonText[2] });
				}
			}
		}
		return buttons;
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
		background-color: rgba(218, 134, 134, 0.356);
		border-left: 1px solid #aaa;
		padding-left: 30px;
		padding-top: 12px;
		padding-bottom: 12px;

		&__ar {
			margin: auto;
		}

		&__boder {
			position: relative;
			// border: 1px solid #aaa;
			// margin-top: 12px;
			margin-right: 6px;
			padding: 10px;
			background: #fff;
			box-shadow: #aaa 3px 3px 3px;
			// overflow: hidden;

			.border {
				z-index: 0;
				content: '';
				display: block;
				position: absolute;
				// border-left: solid 1px #aaa;
				border-bottom: solid 1px #aaa;
				width: 30px;
				height: 1px; //calc(150% + 12px);
				bottom: 50%;
				left: -30px;
			}
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
</style>
