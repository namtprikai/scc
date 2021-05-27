<template>
	<div class="tab-body">
		<!-- <wrap-message v-if="isMessage" :message="message" /> -->

		<div v-if="Is_show">
			<!-- <div class="section">
				<b-card no-body>
					<b-card-header>データ種別</b-card-header>
					<b-card-body>
						<b-form-radio
							value="node"
							v-model="scriptData.data.type"
							name="some-radios"
							inline
							disabled
						>カテゴリ</b-form-radio>
						<b-form-radio
							value="leaf"
							v-model="scriptData.data.type"
							name="some-radios"
							inline
							disabled
						>スクリプト</b-form-radio>
					</b-card-body>
				</b-card>
			</div> -->
			<div class="section">
				<b-card no-body>
					<b-card-header>
						公開設定
						<b-icon icon="info-circle" id="popover-target-kokai"></b-icon>
						<b-popover target="popover-target-kokai" triggers="hover" placement="top">
							公開設定を「公開」にすると、Q&amp;Aがユーザー画面上で公開されます。
							<br />公開設定を「非公開」にすると、Q&amp;Aがユーザー画面上で非公開となり、
							<br />管理画面からしか閲覧できなくなります。
						</b-popover>
					</b-card-header>
					<b-card-body>
						<b-form-radio
							value="published"
							v-model="scriptData.data.status"
							name="status-radios"
							inline
							checked
							>公開</b-form-radio
						>
						<b-form-radio
							value="editing"
							v-model="scriptData.data.status"
							name="status-radios"
							inline
							>非公開</b-form-radio
						>
					</b-card-body>
				</b-card>
			</div>
			<div class="section">
				<b-card no-body>
					<b-card-header>
						<template slot:label v-if="DeepLevel == 1">親カテゴリ</template>
						<template slot:label v-if="DeepLevel == 2">子カテゴリ</template>
						<template slot:label v-if="DeepLevel == 3">Q.</template>
					</b-card-header>
					<b-card-body>
						<b-form-input
							id="textinput"
							name="title"
							type="text"
							v-model="scriptData.data.text"
						/>
					</b-card-body>
				</b-card>
			</div>
			<!-- <div v-if="isLog_script(scriptData.data)">
			<b-form-group :label="key" v-for="(logdatas,key) in scriptData.data.items" v-bind:key="key">
				<b-form-input name="title" type="text" v-model="logdatas[i]" v-for="(logdata,i) of logdatas" v-bind:key="i" />
			</b-form-group>
			</div>-->
			<div v-if="scriptData.isLeaf">
				<!-- <b-button v-if="!isEdit" v-on:click="isEdit=true">リッチテキスト編集</b-button>
				<b-button v-if="isEdit" v-on:click="isEdit=false">リッチテキスト編集を閉じる</b-button>-->
				<div class="section">
					<b-card no-body>
						<b-card-header>
							キーワード
							<b-icon icon="info-circle" id="popover-target-keyword"></b-icon>
							<b-popover
								target="popover-target-keyword"
								triggers="hover"
								placement="top"
							>
								キーワードとは、ユーザーの想定質問から重要単語を抽出したものです。
								<br />詳しくは担当者からお送りするマニュアルをご覧ください。
							</b-popover>
						</b-card-header>
						<b-card-body>
							<b-input-group
								v-for="(question, index) in scriptData.data.questions"
								:key="index"
								class="question"
							>
								<div class="input">
									<input-tag
										v-model="scriptData.data.questions[index]"
										:item-click="tagClick"
									></input-tag>
									<b-button v-on:click="removeQuestion(index)">-</b-button>
								</div>
							</b-input-group>
							<b-container class="bv-example-row mb-3">
								<b-row class="justify-content-md-center">
									<b-button
										block
										class="addButton"
										v-if="scriptData.isLeaf"
										@click="addQuestion"
										variant="secondary"
									>
										<b-icon icon="plus"></b-icon>
									</b-button>
								</b-row>
							</b-container>
						</b-card-body>
					</b-card>
				</div>
				<div class="section">
					<b-card no-body>
						<b-card-header>
							形式
							<b-icon id="keisiki" icon="info-circle" font-scale="1"></b-icon>
							<b-popover
								:target="`keisiki`"
								:placement="'left'"
								triggers="hover focus"
							>
								<template slot:content>
									続く内容が...
									<ul>
										<li>回答文の場合は「回答」</li>
										<li>選択肢の場合は「シナリオ」</li>
									</ul>
									を選んでください。
								</template>
							</b-popover>
						</b-card-header>
						<b-card-body>
							<b-form-group class="mb-0">
								<b-form-radio
									value="a"
									v-model="isItto"
									inline
									@click.native="changItto('a', $event)"
									>回答</b-form-radio
								>
								<b-form-radio
									value="b"
									v-model="isItto"
									inline
									@click.native="changItto('b', $event)"
									>シナリオ</b-form-radio
								>
							</b-form-group>
						</b-card-body>
					</b-card>
				</div>
				<div v-if="IsItto == 'a'" class="section">
					<div class="section">
						<b-card no-body>
							<b-card-header>A.</b-card-header>
							<b-card-body>
								<b-button @click="openImageModal" size="sm">画像挿入</b-button>
								<editor
									v-model="scenarioValue"
									:height="300"
									:id="Id"
									:init="{
										language: 'ja',
										menubar: false,
										plugins: plugins,
										toolbar: toolbar,
									}"
									@onChange="setScenarioEdit()"
								></editor>
							</b-card-body>
						</b-card>
					</div>
				</div>
				<div v-else>
					<div class="section">
						<b-card no-body>
							<b-card-header>選択肢への案内文</b-card-header>
							<b-card-body>
								<b-button @click="openImageModal" size="sm">画像挿入</b-button>
								<editor
									v-model="scenarioValue"
									:height="300"
									:id="Id"
									:init="{
										language: 'ja',
										menubar: false,
										plugins: plugins,
										toolbar: toolbar,
									}"
									@onChange="setScenarioEdit()"
								></editor>
							</b-card-body>
						</b-card>
					</div>
				</div>

				<!-- <b-form-group label="テキスト">
					<b-form-textarea id="textarea" name="text" type="text" rows="17" v-model="scriptData.data.value"></b-form-textarea>
				</b-form-group>-->
				<!-- <b-form-group label="シナリオID">
					<b-form-input
						id="textinput2"
						name="title"
						type="text"
						v-model="scriptData.data.scenario"
					/>
				</b-form-group>-->
				<!-- <b-form-group label="選択肢" v-if="currentBotData">
					<b-form-input
						name="title"
						type="text"
						v-model="scenario.label"
						v-for="(scenario,index) in currentBotData.next"
						:key="index"
					/>
