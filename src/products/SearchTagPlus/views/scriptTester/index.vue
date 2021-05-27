<template>
	<div>
		<b-row class="ml-0">
			<b-col lg="12" class="pb-2 ml-0">
				<b-form-file accept=".csv" v-model="file" :state="Boolean(file)" placeholder="csvアップロード" drop-placeholder="Drop file here..." browse-text="選択"></b-form-file>
			</b-col>
		</b-row>
		<b-row v-if="Boolean(file)" class="ml-0">
			<b-col lg="4" class="pb-2">
				<b-button v-on:click="submitScript()" v-if="file.name"> <b-spinner small v-if="listLoading"></b-spinner>実行 </b-button>
			</b-col>
			<b-col lg="4" class="pb-2"></b-col>
		</b-row>
		<b-form-radio-group id="btn-radios-2" v-model="currentShow" :options="options" buttons button-variant="outline-primary" size="sm" name="radio-btn-outline"></b-form-radio-group>
		<b-row>
			<b-col lg="6">
				<pieChart
					class="mx-auto my-2"
					v-if="evaluate.ng_list_top_one && chartShow"
					v-bind:data="data"
					width="500px"
					height="500px"
					:titleText="currentShow == 'one' ? '完全一致率' : '一致率'"
					valueUnit="件"
				/>
			</b-col>
		</b-row>
		<div v-if="getNglist().length > 0">
			<b-list-group v-for="(ngOb, index) in getNglist()" v-bind:key="index">
				<b-list-group-item lg="12" v-if="ngOb">
					<h4>Q : {{ ngOb.q }}</h4>
					<h5>A : {{ ngOb.a }}</h5>
					<h6></h6>
					<p v-for="(r, j) in ngOb.r" v-bind:key="j">
						<span>{{ r.text }}</span> |
						<span>{{ r.score }}</span>
					</p>
				</b-list-group-item>
			</b-list-group>
		</div>
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import Pie from '@/components/Charts/Pie.vue';
import ScenarioParent from '@/views/scenario/index';
import { Ajax } from '@/utils/parts';
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';

import ScenarioTemp from '@/components/ScenarioTemp/index.vue';
import { PRODUCT_ID, subsystemUrl, scriptUrl } from './../../utils/configration';
import BotcsvParent from '@/views/botcsv';
import { BotConfigModule } from '@/store/modules/botConfig';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
import EditWrap from '@/components/EditWrap/index.vue';
import ScriptTesterParent from '@/views/scriptTester';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	components: { PieChart: Pie },
})
export default class ScriptTester extends ScriptTesterParent {}
</script>
<style type="sass" lang="scss">
.sl-vue-tree-title {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.scenario {
	width: 90%;
	margin: auto;

	&__scenarioTemp {
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
