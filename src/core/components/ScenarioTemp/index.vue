<template>
	<div class="scenario" v-if="flow && step">
		<div class v-show="is_show">
			<div>
				<b-form-group>
					<b-form-radio-group id="radio-group-2" v-model="step.type" name="radio-sub-component">
						<b-form-radio value="q">質問</b-form-radio>
						<b-form-radio value="a">回答</b-form-radio>
					</b-form-radio-group>
				</b-form-group>
			</div>
			<div>回答</div>
			<h2>
				<b-form-input type="text" v-on:keyup="linkTitle(step.title)" v-model="step.title" style="padding: 0" />
			</h2>
			<div>回答本文</div>
			<div>
				<b-form-textarea class="scenario__scenarioTemp__textarea" v-bind:class="{}" rows="3" v-model="step.text"></b-form-textarea>
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
// import { TalkScript } from "@/store/modules/talkscript";
import { v4 } from 'uuid';
import { ScenarioModule, Scenario, ScenarioFlow, ScenarioStep } from '@/store/modules/scenario';
import { BModal } from 'bootstrap-vue';
// @ts-ignore
@Component
export default class ScenarioTemp extends Vue {
	@Prop()
	scenario: ScenarioFlow | undefined;

	@Prop()
	flow: ScenarioFlow | undefined;

	@Prop()
	step: any | undefined;

	@Prop()
	parentstep: any | undefined;

	@Prop()
	sibling: Array<ScenarioFlow> | undefined;

	//   @Prop()
	//   parentstep: string | undefined;
	//   @Prop()
	//   sibling: Array<ScenarioFlow> | undefined;
	// step: { [id: string]: ScenarioStep };
	is_open = false;
	is_show = false;
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
		this.is_show = true;
		// this.currentStep = this.getStep();
		// if (this.scenario) {
		//   this.sibling = this.scenario.next;
		// }
	}

	getStep() {
		if (this.flow && this.step) {
			if (this.step[this.flow.step] != undefined) {
				console.log(this.flow.step);
				return this.step[this.flow.step];
			}
		}
		return { title: '', type: '' };
	}

	// syncroOption() {
	// 	if (this.parentstep && this.sibling) {
	// 		const step = ScenarioModule.getStep(this.parentstep);
	// 		if (step) {
	// 			step.options = this.sibling.map(o => Object.assign({}, o.condition));
	// 		}
	// 	}
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
						id="scenariopw"
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
									const pwinput: any = document.getElementById('scenariopw');
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
		const searchFunc = (list: Array<ScenarioFlow>, callback: Function) => {
			for (let i = 0; i < list.length; i++) {
				callback(list[i]);
				if (list[i].next && list[i].next.length > 0) {
					searchFunc(list[i].next, callback);
				}
			}
		};
		const idlist: any = [];
		if (!this.flow) {
			return;
		}
		searchFunc([this.flow], (step: any) => {
			idlist.push(step.step);
		});
		if (this.flow && this.step) {
			let removeFlg = false;
			searchFunc([this.flow], (step: any) => {
				if (step.next && step.next.length > 0) {
					step.next = step.next.filter((o: any) => this.scenario && o.step !== this.scenario.step);
				}
			});
			if (this.sibling) {
				this.sibling = this.sibling.filter((o: any) => this.scenario && o.step !== this.scenario.step);
			}

			for (let i = 0; i < idlist.length; i++) {
				if (idlist[i] in this.step) {
					delete this.step[idlist[i]];
					this.parentlinkOption(this.parentstep);
					// this.syncroOption();
					removeFlg = true;
				}
			}
			if (removeFlg) {
				ScenarioModule.saveScenario().then(o => {
					this.$modal.show('dialog', {
						text: '削除情報を保存しました',
					});
					UpdateServer.update();
				});
			}
		}
		// this.$rootScope.$applyAsync();
	}

	// addOption(step: string) {
	//   if (this.scenario) {
	//     const newId = v4();
	//     if (this.scenario.next == null) {
	//       this.scenario.next = [];
	//     }
	//     this.scenario.next.push({
	//       condition: {
	//         value: "新しいタイトル"
	//       },
	//       step: newId,
	//       next: []
	//     });
	//     this.linkOption(newId);
	//   }
	// }
	changeFlowConditionId: any = null;
	changeFlowCondition() {
		if (this.changeFlowConditionId !== null) {
			clearTimeout(this.changeFlowConditionId);
		}
		this.changeFlowConditionId = setTimeout(() => {
			if (this.flow && this.step) {
				this.linkOption(this.step);
			}
			if (this.parentstep) {
				this.parentlinkOption(this.parentstep);
			}
		}, 1000);
	}

	linkOption(step: string) {
		if (!this.flow && !this.step) {
			return;
		}
		// if (!this.parentstep) {
		//   this.step[step] = {
		//     id: step,
		//     type: "q",
		//     title: `新しいタイトル`,
		//     text: "",
		//     options: null
		//   };
		// }
		if (this.sibling) {
			this.parentstep.options = this.sibling.map(o => Object.assign({}, o.condition));
		}
	}

	parentlinkOption(parentstep: string) {
		if (!this.flow) {
			return;
		}
		// if (!this.step) {
		//   this.step[parentstep] = {
		//     id: parentstep,
		//     type: "q",
		//     title: "新しい",
		//     text: "",
		//     options: null
		//   };
		// }
		if (this.sibling) {
			this.parentstep.options = this.sibling.map(o => Object.assign({}, o.condition));
		}
	}

	linkTitleId: any = null;
	linkTitle(title: any) {
		if (this.linkTitleId !== null) {
			clearTimeout(this.linkTitleId);
		}
		this.linkTitleId = setTimeout(() => {
			this.doLinkTitle(title);
		}, 200);
	}

	doLinkTitle(title: any) {
		// if (!this.scenario.hasOwnProperty('condition')) {
		//     this.scenario.condition = { value: '' };
		// }
		if (this.flow && this.step) {
			this.flow.condition = { value: title || '' };
			console.info(this.flow.condition.value);
			this.changeFlowCondition();
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
.flow {
	margin-top: 15px;
}
.choices {
	display: inline-block;
}
</style>