<button @click="removeBotNext(scenario.id)">-</button>
<button @click="addBotNext()">+</button>
				</b-form-group>-->
			</div>
		</div>
		<b-modal ref="synonymModal" hide-footer no-close-on-backdrop scrollable>
			<synonym :synonymvalue="CurrentSynonym" />
		</b-modal>
	</div>
</template>
<style type="scss" lang="scss" scoped>
.question {
	position: relative;
	overflow: hidden;
	display: flex;
	.input {
		// float: left;
		display: flex;
		width: 100%;
	}
	.removeButton {
		display: flex;
		// float: right;
	}
	.vue-input-tag-wrapper {
		width: 100%;
	}
}
</style>

<script lang="ts">
import { v4 } from 'uuid';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import Tinymce from '@/components/Tinymce/index.vue';
import Plugins from '@/components/Tinymce/plugins';
import Toolbar from '@/components/Tinymce/toolbar';
import Editor from '@tinymce/tinymce-vue';
import InputTag from '@/components/InputTag/index.vue';
import Synonym from '@/components/Synonym/index.vue';
import EditWrap from '@/components/EditWrap/index.vue';
import { Ajax, Wait } from '@/utils/parts';
import _ from 'lodash';
import { bartUrl } from '@product/utils/configration';
import { BotConfigModule } from '@/store/modules/botConfig';
import { ScenarioModule } from '@/store/modules/scenario';
import WrapMessage from '@/components/WrapMessage/index.vue';
import { ScriptMatchingManager } from '@sciseed/kctools/qaRetrieval';
import { ScriptDataTree } from '@/utils/allInOneCsv/script';
import * as d3 from 'd3';
import { BotConfig2Module, BotConfigFlow, defaultBotFlow } from '../../store/modules/botConfig2';
// @ts-ignore
@Component({
	components: { Tinymce, InputTag, Synonym, EditWrap, WrapMessage, Editor },
})
export default class ScriptEditorComp extends Vue {
	protected isShow = true;
	protected isItto: 'a' | 'b' = 'a';
	protected currentSynonym = '';
	protected currentBotData: BotConfigFlow | {} = {};
	protected editValue = '';
	protected isEdit = false;
	protected toolbar = Toolbar;
	protected plugins = Plugins;
	protected message = '要編集リクエストが送られた当時のアイテムが存在しません。';

