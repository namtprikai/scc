<template>
	<div class="botConfig__botConfigTemp">
		<div class="botConfig__botConfigTemp__boder" v-if="botFlow">
			<span class="border"></span>
			<div class v-show="!is_show">
				<h3>{{ botFlow.condition.value }}</h3>
				<p>{{ getConditionText() }}</p>
			</div>
			<div class v-show="is_show">
				<div>
					<button v-on:click="remove()">削除</button>
				</div>
				<!-- <div>
					<input type="radio" v-model="botFlow.condition.type" value="number">数値
					<input type="radio" v-model="botFlow.condition.type" value="or">部分一致
				</div>-->
				<div>条件</div>
				<h3>
					{{ botFlow.condition.type }}
					<b-form-group label="Individual radios">
						<b-form-radio-group v-model="botFlow.condition.type" buttons>
							<b-form-radio name="some-radios" value="number">数値</b-form-radio>
							<b-form-radio name="some-radios" value="or">部分一致</b-form-radio>
						</b-form-radio-group>
					</b-form-group>
					<input type="text" v-model="botFlow.condition.value" style="padding: 0" />
				</h3>
				<p>{{ getConditionText() }}</p>
				<div>回答</div>
				<p>{{ getStep(botFlow.step) }}</p>
				<div>
					<b-form-textarea class="botConfig__botConfigTemp__textarea" v-bind:class="{}" rows="3" v-model="botFlow.title" v-on:keyup="linkTitle(botFlow.step, botFlow.title)"></b-form-textarea>
				</div>
				<div>{{ botFlow.step }}</div>
			</div>
			<button v-on:click="open()" v-show="!is_show">編集する</button>
			<button v-on:click="close()" v-show="is_show">閉じる</button>
			<button v-on:click="addNext(botFlow.step, 'number')">+</button>
			<button class="botConfig__botConfigTemp__ar" v-if="botFlow.next && botFlow.next.length > 0" v-on:click="toggleOpen()">
				<span v-if="!is_open">↓</span>
				<span v-if="is_open">↑</span>
			</button>
			<p>分岐条件</p>

			<div v-if="is_open && botFlow.next && botFlow.next.length > 0">
				<div v-for="(item, index) in botFlow.next" class="botConfig__next" v-bind:key="index">
					<bot-config-temp :bot-flow="item" :parentstep="botFlow.step" :sibling="botFlow.next" :buttons="getButtons(botFlow.title)" v-bind:class="{ firest: index == 0 }"></bot-config-temp>
				</div>
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
import { v4 } from 'uuid';
import { BotConfigModule } from '@/store/modules/botConfig';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
import { BModal } from 'bootstrap-vue';
// @ts-ignore
@Component
export default class BotConfigTemp extends Vue {
	@Prop()
	botFlow: OldScenario.BotConfigFlow | undefined;

	@Prop()
	parentstep: string | undefined;

	// 兄弟要素
	@Prop()
	sibling: Array<OldScenario.BotConfigFlow> | undefined;

	@Prop()
	buttons: Array<{ condition: string; text: string }> | undefined;

	// step: { [id: string]: BotConfigStep };
	is_open = false;
	is_show = false;
	type: 'number' | 'or' = 'number';
	open() {
		this.is_show = true;
	}

	close() {
		this.is_show = false;
	}

	toggleOpen() {
		this.is_open = !this.is_open;
	}

	created() {
		console.log(this.botFlow);
	}

	getStep(step: string) {
		const botConfig = BotConfigModule.botConfig;
		console.log(botConfig);
		if ('scenario' in botConfig) {
			return botConfig.scenario.steps[step].action.success;
		}
		return { value: '', type: '' };
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
						id="botConfigpw"
						type="text"
					>
						<button @click="$emit('close')">Close</button>
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
									const pwinput: any = document.getElementById('botConfigpw');
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
		if (this.botFlow) {
			BotConfigModule.dleateTestFlow(this.botFlow.step);
		}
	}

	addNext(step: string, type: 'number' | 'or') {
		BotConfigModule.addTestFlow({ step, index: 1 });
	}

	changeFlowConditionId: any = null;
	changeFlowCondition() {
		if (this.changeFlowConditionId !== null) {
			clearTimeout(this.changeFlowConditionId);
		}

		this.changeFlowConditionId = setTimeout(() => {
			// this.linkOption(this.botFlow.step);
			if (this.parentstep) {
				// this.parentlinkOption(this.parentstep);
			}
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
</style>
