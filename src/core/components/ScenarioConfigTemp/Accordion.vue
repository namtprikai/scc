<template>
	<div class="accordion" v-bind:id="'sid' + step.id">
		<b-button class="d-flex align-items-center record" @click="setScenarioConfig" style="min-height: 50px">
			<span v-if="data.next && data.next.length > 0">
				<b-button class="icon" @click="expandDropdown">
					<span v-if="!isOpen">▶</span>
					<span v-if="isOpen">▼</span>
				</b-button>
			</span>
			<span class="non-icon" v-else></span>
			<span class="condition">
				<b>{{ step.title }}</b>
			</span>
			<b-button class="editbutton editbutton--remove" size="sm" @click="deleate()">-</b-button>
			<b-button class="editbutton editbutton--add" @click="addNext(stepid)" size="sm">＋</b-button>
		</b-button>

		<!-- Rendered After Click -->
		<div v-if="isOpen">
			<scenario-accordion
				v-for="(child, i) in children"
				:key="i"
				:value="child.condition.value"
				:data="child"
				:childlength="child.next ? child.next.length : 0"
				:scenario="scenario"
				:isroot="false"
			></scenario-accordion>
		</div>
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { eventHub } from '@/init/eventHub';
import ScenarioConfigParent from '@/views/botConfig/index';
// import SlVueTree from "sl-vue-tree";
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import ScenarioConfigTemp from '@/components/ScenarioConfigTemp/index.vue';
import { BCollapse } from 'bootstrap-vue';
// import ScenarioAccordion from "@/components/ScenarioConfigTemp/Accordion.vue";
import { UpdateServer } from '@/api/updateServer';
import { ScenarioModule, ScenarioFlow, ScenarioStep } from '@/store/modules/scenario';
import { FlowObj } from '../../utils/parts';
// @ts-ignore
@Component({
	name: 'scenarioaccordion',
	components: {
		BCollapse,
		ScenarioAccordion: () => import('@/components/ScenarioConfigTemp/Accordion.vue'),
	},
})
export default class Acc extends Vue {
	@Prop()
	name: any;

	@Prop()
	data: any;

	@Prop()
	value: any;

	@Prop()
	childlength: number | any;

	@Prop()
	scenario: any;

	@Prop()
	isroot: any;

	get children(): any {
		return this.data.next;
	}

	isOpen = false;
	// get childPaths(): any  {
	// 	return this.paths.slice(1);
	// }
	get step(): any {
		return this.scenario.step[this.data.step];
	}

	get stepid() {
		if (this.data) {
			return `${this.data.step}`;
		}
	}

	expandDropdown(e: any) {
		if (this.data.next.length > 0) {
			this.isOpen = !this.isOpen;
		}
	}

	async addNext(step: any) {
		const index = this.childlength + 1;
		this.isOpen = true;

		const { newStepId } = await ScenarioModule.addFlow({
			step,
			index,
			scenario: this.scenario,
		});
		console.log(newStepId);
		this.$scrollTo(`#sid${newStepId}`, 500, {
			container: '#ScenarioConfigList',
			easing: 'ease-in',
			offset: -60,
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

	setScenarioConfig(e: any) {
		eventHub.$emit('setCurrentScenarioData', {
			flow: this.data,
			step: this.scenario.step[this.data.step],
			scenario: this.scenario,
			// parentstep: this.scenario.step[this.parentstep.step],
			// sibling: this.sibling
		});
	}

	// doRemove(step: any) {
	// 	ScenarioModule.dleateTestFlow(step);
	// }
	deleate() {
		console.log(this.data);
		if (this.data.hasOwnProperty('step')) {
			this.$modal.show('dialog', {
				title: '削除してよろしいですか？',
				text: '',
				buttons: [
					{
						title: 'はい',
						handler: () => {
							if (this.isroot) {
								this.doDelate(this.scenario.id);
							} else {
								this.doDelateFlow(this.data.step);
							}

							this.$modal.hide('dialog');
						},
					},
					{
						title: 'いいえ',
					},
				],
			});
		}
	}

	async doDelateFlow(stepName: string) {
		const getScenarioCildStepList = (flow: FlowObj): Array<string> => {
			if (!flow.next || flow.next.length <= 0) {
				return [flow.step];
			}
			let ret: Array<string> = [];
			for (const cFlow of flow.next) {
				ret = ret.concat(getScenarioCildStepList(cFlow));
			}
			return ret;
		};
		const getFlowByStep = (step: string, flow: FlowObj, parentFlow?: FlowObj): Array<string> | undefined => {
			if (flow.step == step) {
				const stepList = getScenarioCildStepList(flow);
				if (parentFlow) {
					parentFlow.next = parentFlow.next.filter((_flow: FlowObj) => _flow.step !== step);
					console.log(parentFlow.next);
				}

				return stepList;
			} else {
				if (flow.next && flow.next.length > 0) {
					for (const cFlow of flow.next) {
						const ret = getFlowByStep(step, cFlow, flow);
						if (ret) {
							return ret;
						}
					}
				}
			}
		};
		this.$modal.show('dialog', {
			title: '削除中',
			text: '削除しています',
		});
		for (const flow of this.scenario.flow) {
			const stepList = getFlowByStep(stepName, flow);
			// if (stepList) {
			// 	for (const step in this.scenario.step) {
			// 		if (stepList.indexOf(step) !== -1) {
			// 		}
			// 	}
			// }Î
		}

		ScenarioModule.saveScenario(this.scenario);
		await UpdateServer.update();
		this.$modal.show('dialog', {
			title: '削除完了',
			text: '削除が完了しました',
			buttons: [
				{
					title: '閉じる',
				},
			],
		});
	}

	async doDelate(id: string) {
		this.$modal.show('dialog', {
			title: '削除中',
			text: '削除しています',
		});
		ScenarioModule.deleteScenario(id);
		await UpdateServer.update();
		this.$modal.show('dialog', {
			title: '削除完了',
			text: '削除が完了しました',
			buttons: [
				{
					title: '閉じる',
				},
			],
		});
	}
}
</script>
<style lang="scss">
.accordion {
	margin: 5px 0px 5px 15px;
	color: #000000 !important;
	h1,
	h2 {
		font-weight: normal;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		display: inline-block;
		margin: 0 10px;
	}
	a {
		color: #42b983;
	}
	.row {
		margin: 0 !important;
	}

	.editbutton {
		font-weight: bold !important;
		margin-left: auto;
		border: 1px #ffffff solid !important;
		margin-right: 3px;
		position: absolute;
		width: 30px;
		height: 30px;
		&--add {
			right: 8px;
		}
		&--remove {
			right: 44px;
		}
	}
	.record {
		width: 100%;
		border-radius: 1em;
		color: #ffffff !important;
		padding: 5px;
	}
	.btn:hover,
	button:hover {
		cursor: pointer;
	}
	.icon {
		color: #ffffff !important;
		font-weight: bold;
		margin-right: 5px;
	}
	.non-icon {
		width: 45px;
	}
	.add {
		font-weight: bold !important;
		margin-left: auto;
		border: 1px #ffffff solid !important;
	}
	.delete {
		font-weight: bold !important;
		margin-right: 2px;
		margin-left: 2px;
		border: 1px #ffffff solid !important;
	}
	.condition {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-right: 5px;
	}
}
</style>