	protected isMessage = false;
	protected LOG_LIST = {
		log_scenario: 'シナリオログ',
		log_faq: 'FAQ番号',
		log_faq_parent_category: '親カテゴリ',
		log_faq_child_category: '子カテゴリ',
		log_faq_title: 'FAQタイトル',
	};

	protected LOG_LIST_ORDER_LIST = ['log_scenario', 'log_faq', 'log_faq_parent_category', 'log_faq_child_category', 'log_faq_title'];
	get Id(){
		if (this.scriptData?.data.items) {
			return this.scriptData.data.items.scenario_id;
		}
		return String(new Date().getTime());
	}
	public get ScenarioNext() {
		if ('id' in this.currentBotData) {
			return this.currentBotData.next;
		}
		return this.currentBotData;
	}

	public get DeepLevel() {
		if (this.scriptData?.data.parent === '#') {
			return 1;
		}
		if (this.scriptData?.data.type === 'leaf') {
			return 3;
		}
		return 2;
	}

	@Watch('scriptData.data.scenario')
	protected setScenarioIdItem(scenarioId: string) {
		if (this.scriptData?.data.items) {
			this.scriptData.data.items.scenario_id = scenarioId;
		}
	}

	public openImageModal() {
		eventHub.$emit('BoxModalOpen', 'MediaList');
	}

	public changItto(item: 'a' | 'b', event: any) {
		// event.preventDefault();
		const currentItem = this.isItto;

		console.log(event);
		if (item === 'a') {
			this.$modal.show('dialog', {
				// title: "ログ項目を追加する",
				text: `形式を「シナリオ」から「回答」に変更すると、選択肢と回答の内容が失われます。
本当に形式を変更しますか？`,
				buttons: [
					{
						title: '変更する',
						handler: () => {
							this.initItto();
							this.$modal.hide('dialog');
						},
					},
					{
						title: 'キャンセル',
						handler: () => {
							this.isItto = currentItem;
							this.$modal.hide('dialog');
						},
					},
				],
			});
		} else {
			this.initSentaku();
		}
	}

	clickNative(e: Event) {
		console.log(e);
		e.preventDefault();
	}

	public addBotNext() {
		if ('id' in this.currentBotData) {
			this.currentBotData.next.push(defaultBotFlow(v4(), '新規'));
		}
	}

	public removeBotNext(id: string) {
		if ('id' in this.currentBotData) {
			this.currentBotData.next = this.currentBotData.next.filter(b => b.id !== id);
		}
	}

	public async initItto() {
		if (this.scriptData) {
			eventHub.$emit('updateScript', this.scriptData.data.id);
		}
		if (this.scriptData?.data.type == 'leaf' && !this.scriptData.data.scenario) {
      this.scriptData.data.scenario = v4();
      if(this.scriptData?.data?.items){
        this.scriptData.data.items.scenario_id = this.scriptData.data.scenario;
      }
		}
		if (this.scriptData?.data.type == 'leaf' && this.scriptData.data.scenario && !('id' in this.currentBotData)) {
			await BotConfig2Module.addFlow2ID({
				step: 'init',
				scenarioId: this.scriptData.data.scenario,
				title: '新規1',
			});
			const botData = BotConfig2Module.BotConfig2;
			if ('flow' in botData) {
				for (const botFlow of botData.flow.next) {
					if (botFlow.id == this.scriptData.data.scenario) {
						this.currentBotData = botFlow;
						break;
					}
				}
			}
		}
		if ('id' in this.currentBotData) {
			this.currentBotData.next = [];
		}
	}

