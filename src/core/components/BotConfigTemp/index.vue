<template>
	<div class="botFlow">
		<div v-if="botFlow">
			<div>
				<div>条件</div>
				<h3>
					{{ botFlow.condition.type }}
					<b-form-group label>
						<b-form-radio-group :disabled="!isEdit" v-model="botFlow.condition.type" buttons button-variant="outline-primary">
							<b-form-radio name="some-radios" value="number">選択肢（数値）</b-form-radio>
							<b-form-radio name="some-radios" value="or">質問文</b-form-radio>
						</b-form-radio-group>
					</b-form-group>
					<b-form-input type="text" v-model="botFlow.condition.value" style="padding: 0" :disabled="!isEdit" />
				</h3>
				<div>回答</div>
				<div v-if="isEdit">
					<b-button v-if="!isTextEdit" v-on:click="isTextEdit = true">リッチテキスト編集</b-button>
					<b-button v-if="isTextEdit" v-on:click="isTextEdit = false">リッチテキスト編集を閉じる</b-button>
				</div>
				<div v-if="isTextEdit">
					<tinymce v-model="editValue" :height="300" :init="{ language: 'ja' }"></tinymce>
					<b-form-group class="text-center m-20">
						<b-button class="m-20" v-on:click="setEdit">反映</b-button>
					</b-form-group>
				</div>
				<div>
					<b-form-textarea class="botConfig__botConfigTemp__textarea" :disabled="!isEdit" rows="3" v-model="answer" v-on:keyup="createTitle"></b-form-textarea>
				</div>

				<div class="botFlow">選択肢</div>
				<div v-if="isEdit">
					<b-button v-on:click="getChoices">更新</b-button>
				</div>
				<b-list-group class="botFlow">
					<b-list-group-item v-for="(button, index) in buttons" v-bind:key="index">
						{{ button.condition }}&nbsp;&nbsp;
						<span>
							<b-form-input type="text" :disabled="!isEdit" v-model="button.text" v-on:keyup="createTitle" />
						</span>
					</b-list-group-item>
				</b-list-group>
				<div>
					<div v-if="Items">
						<b-form-group :label="LOG_LIST[key] || key" v-for="(logdatas, key) in Items" v-bind:key="key">
							<b-form-input :disabled="!isEdit" name="title" type="text" v-model="logdatas[i]" v-for="(logdata, i) of logdatas" v-bind:key="i" />
						</b-form-group>
					</div>
					<b-button v-on:click="addItems()" :disabled="!isEdit">ログ項目を追加する</b-button>
				</div>
				<div v-if="buttons.length == 0">なし</div>
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
import { v4 } from 'uuid';
import { BotConfigModule } from '@/store/modules/botConfig';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
import { BModal } from 'bootstrap-vue';
import { chown } from 'fs';
// @ts-ignore
@Component({
	components: { Tinymce },
})
export default class BotConfigTemp extends Vue {
	isTextEdit = false;
	editValue = '';

	@Prop()
	botFlow: OldScenario.BotConfigFlow | undefined;

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

	// step: { [id: string]: BotConfigStep };
	// is_open: boolean = false;
	// is_show: boolean = false;
	type: 'number' | 'or' = 'number';
	answer = '';
	tagButton = '';
	// open() {
	//   this.is_show = true;
	// }
	// close() {
	//   this.is_show = false;
	// }
	// toggleOpen() {
	//   this.is_open = !this.is_open;
	// }
	public setEdit() {
		if (this.answer) {
			this.answer = this.editValue;
		}
	}

	get Step() {
		if (this.botFlow) {
			return this.getStep(this.botFlow.step);
		}
		return {};
	}

	get Items() {
		return this.Step.items || {};
	}

	created() {
		// this.is_show = true;
		// this.isEdit = true;
		this.parseButton();
		this.createTitle();
		this.fixItems();
		console.log(this.botFlow);
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
		if (this.botFlow && 'step' in this.botFlow) {
			const stepName = this.botFlow.step;
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
		// console.log(testBotConfig);
		if ('scenario' in testBotConfig) {
			return testBotConfig.scenario.steps[stepName].action.success;
		}
		return { value: '', type: '', items: {} };
	}

	private getConditionText() {
		if (this.buttons && this.botFlow) {
			const currentButton = this.buttons.find((b: any) => {
				if (this.botFlow) {
					return b.condition == this.botFlow.condition.value;
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
		const tagButton = this.createButtonTag();
		if (this.botFlow) {
			this.botFlow.title = this.answer + tagButton;
			this.botFlow.value = this.answer;
			this.linkTitle(this.botFlow.step, this.answer + tagButton);
		}
		this.tagButton = tagButton;
		this.$forceUpdate();
	}

	private parseButton() {
		// console.log("parseButton");
		if (this.botFlow) {
			const title: any = String(this.botFlow.title);
			this.editValue = this.answer = title.replace(/<log-.+?:.+?>/g, '').replace(/<button:(\d+?)\.(.*?)>/g, '');
			this.buttons = [];
			if (title.length > 1) {
				const buttonMatchList = this.botFlow.title.replace(/<log-.+?:.+?>/g, '').match(/<button:(\d+?)\.(.*?)>/g);
				if (buttonMatchList) {
					for (const buttonMatch of buttonMatchList) {
						const afterReplace = buttonMatch.replace(/<log-.+?:.+?>/g, '');
						console.log(afterReplace);
						const buttonText = afterReplace.match(/<button:(\d+?)\.(.*?)>/);
						if (buttonText) {
							this.buttons.push({
								condition: buttonText[1],
								text: buttonText[2],
							});
						}
					}
				}
			}
		}
	}

	private createButtonTag() {
		let tagButton = '';
		if (this.buttons) {
			for (const button of this.buttons) {
				tagButton += `<button:${button.condition}.${button.text}>`;
			}
		}
		return tagButton;
	}

	getChoices() {
		if (this.botFlow) {
			for (const choice of this.botFlow.next) {
				const button = this.buttons.find(v => v.condition == choice.condition.value);
				if (button == undefined) {
					this.buttons.push({ condition: choice.condition.value, text: '' });
				}
			}

			for (let i = this.buttons.length - 1; i >= 0; i--) {
				const choice = this.botFlow.next.find(v => v.condition.value == this.buttons[i].condition);
				if (choice == undefined) {
					this.buttons.splice(i, 1);
				}
			}
		}
		this.createTitle();
	}

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
			BotConfigModule.dleateTestFlow(this.botFlow.step);
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
