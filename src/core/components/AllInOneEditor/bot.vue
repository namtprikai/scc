<template>
	<div class="botFlow tab-body">
		<div v-if="botFlow">
			<div v-if="isShow">
				<div class="section">
					<b-card no-body>
						<b-card-header>Q.</b-card-header>
						<b-card-body>
							<b-form-input type="text" v-model="botFlow.label" style="padding: 0" :disabled="!isEdit" />
						</b-card-body>
					</b-card>
				</div>

				<div class="section">
					<b-card no-body>
						<b-card-header>
							形式
							<b-icon id="keisiki" icon="info-circle" font-scale="1"></b-icon>
							<b-popover :target="`keisiki`" :placement="'left'" triggers="hover focus">
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
								<b-form-radio value="a" v-model="isKaito" inline @click.native="changKaito('a', $event)">回答</b-form-radio>
								<b-form-radio value="b" v-model="isKaito" inline @click.native="changKaito('b', $event)">シナリオ</b-form-radio>
							</b-form-group>
						</b-card-body>
					</b-card>
					<!-- <b-card no-body>
						<b-card-header>
							選択肢
							<b-icon id="sentakusi" icon="info-circle" font-scale="1"></b-icon>
							<b-popover :target="`sentakusi`" :placement="'left'" triggers="hover focus">
								<template slot:content>
									表示する選択肢の名称を記載してください。
									<ul>
										<li>選択肢を増やしたい場合は「＋」、減らしたい場合は「－」を選んでください。</li>
										<li>選択肢は2つ以上設けることを推奨しますが、1つでも正常に動作します。</li>
									</ul>
								</template>
							</b-popover>
						</b-card-header>
						<b-card-body>
							<b-list-group class="botFlow">
								<b-list-group-item v-for="(next,index) in botFlow.next" v-bind:key="index">
									{{ next.id }}&nbsp;&nbsp;
									<span>
										<b-form-input type="text" :disabled="!isEdit" v-model="next.label" />
									</span>
								</b-list-group-item>
								<b-list-group-item v-if="botFlow.next.length==0">なし</b-list-group-item>
							</b-list-group>
						</b-card-body>
					</b-card>-->
				</div>
				<div class="section">
					<b-card no-body>
						<b-card-header>回答</b-card-header>
						<b-card-body>
							<b-button @click="openImageModal" size="sm">画像挿入</b-button>
							<editor
								v-model="editValue"
								:height="300"
								:id="Id"
								:init="{
									language: 'ja',
									menubar: false,
									plugins: plugins,
									toolbar: toolbar,
								}"
							></editor>
							<b-form-group class="text-center m-20">
								<!-- <b-button class="m-20" v-on:click="setEdit">反映</b-button> -->
							</b-form-group>
						</b-card-body>
					</b-card>
				</div>

				<!-- <div>
					<div v-if="Items">
						<b-form-group :label="LOG_LIST[key]||key" v-for="(logdatas,key) in Items" v-bind:key="key">
							<b-form-input
								:disabled="!isEdit"
								name="title"
								type="text"
								v-model="logdatas[i]"
								v-for="(logdata,i) of logdatas"
								v-bind:key="i"
							/>
						</b-form-group>
					</div>
					<b-button v-on:click="addItems()" :disabled="!isEdit">ログ項目を追加する</b-button>
				</div>-->
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { RouteRecord } from 'vue-router';
import pathToRegexp from 'path-to-regexp';
import { eventHub } from '@/init/eventHub';
import { UpdateServer } from '@/api/updateServer';
import { clearTimeout, setTimeout } from 'timers';
// import { TalkScript } from "@/store/modules/talkscript";
import Tinymce from '@/components/Tinymce/index.vue';
import Plugins from '@/components/Tinymce/plugins';
import Toolbar from '@/components/Tinymce/toolbar';
import Editor from '@tinymce/tinymce-vue';
import { Ajax, Wait } from '@/utils/parts';
import { v4 } from 'uuid';
import { BotConfigModule } from '@/store/modules/botConfig';
import { OldScenario, BotConfigFlow } from '@/utils/allInOneCsv/scenario';
import { BModal } from 'bootstrap-vue';
import { chown } from 'fs';
import { PRODUCT_ID } from '@product/utils/configration';
import { defaultBotFlow } from '../../store/modules/botConfig2';
// @ts-ignore
@Component({
	components: { Editor },
})
export default class BotConfigTemp extends Vue {
	protected toolbar = Toolbar;
	protected plugins = Plugins;
	isTextEdit = false;
	editValue = '';
	ajax: Ajax = new Ajax();
	protected isShow = true;
	@Prop()
	botFlow: BotConfigFlow | undefined;