	private initSentakuId: any = null;
	public initSentaku() {
		if (this.initSentakuId !== null) {
			clearTimeout(this.initSentakuId);
		}
		this.initSentakuId = setTimeout(() => {
			this.doInitSentaku();
		}, 500);
	}

	public async doInitSentaku() {
		if (this.scriptData) {
			eventHub.$emit('updateScript', this.scriptData.data.id);
		}
		if (this.scriptData?.data.type == 'leaf' && !this.scriptData.data.items?.scenario_id) {
      this.scriptData.data.scenario = v4();
      if(this.scriptData?.data?.items){
        this.scriptData.data.items.scenario_id = this.scriptData.data.scenario;
      }
		}
		if (this.scriptData?.data.type == 'leaf' && (this.scriptData.data.scenario||this.scriptData.data.items?.scenario_id) && !('id' in this.currentBotData)) {
			await BotConfig2Module.addFlow2ID({
				step: 'init',
				scenarioId: this.scriptData.data.scenario||this.scriptData.data.items?.scenario_id,
				title: '新規1',
			});
			const botData = BotConfig2Module.BotConfig2;

			if ('flow' in botData) {
				for (const botFlow of botData.flow.next) {
					if (botFlow.id == this.scriptData.data.scenario||botFlow.id == this.scriptData.data.items?.scenario_id) {
						this.currentBotData = botFlow;
						break;
					}
				}
			}
		}
		const scriptId = this.scriptData?.data.id;
		if ('id' in this.currentBotData) {
			const step = this.currentBotData.id;
			await BotConfig2Module.addFlow2({
				step: step,
				index: 1,
				title: '選択肢1',
			});
			await BotConfig2Module.addFlow2({
				step: step,
				index: 2,
				title: '選択肢2',
			});
			const botConfig = BotConfig2Module.BotConfig2;
			if (step) {
				eventHub.$emit('addFlow', scriptId);
			}
			if ('flow' in botConfig) {
				for (const botFlow of botConfig.flow.next) {
					if (botFlow.id == this.scriptData?.data.scenario||botFlow.id == this.scriptData?.data.items?.scenario_id) {
						this.currentBotData = botFlow;

						break;
					}
				}
			}
		}
	}

	public get IsItto(): 'a' | 'b' {
		if ('id' in this.currentBotData && this.currentBotData?.next && this.currentBotData?.next.length > 0) {
			return 'b';
		}
		return 'a';
	}

	public get IsScenarioLink() {
		if (this.scriptData?.data.items) {
			if ('scenario_id' in this.scriptData.data.items) {
				const scenarioId = this.scriptData.data.items.scenario_id;

				const BotConfig = BotConfig2Module.BotConfig2;
				if ('flow' in BotConfig) {
					const BotFlowList = BotConfig.flow.next;
					if (BotFlowList) {
						for (const scenario of BotFlowList) {
							if (scenario.id == scenarioId) {
								console.log(scenarioId);
								return false;
							}
						}
					}
				}
			}
		}
		return true;
	}

	@Prop()
	public scriptData: ScriptDataTree | undefined;

	public scenarioValue = '';
	public get ScenarioValue() {
		return this.scenarioValue;
	}
	// @Watch('scriptData',{deep:true})
	// 	protected changeItem(item:ScriptDataTree|undefined) {

