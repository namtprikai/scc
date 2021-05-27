<template>
	<div>
		<h2>シナリオデータ編集</h2>
		<div class="versionWindow">
			<loading :active.sync="isLoading" :can-cancel="false"></loading>
		</div>
		<div>
			<b-row>
				<b-col lg="6" class="pb-2">
					<!-- <b-button size="sm" v-on:click="autoTag()">ログタグ強制自動付与</b-button> -->
					<!-- <b-button v-on:click="save()">
						<b-spinner small v-if="isSave"></b-spinner>保存
					</b-button>-->
				</b-col>
				<b-col lg="6" class="pb-2 text-right">
					<b-button v-on:click="add()">追加</b-button>
				</b-col>
			</b-row>
			<!-- <div
				v-for="(ScenarioConfig,i) in ScenarioConfigList"
				:key="ScenarioConfig.step"
			>{{ScenarioConfig}}</div>-->
			<div v-for="(ScenarioConfig, i) in ScenarioConfigList" :key="i">
				<accordion
					v-for="(flow, j) in ScenarioConfig.flow"
					:key="j"
					:data="flow"
					:paths="['next', 'next']"
					:scenario="ScenarioConfig"
					v-bind:id="`a${i}`"
					:childlength="flow.next ? flow.next.length : 0"
					:isroot="true"
				></accordion>
			</div>
		</div>
		<wrap-message v-if="isUpload" :message="message" />
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import ScenarioConfigParent from '@/views/scenarioConfig/index';
// import SlVueTree from "sl-vue-tree";
import { UpdateServer } from '@/api/updateServer';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import BotConfigTemp from '@/components/BotConfigTemp/index.vue';
import { Scenario, ScenarioModule } from '@/store/modules/scenario';
import { TalkScript, TalkScriptModule } from '@/store/modules/talkScript';
import Accordion from '@/components/ScenarioConfigTemp/Accordion.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
import { AutoScenarioLogTag } from '@/utils/parts';
import WrapMessage from '@/components/WrapMessage/index.vue';
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
	},
})
export default class ScenarioConfigListComp extends Vue {
	private isLoading: boolean | null = null;
	private selected = null;
	private isSave = false;
	protected isUpload = false;
	message = 'アップロード中';

	// { listSize: deleteListSize, count: deleteCount++, message: "削除中" });
	scenarioUploadMessage({ listSize, count, message }: { listSize: number; count: number; message: string }) {
		this.message = `${message} ${count}/${listSize}  ${Math.floor((count / listSize) * 100)}%`;
	}

	public created() {
		this.fetchData();
		eventHub.$on('scenarioUploadMessage', this.scenarioUploadMessage);
	}

	protected destroyed() {
		eventHub.$off('scenarioUploadMessage', this.scenarioUploadMessage);
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
		return ScenarioModule.saveScenario();
	}

	private async fetchData() {
		// await BotConfigModule.getVersionList();
		await ScenarioModule.getScenario();
		this.$forceUpdate();
	}

	private async doAutoTag() {
		this.isUpload = true;
		await Promise.all([ScenarioModule.getScenario(), TalkScriptModule.getTalkScript()]);
		const TalkScript = TalkScriptModule.TalkScript;
		const ScenarioList = ScenarioModule.ScenarioList;
		if (TalkScript && ScenarioList) {
			const tagScenarioList = AutoScenarioLogTag({ TalkScript, ScenarioList });
			await ScenarioModule.saveScenarioList(tagScenarioList);
		}
		this.isUpload = false;
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

	public update() {
		this.$forceUpdate();
	}

	public async add() {
		const bid = await ScenarioModule.addScenario();

		this.$scrollTo(`#a${(ScenarioModule.ScenarioList || []).length - 1}`, 500, {
			container: '#ScenarioConfigList',
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
	// public setVueVersion(item) {
	//   BotConfigModule.setTestBotConfig({ version_id: item.VersionId });
	// }

	// get ScenarioConfig() {
	// 	try {
	// 		const botConfigList = ScenarioModule.ScenarioList;
	// 		return botConfigList;
	// 	} catch (e) {}
	// 	return [];
	// }

	get ScenarioConfigList() {
		const scenarioConfigList = ScenarioModule.ScenarioList;

		console.log(scenarioConfigList);
		try {
			// if ("scenario" in scenarioConfigList) {
			if (scenarioConfigList && 'scenarioId' in this.$route.query) {
				return scenarioConfigList.filter((scenario: any) => {
					return scenario.scenarioId == this.$route.query.scenarioId;
				});
			}

			// }
		} catch (e) {}
		if (scenarioConfigList) {
			return scenarioConfigList.sort((scenarioa, scenariob) => {
				if (parseInt(scenarioa.id) > parseInt(scenariob.id)) {
					return 1;
				}
				return -1;
			});
		}

		return [];
	}

	// get States() {
	//   return this.states;
	// }
	// set BotConfigList(botConfigList) {
	// 	BotConfigModule.setBotConfigList(botConfigList);
	// }
	private setScenarioConfig(ScenarioConfig: any, e: Event) {
		eventHub.$emit('setCurrentScenarioFlow', ScenarioConfig);
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