	@Prop()
	attrbuttons: Array<{ condition: string; text: string }> | undefined;

	buttons: Array<{ condition: string; text: string }> = [];
	@Prop({ default: true })
	private isEdit: boolean | undefined;

	private LOG_LIST = {
		log_scenario: 'シナリオログ',
		log_faq: 'FAQ番号',
		log_faq_parent_category: '親カテゴリ',
		log_faq_child_category: '子カテゴリ',
		log_faq_title: 'FAQタイトル',
	};
	get Id(){
		if (this.botFlow?.id) {
			return this.botFlow.id;
		}
		return String(new Date().getTime());
	}
	// step: { [id: string]: BotConfigStep };
	// is_open: boolean = false;
	// is_show: boolean = false;
	type: 'number' | 'or' = 'number';
	answer = '';
	tagButton = '';
	public isKaito: 'a' | 'b' = 'a';
	public openImageModal() {
		eventHub.$emit('BoxModalOpen', 'MediaList');
	}

	public initKaito() {
		if (this.botFlow) {
			this.botFlow.next = [];
		}
	}

	public initSentaku() {
		if (this.botFlow) {
			this.botFlow.next = [];
			this.botFlow.next.push(defaultBotFlow(v4(), '新規'));
			this.botFlow.next.push(defaultBotFlow(v4(), '新規'));
		}
	}