	// 		console.log("SetItem");
	// 		console.log(item);
	// 		//
	// 		if (item == undefined) {
	// 			this.isShow = false;
	// 			this.isMessage = true;
	// 			return;
	// 		}
	// 				eventHub.$emit('allInOneEditing');
	// 		this.$emit('editing');
	// 		if(this.scriptData){
	// 		this.scriptData.isEdited=true;
	// 		this.scriptData.isEditing=true;
	// 		}
	// 	}
	// @Watch('scriptData')
	protected async setItem(item: ScriptDataTree | undefined) {
		this.isShow = false;
		//
		// await Wait(10000);
		this.currentBotData = {};
		if (item == undefined) {
			this.isShow = false;
			this.isMessage = true;
			return;
		}
		eventHub.$emit('tynyReset');
		// this.editValue = item.data?.value?.replace(/\n/g, '<br>') || '';
    // alert(this.scenarioValue);
  const scenarioId = (item.data?.items?.scenario_id || item.data.scenario);
		if (scenarioId) {
			const BotConfig = BotConfig2Module.BotConfig2;
			if ('flow' in BotConfig) {
				let flg=false;
				for (const botItem of BotConfig.flow.next) {
					if (botItem.id == scenarioId) {
						this.currentBotData = botItem;
						if ('id' in this.currentBotData) {
							this.scenarioValue = this.currentBotData.text; // .replace(/\n/g, "<br>")||'';
						}
						flg=true;
						break;
					}
				}
				if (item.data.type === 'leaf' && flg==false) {
					this.initItto();
				}
			}
		} else if (item.data.type === 'leaf') {
			this.initItto();
		}

		if (!('status' in item.data)) {
			item.data.status = 'published';
		}
		if (!('items' in item.data)) {
			item.data.items = item.item || {};
		}
		if (item.data.items) {
			if (!('scenario_id' in item.data.items)) {
				item.data.items.scenario_id = '';
			}
			if (!('log_faq' in item.data.items)) {
				item.data.items.log_faq = [''];
			}
			this.isItto = this.IsItto;
			// this.$forceUpdate();
			// this.$forceUpdate();
			// await Wait(500);
			this.isShow = true;
			this.isMessage = false;
			// this.$forceUpdate();
			// alert(this.scenarioValue);
		}
	}

	public resetItem() {
		this.scriptData = undefined;
		this.editValue = '';
		this.scenarioValue = '';
		// alert("reset");
		this.currentBotData = {};
	}

	public setEdit() {
		if (this.scriptData && 'data' in this.scriptData) {
			this.scriptData.data.value = this.editValue;
			if (this.scriptData) {
				eventHub.$emit('updateScript', this.scriptData.data.id);
			}
		}
	}

	public async setScenarioEdit() {
		if (!(this.currentBotData && 'id' in this.currentBotData) && (this.scriptData?.data?.items?.scenario_id||this.scriptData?.data?.scenario)) {
			await this.initItto();
		}
		if (this.currentBotData && 'id' in this.currentBotData) {
			this.currentBotData.text = this.scenarioValue;
			if (this.scriptData) {
				eventHub.$emit('updateScript', this.scriptData.data.id);
			}
		}
	}

	get Items() {
		return this.scriptData?.data.items || {};
	}

	get ItemList() {
		const LOG_LIST_ORDER_LIST = this.LOG_LIST_ORDER_LIST;
		const retList = [];
		const items = Object.assign({}, this.Items);
		if (Object.keys(items).length <= 0) {
			return [];
		}
		for (const key of LOG_LIST_ORDER_LIST) {
			if (items.hasOwnProperty(key)) {
				retList.push(key);
				delete items[key];
			}
		}
		for (const key in items) {
			retList.push(key);
		}
		return retList;
	}

