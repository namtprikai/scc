<template>
	<div class="tab-body">
		<h2>ボットデータ確認</h2>
		<div class="versionWindow">
			<loading :active.sync="isLoading" :can-cancel="false"></loading>
			<b-list-group>
				<b-list-group-item v-for="(item, index) in VersionList" :key="index" v-bind:class="{ active: CurrentVersionId == item.VersionId }" v-on:click="setVuewVersion(item)">
					<b-row>
						<b-col lg="4">
							<span>{{ item.assignee }}</span>
						</b-col>
						<b-col lg="4">
							<span>{{ new Date(item.LastModified) | moment('MM/DD HH:mm') }}</span>
						</b-col>
						<b-col lg="4">
							<b-button v-if="UpdateVersionId !== item.VersionId && CurrentVersionId == item.VersionId" v-on:click="setVersion(item)" class="mr-0 ml-auto">反映</b-button>
							<span v-if="UpdateVersionId == item.VersionId">反映中</span>
						</b-col>
					</b-row>
				</b-list-group-item>
			</b-list-group>
		</div>
		<b-row v-if="isBotdata" class="ml-0">
			<b-col lg="4" class="pb-2">
				<b-button v-on:click="download()">ダウンロード</b-button>
			</b-col>
			<b-col lg="4" class="pb-2"></b-col>
		</b-row>
		<!-- <el-table
			v-loading="listLoading"
			:data="BotConfigList"
			element-loading-text="Loading"
			border
			fit
			highlight-current-row
			@row-click="setBotConfig"
		>
			<el-table-column align="center" label="タイトル">
				<template slot-scope="scope">{{ scope.row.condition.value }}</template>
			</el-table-column>
		</el-table>-->
		<accordion v-for="botConfig in BotConfigList" :key="botConfig.step" :data="botConfig" :paths="['next', 'next']" />
		<!-- <div class="versionWindow">
			<b-list-group>
				<b-list-group-item
					v-for="(item,index) in VersionList"
					:key="index"
					v-bind:class="{active:CurrentVersionId==item.VersionId}"
				>
					<b-row>
						<b-col lg="4">
							<span>{{item.assignee}}</span>
						</b-col>
						<b-col lg="4">
							<span>{{new Date(item.LastModified)|moment('MM/DD HH:mm')}}</span>
						</b-col>
						<b-col lg="4">
							<b-button
								v-if="CurrentVersionId!==item.VersionId"
								v-on:click="setVersion(item)"
								class="mr-0 ml-auto"
							>反映</b-button>
							<span v-if="CurrentVersionId==item.VersionId">反映中</span>
						</b-col>
					</b-row>
				</b-list-group-item>
			</b-list-group>
		</div>-->
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import BotConfigParent from '@/views/talkscript/index';
// import SlVueTree from "sl-vue-tree";
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import BotConfigTemp from '@/components/BotConfigTemp/index.vue';
import { BotConfigModule } from '@/store/modules/botConfig';
import Accordion from '@/components/BotConfigTemp/Accordion.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { BotParseCsv } from '@/utils/botParseCsv';
import { PRODUCT_ID } from '../../utils/configration';
declare const window: any;
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
		Accordion,
		Loading,
	},
})
export default class BotConfigListComp extends Vue {
	private isLoading: boolean | null = null;

	public created() {
		this.fetchData();
	}

	public download() {
		const botconfig = BotConfigModule.BotConfig;
		const VersionId = BotConfigModule.CurrentVersionId;
		console.log(JSON.stringify(botconfig));
		const data = BotParseCsv.parse(botconfig);
		const bom: any = new Uint8Array([0xef, 0xbb, 0xbf]);
		const blob: any = new Blob([bom, data], { type: 'text/csv' });
		const url: any = (window.URL || window.webkitURL).createObjectURL(blob);
		const link: any = document.createElement('a');
		let dateString = '0000';
		for (const item of this.VersionList) {
			if (item.VersionId == VersionId) {
				dateString = this.$moment(item.LastModified).format('YYYYMMDD_HHmm');
				break;
			}
		}
		console.log(dateString);
		link.download = `${PRODUCT_ID}_scenario_${dateString}.csv`;
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	private async fetchData() {
		// await BotConfigModule.getVersionList();
		await BotConfigModule.getBotConfig();
		this.$forceUpdate();
	}

	public get VersionList() {
		return BotConfigModule.versionList;
	}

	public update() {
		this.$forceUpdate();
	}

	public async setVuewVersion(item: any) {
		this.isLoading = true;
		await BotConfigModule.getBotConfig(item);
		setTimeout(() => {
			this.isLoading = false;
		}, 15000);
	}

	public async setVersion(item: any) {
		this.isLoading = true;
		await BotConfigModule.saveBotConfig({ version_id: item.VersionId });
		// BotConfigModule.getBotConfig(item);
		setTimeout(() => {
			this.isLoading = false;
		}, 15000);
	}

	get UpdateVersionId() {
		return BotConfigModule.UpdateVersionId;
	}

	get CurrentVersionId() {
		return BotConfigModule.CurrentVersionId;
	}

	get BotConfigList() {
		try {
			const botConfigList = BotConfigModule.BotConfig;
			console.log(botConfigList);
			if ('scenario' in botConfigList) {
				return botConfigList.scenario.flow.root.next;
			}
		} catch (e) {}
		return [];
	}

	// set BotConfigList(botConfigList) {
	// 	BotConfigModule.setBotConfigList(botConfigList);
	// }
	private setBotConfig(botConfig: any, e: Event) {
		eventHub.$emit('setCurrentProdBotFlow', botConfig);
	}

	get isBotdata() {
		return BotConfigModule.BotConfig;
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
.versionWindow {
	height: 200px;
	overflow: auto;
	margin: auto;
	margin-top: 30px;
	margin-bottom: 30px;
}
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
