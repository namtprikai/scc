<template>
	<div>
		<h2>ボットデータ編集</h2>
		<div class="versionWindow">
			<loading :active.sync="isLoading" :can-cancel="false"></loading>
			<b-form-select v-on:change="setVersion" v-model="selected">
				<option v-for="(item, index) in VersionList" v-bind:key="index" v-bind:value="item">
					<span>{{ item.assignee }}&nbsp;&nbsp;</span>
					<span>{{ item.LastModified | moment('MM/DD HH:mm') }}</span>
				</option>
			</b-form-select>
		</div>
		<wrap-sppiner v-if="isLoad" />
		<div>
			<b-row>
				<b-col lg="3" class="pb-2">
					<b-button v-on:click="save()"> <b-spinner small v-if="isSave"></b-spinner>保存 </b-button>
				</b-col>
				<!-- <b-col lg="3" class="pb-2">
					<b-button size="sm" v-on:click="autoTag()">
						<b-spinner small v-if="isLoading"></b-spinner>ログタグ強制自動付与
					</b-button>
				</b-col> -->
				<b-col lg="6" class="pb-2 text-right">
					<b-button v-on:click="add()">追加</b-button>
				</b-col>
			</b-row>
			<accordion v-for="(botConfig, i) in BotConfigList" :key="botConfig.step" :data="botConfig" :paths="['next', 'next']" :childlength="botConfig.next.length" v-bind:id="`a${i}`" />
		</div>
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
import { UpdateServer } from '@/api/updateServer';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import BotConfigTemp from '@/components/BotConfigTemp/index.vue';
import { BotConfigModule } from '@/store/modules/botConfig';
import Accordion from '@/components/BotConfigTemp/Accordion.vue';
import Loading from 'vue-loading-overlay';
import WrapMessage from '@/components/WrapMessage/index.vue';
import { AutoBotLogTag } from '@/utils/parts';
import { TalkScript, TalkScriptModule } from '@/store/modules/talkScript';
import WrapSppiner from '@/components/WrapSinner/index.vue';
import 'vue-loading-overlay/dist/vue-loading.css';
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
		WrapMessage,
		WrapSppiner,
	},
})
export default class BotConfigListComp extends Vue {
	private isLoading: boolean | null = true;
	private selected = null;
	private isLoad = false;
	private isSave = false;
	private talkScriptTitleList: { [name: string]: string } = {};
	public created() {
		this.fetchData();
		eventHub.$on('botCsvUploadStart', this.botupLoadStart);
		eventHub.$on('botCsvUploadDone', this.fetchData);
		// this.$forceUpdate();
	}

	protected destroyed() {
		eventHub.$off('botCsvUploadStart', this.botupLoadStart);
		eventHub.$off('botCsvUploadDone', this.fetchData);
	}

	botupLoadStart() {
		this.isLoad = true;
	}

	private async doAutoTag() {
		this.isLoading = true;
		await Promise.all([BotConfigModule.getBotConfig(), TalkScriptModule.getTalkScript()]);
		const TalkScript = TalkScriptModule.TalkScript;
		const BotConfig = BotConfigModule.TestBotConfig;
		console.log(BotConfig);
		if (TalkScript && BotConfig) {
			const tagBotConfig = AutoBotLogTag({ TalkScript, BotConfig });
			await BotConfigModule.setTestBotConfig({ scenario: tagBotConfig });
			await BotConfigModule.saveTestBotConfig();
		}
		this.isLoading = false;
	}

	public autoTag() {
		this.$modal.show('dialog', {
			title: 'ログタグ強制自動付与',
			text: '本当にログタグ強制自動付与を実行しますか？今まで手動で付与されたタグ情報は完全に削除されます。',
			buttons: [
				{
					title: '実行',
					handler: () => {
						// alert("jikkou");
						this.$modal.hide('dialog');
						this.$modal.show('dialog', {
							title: '本当にログがリセットされますがよろしいでしょうか？',
							text: '本当にログタグ強制自動付与を実行しますか？今まで手動で付与されたタグ情報は完全に削除されます。',
							buttons: [
								{
									title: '実行',
									handler: () => {
										// alert("jikkou");
										this.doAutoTag();
										this.$modal.hide('dialog');
									},
								},
								{
									title: 'キャンセル',
									handler: () => {
										this.$modal.hide('dialog');
									},
								},
							],
						});
					},
				},
				{
					title: 'キャンセル',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
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
				UpdateServer.update();
				this.isSave = false;
			});
		}, 1000);
	}