	addItems() {
		this.$modal.show('dialog', {
			title: 'ログ項目を追加する',
			text: `<div>
			<p>項目名:<input id="logItemKeyName" type="text" /></p>
			</div>`,
			buttons: [
				{
					title: '追加',
					handler: () => {
						const itemInput: any = document.getElementById('logItemKeyName');
						console.log(itemInput.value);
						if (itemInput.value && /^log_[a-z_]/.test(itemInput.value)) {
							const items = this.Items;
							items[itemInput.value] = [''];
							this.$forceUpdate();
						} else if (itemInput.value in this.Items) {
							this.$modal.show('すでにその項目名がついた項目が存在します');
						} else {
							this.$modal.show('項目名はlog_のあとに小文字アルファベットもしくはアンダーバーの形式のみ利用できます。');
						}
						// this.Items
						this.$modal.hide('dialog');
					},
				},
				{
					title: '中止',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
	}

	protected itemChangeId: any = null;
	get CurrentSynonym() {
		return this.currentSynonym;
	}

	@Watch('item', { deep: true })
	protected itemChange(item: any, oldItem: any) {
		if (item == null) {
			return;
		}
		this.isEdit = false;
		if (this.itemChangeId !== null) {
			clearTimeout(this.itemChangeId);
		}
		this.itemChangeId = setTimeout(() => {
			if (item.data && item.data.type === 'leaf') {
				item.isLeaf = true;
			} else {
				item.isLeaf = false;
			}
			this.editValue = String(item.data.value).replace(/\n/g, '<br>');
			this.$forceUpdate();
		}, 500);
	}

	public removeQuestion(index: number) {
		this.scriptData?.data?.questions?.splice(index, 1);
		this.$forceUpdate();
	}

	public addQuestion() {
		if (!this.scriptData?.data.questions) {
			let questions = this.scriptData?.data.questions;
			questions = [];
		}
		this.scriptData?.data?.questions?.push([]);
		this.$forceUpdate();
	}

	public tagClick(a: any, b: any) {
		// tslint:disable-next-line:no-string-literal
		this.currentSynonym = a;
		const modal: any = this.$refs.synonymModal;
		modal.show();
		// this.$modal.show(Synonym, { synonymvalue: a }, { draggable: true });
	}

	public isLog_script(data: any) {
		if ('items' in data && 'log_faq' in data.items) {
			return true;
		}
		return false;
	}

	get Is_show() {
		if (this.isShow && this.scriptData && this.scriptData.hasOwnProperty('data')) {
			return true;
		}
		return false;
	}

	public tabClick() {
		this.resetItem();
	}

	ajax: Ajax = new Ajax();
	isBartSearch = false;
	makeKeyword() {
		this.isBartSearch = true;
		this.ajax
			.http({
				method: 'POST',
				baseURL: bartUrl,
				url: '',
				data: { text: this.scriptData?.data.text || '' },
			})
			.then((data: any) => {
				console.log(data);
				const { tokens } = data;
				const questions: any = [];
				let keyWord = '';
				let nCount = 0;
				for (const token of tokens) {
					if (token.label === 1 || (token.label === 2 && nCount > 4)) {
						if (keyWord !== '') {
							questions.push(keyWord);
							nCount = 0;
							keyWord = '';
						}
						keyWord += token.surface;
					}
					if (token.label === 2) {
						nCount = 0;
						keyWord += token.surface;
					}
					if (token.label === 0) {
						nCount++;
					}
				}
				if (keyWord !== '') {
					questions.push(keyWord);
				}
				this.scriptData?.data?.questions?.push(questions);
				this.isBartSearch = false;
			})
			.catch(() => {
				this.isBartSearch = false;
			});
	}
	setImage(url:string){

		window.tinymce
		.activeEditor
		.insertContent(`<a href="${url}" target="_blank" style="width:100%;max-width:100%;height:auto;display:block;"><img style="width:90%;max-width:90%;height:auto;" src="${url}" /></a>`);
		// this.scenarioValue += `<a href="${url}" target="_blank" style="width:100%;max-width:100%;height:auto;display:block;"><img style="width:90%;max-width:90%;height:auto;" src="${url}" /></a>`;
		// this.setContent(_this.value+`<a href="${url}" target="_blank" style="width:100%;max-width:100%;height:auto;display:block;"><img style="width:90%;max-width:90%;height:auto;" src="${url}" /></a>`);
	}
	protected created() {
		// eventHub.$on('setScript', this.setItem);
		eventHub.$on('tyny_changeText', this.setEdit);
		eventHub.$on('tyny_changeText', this.setScenarioEdit);
		// eventHub.$on("tabclick", this.tabClick);
		eventHub.$on('selectImage', this.setImage);
	}

	protected destroyed() {
		// eventHub.$off('setScript', this.setItem);
		eventHub.$off('tyny_changeText', this.setEdit);
		eventHub.$off('tyny_changeText', this.setScenarioEdit);
		eventHub.$off('selectImage', this.setImage);
		// eventHub.$off("tabclick", this.tabClick);
	}

	public async mounted() {
		this.setItem(this.scriptData);
	}
}
</script>