	public changKaito(item: 'a' | 'b', event: any) {
		// event.preventDefault();
		const currentItem = this.isKaito;
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
							// this.isKaito = item;
							this.initKaito();

							this.$modal.hide('dialog');
						},
					},
					{
						title: 'キャンセル',
						handler: () => {
							this.isKaito = currentItem;
							this.$modal.hide('dialog');
						},
					},
				],
			});
		} else {
			// this.isKaito = item;
			this.initSentaku();
		}
	}

	// open() {
	//   this.is_show = true;
	// }
	// close() {
	//   this.is_show = false;
	// }
	// toggleOpen() {
	//   this.is_open = !this.is_open;
	// }
	// test(){
	// 			this.ajax
	// 		.http({
	// 			url: `/product/${PRODUCT_ID}`,
	// 			method: "GET"
	// 		})
	// 		.then(
	// 			(res: any) => {
	// 				debugger;
	// 				this.$modal.show("dialog", {
	// 					title: "成功",
	// 					text: "新しいパスワードのメールを送信しました",
	// 					buttons: [
	// 						{
	// 							title: "OK"
	// 						}
	// 					]
	// 				});
	// 			},
	// 			res => {
	// 				this.$modal.show("dialog", {
	// 					title: "エラーが発生しました",
	// 					text: "ユーザーのパスワードの再発行に失敗しました",
	// 					buttons: [
	// 						{
	// 							title: "OK"
	// 						}
	// 					]
	// 				});
	// 			}
	// 		);
	// }
	@Watch('editValue')
	public setEdit() {
		if (this.botFlow && this.isShow) {
			this.botFlow.text = this.editValue;
		}
	}

	get Items() {
		return this.botFlow?.items || {};
	}

	// @Watch("botFlow")
	async setItem(item: BotConfigFlow) {
		this.isShow = false;
		eventHub.$emit('tynyReset');
		// await Wait(100);
		this.editValue = item.text || '';

		if (this.botFlow) {
			this.isKaito = this.botFlow.next?.length > 0 ? 'b' : 'a';
		}
		this.isShow = true;
	}


	setImage(url:string){
		window.tinymce
		.activeEditor
		.insertContent(`<a href="${url}" target="_blank" style="width:100%;max-width:100%;height:auto;display:block;"><img style="width:90%;max-width:90%;height:auto;" src="${url}" /></a>`);
		// this.editValue += `<a href="${url}" target="_blank" style="width:100%;max-width:100%;height:auto;display:block;"><img style="width:90%;max-width:90%;height:auto;" src="${url}" /></a>`;
		// this.setContent(_this.value+`<a href="${url}" target="_blank" style="width:100%;max-width:100%;height:auto;display:block;"><img style="width:90%;max-width:90%;height:auto;" src="${url}" /></a>`);
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

	fixItems() {
		if (this.botFlow && 'id' in this.botFlow) {
			const stepName = this.botFlow.id;
			const testBotConfig: any = this.isEdit ? BotConfigModule.TestBotConfig : BotConfigModule.BotConfig;
			// console.log(testBotConfig);
			if ('scenario' in testBotConfig) {
				const success = testBotConfig.scenario.steps[stepName].action.success;
				if (!('items' in success)) {
					success.items = {};
				}
				for (const logKey in this.LOG_LIST) {
					if (!(logKey in success.items)) {
						success.items[logKey] = [''];
					}
				}
			}
		}
	}

	getStep(stepName: string) {
		const testBotConfig: any = this.isEdit ? BotConfigModule.TestBotConfig : BotConfigModule.BotConfig;
		if ('scenario' in testBotConfig) {
			return testBotConfig.scenario.steps[stepName].action.success;
		}
		return { value: '', type: '', items: {} };
	}

	private getConditionText() {
		if (this.buttons && this.botFlow) {
			const currentButton = this.buttons.find((b: any) => {
				if (this.botFlow) {
					return b.condition == this.botFlow.id;
				}
				return false;
			});
			if (currentButton) {
				return currentButton.text;
			}
		}
		return '';
	}

	// syncroOption() {
	// 	if (this.parentstep && this.sibling) {
	// 		const step = BotConfigModule.getStep(this.parentstep);
	// 		if (step) {
	// 			step.options = this.sibling.map(o => Object.assign({}, o.condition));
	// 		}
	// 	}
	// }
	private createTitle() {
		// const tagButton = this.createButtonTag();
		// if (this.botFlow) {
		// 	this.botFlow.title = this.answer + tagButton;
		// 	this.botFlow.value = this.answer;
		// 	this.linkTitle(this.botFlow.step, this.answer + tagButton);
		// }
		// this.tagButton = tagButton;
		// this.$forceUpdate();
	}

	private parseButton() {
		// console.log("parseButton");
		// if (this.botFlow) {
		// 	let title: any = String(this.botFlow.title);
		// 	this.editValue = this.answer = title
		// 		.replace(/<log-.+?:.+?>/g, "")
		// 		.replace(/<button:(\d+?)\.(.*?)>/g, "");
		// 	this.buttons = [];
		// 	if (title.length > 1) {
		// 		const buttonMatchList = this.botFlow.title
		// 			.replace(/<log-.+?:.+?>/g, "")
		// 			.match(/<button:(\d+?)\.(.*?)>/g);
		// 		if (buttonMatchList) {
		// 			for (const buttonMatch of buttonMatchList) {
		// 				const afterReplace = buttonMatch.replace(/<log-.+?:.+?>/g, "");
		// 				console.log(afterReplace);
		// 				const buttonText = afterReplace.match(/<button:(\d+?)\.(.*?)>/);
		// 				if (buttonText) {
		// 					this.buttons.push({
		// 						condition: buttonText[1],
		// 						text: buttonText[2]
		// 					});
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	}
	// private createButtonTag() {
	// 	let tagButton = "";
	// 	if (this.buttons)
	// 		for (const button of this.buttons) {
	// 			tagButton += `<button:${button.condition}.${button.text}>`;
	// 		}
	// 	return tagButton;
	// }
	// getChoices() {
	// 	if (this.botFlow) {
	// 		for (const choice of this.botFlow.next) {
	// 			const button = this.buttons.find(
	// 				v => v.condition == choice.condition.value
	// 			);
	// 			if (button == undefined) {
	// 				this.buttons.push({ condition: choice.condition.value, text: "" });
	// 			}
	// 		}

	// 		for (let i = this.buttons.length - 1; i >= 0; i--) {
	// 			const choice = this.botFlow.next.find(
	// 				v => v.condition.value == this.buttons[i].condition
	// 			);
	// 			if (choice == undefined) {
	// 				this.buttons.splice(i, 1);
	// 			}
	// 		}
	// 	}
	// 	this.createTitle();
	// }
	remove() {
		this.$modal.show('dialog', {
			title: '削除してよろしいでしょうか？',
			buttons: [
				{
					title: 'hai',
					handler: () => {
						this.$modal.hide('dialog');
						this.$modal.show(
							{
								template: `<div>
			<h1>This is created inline</h1>
						<input
						id="testBotConfigpw"
						type="text"
					>
						<button @click="$emit('close')">OK</button>
		</div>`,
								props: ['pw'],
							},
							{
								pw: '',
							},
							{
								height: 'auto',
							},
							{
								'before-close': (event: any) => {
									console.log('this will be called before the modal closes');
									const pwinput: any = document.getElementById('testBotConfigpw');
									if (pwinput.value === '123') {
										this.doRemove();
									} else {
										this.$modal.show('dialog', {
											title: '間違い',
											buttons: [
												{
													title: 'hai',
												},
											],
										});
									}
								},
							},
						);
					},
				},
			],
		});
		// 		this.$modal.show(
		// 	"パスワードを入力してください",
		// 	`<input type='text' id='password'>`,
		// 	() => {
		// 		if ($("#password").val() === "sciseed_HIS_Delete") {
		// 			this.modal.show(
		// 				"本当に削除してよろしいでしょうか？",
		// 				``,
		// 				() => {
		// 					this.doRemove();
		// 				},
		// 				() => {}
		// 			);
		// 		} else {
		// 			this.modal.open("パスワードが違います", ``, () => {}, () => {});
		// 		}
		// 	},
		// 	() => {}
		// );
	}

	// this.modal.openOk(`保存しました`, ``);
	doRemove() {
		console.log('doRewmove');
		if (this.botFlow) {
			BotConfigModule.dleateTestFlow(this.botFlow.id);
		}
	}

	// addNext(step: string, type: "number" | "or") {
	// 	BotConfigModule.addTestFlow(step);
	// 	// this.is_open = true;
	// }
	changeFlowConditionId: any = null;
	changeFlowCondition() {
		if (this.changeFlowConditionId !== null) {
			clearTimeout(this.changeFlowConditionId);
		}

		this.changeFlowConditionId = setTimeout(() => {
			// this.linkOption(this.botFlow.step);
			// if (this.parentstep) {
			// this.parentlinkOption(this.parentstep);
			// }
		}, 1000);
	}

	private linkTitleId: NodeJS.Timeout | null = null;
	private linkTitle(step: string, title: string) {
		if (this.linkTitleId !== null) {
			clearTimeout(this.linkTitleId);
		}
		this.linkTitleId = setTimeout(() => {
			this.doLinkTitle(step, title);
		}, 1500);
	}

	private doLinkTitle(_step: string, title: string) {
		const step = this.getStep(_step);
		step.value = title;
		this.$forceUpdate();
	}
	created() {
		this.isShow = true;
		// this.isEdit = true;
		// eventHub.$on('setBot', this.setItem);
		this.parseButton();
		this.createTitle();
		this.fixItems();
		console.log(this.botFlow);
		eventHub.$on('selectImage', this.setImage);
	}
	protected destroyed() {
		// eventHub.$off('setBot', this.setItem);
		// eventHub.$off("tabclick", this.tabClick);
		eventHub.$off('selectImage', this.setImage);
	}

	public async mounted() {
		if (this.botFlow) {
			this.setItem(this.botFlow);
		}
	}
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
	display: inline-block;
	font-size: 14px;
	line-height: 50px;
	margin-left: 10px;

	.no-redirect {
		color: #97a8be;
		cursor: text;
	}
}
.item {
	cursor: pointer;
}
.bold {
	font-weight: bold;
}
ul {
	padding-left: 1em;
	line-height: 1.5em;
	list-style-type: dot;
}
.flip-list-move {
	transition: transform 1s;
}
.botFlow {
	margin-top: 15px;
}
.choices {
	display: inline-block;
}
.active {
	background-color: #007bff !important;
	color: #fff !important;
}
</style>