	public doSave() {
		// console.log(this.ajax);
		// return this.ajax.http({
		// 	url: `product/${PRODUCT_ID}/botConfig`,
		// 	method: "POST",
		// 	data: JSON.stringify(this.botConfig)
		// })
		return BotConfigModule.saveTestBotConfig();
	}

	private async fetchData() {
		// await BotConfigModule.getVersionList();
		await TalkScriptModule.getTalkScript();
		TalkScriptModule.TalkScript
			// .filter( (t:TalkScript) => t.type==="leaf")
			.forEach((t: TalkScript) => {
				if (t.scenario) {
					this.talkScriptTitleList[t.scenario] = t.text || '';
				}
			}, this);
		await BotConfigModule.getTestBotConfig();
		this.isLoading = false;
		this.isLoad = false;
		this.$forceUpdate();
	}

	public get VersionList() {
		const version = BotConfigModule.testVersionList;
		for (const item of version) {
			if (item.is_upload_to_server) {
				this.selected = item;
			}
		}
		// return BotConfigModule.testVersionList;
		return version;
	}

	public update() {
		this.$forceUpdate();
	}

	public async add() {
		const bid = await BotConfigModule.addTestBotConfig();

		this.$scrollTo(`#a${(this.BotConfigList || []).length - 1}`, 500, {
			container: '#BotConfigList',
			easing: 'ease-in',
			offset: 60,
			force: true,
			cancelable: true,
			onStart: element => {
				// scrolling started
			},
			onDone: element => {
				// scrolling is done
			},
			onCancel: () => {
				// scrolling has been interrupted
			},
			x: false,
			y: true,
		});
	}

	public async setVersion(e: any) {
		this.isLoading = true;
		await BotConfigModule.saveTestBotConfig({ version_id: e.VersionId });
		eventHub.$emit('setCurrentBotFlow', null);
		setTimeout(() => {
			this.isLoading = false;
		}, 1000);
	}

	// public setVueVersion(item) {
	//   BotConfigModule.setTestBotConfig({ version_id: item.VersionId });
	// }
	get CurrentVersionId() {
		return BotConfigModule.TestCurrentVersionId;
	}

	get BotConfig() {
		try {
			const botConfigList = BotConfigModule.TestBotConfig;
			return botConfigList;
		} catch (e) {}
		return [];
	}

	get BotConfigList() {
		try {
			const botConfigList = BotConfigModule.TestBotConfig;
			if ('scenario' in botConfigList) {
				if ('scenarioId' in this.$route.query) {
					return botConfigList.scenario.flow.root.next.filter((scenario: any) => {
						return scenario.condition.value == this.$route.query.scenarioId;
					});
					// .map( (flow:BotConfigFlow) => {
					// 	const talkscriptText = this.talkScriptTitleList[flow.condition.value];
					// 	return { ...flow, talkscriptText: talkscriptText || flow.condition.value };
					// },this);
				}
				console.log(botConfigList.scenario.flow.root.next);
				return botConfigList.scenario.flow.root.next;
				// .map( (flow:BotConfigFlow) => {
				// 	const talkscriptText = this.talkScriptTitleList[flow.condition.value];
				// 	return { ...flow, talkscriptText: talkscriptText || flow.condition.value };
				// },this);
			}
		} catch (e) {}
		return [];
	}

	// get States() {
	//   return this.states;
	// }
	// set BotConfigList(botConfigList) {
	// 	BotConfigModule.setBotConfigList(botConfigList);
	// }
	private setBotConfig(botConfig: any, e: Event) {
		eventHub.$emit('setCurrentBotFlow', botConfig);
	}

	get SelectVersion() {
		return this.selected;
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
	height: 40px;
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
