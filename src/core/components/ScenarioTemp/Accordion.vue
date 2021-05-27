<template>
	<div class="accordion">
		<b-button class="d-flex align-items-center record" @click="setScenario">
			<span v-if="children.next && children.next.length > 0">
				<b-button size="sm" v-b-toggle="stepid" class="icon" @click="expandDropdown">▶︎</b-button>
			</span>
			<span class="non-icon" v-else></span>
			<span class="condition">
				{{ this.title }}
				<b v-if="this.title">{{ this.title }}</b>
				<b v-else>{{ this.data.condition.value }}</b>
			</span>
			<b-button v-if="isroot" class="editbutton editbutton--remove" size="sm" @click="deleateOption(step.id)">-</b-button>
			<b-button v-else class="editbutton editbutton--remove" size="sm" @click="removeOption(step)">-</b-button>
			<b-button class="editbutton editbutton--add" size="sm" @click="addOption(step)">＋</b-button>
		</b-button>

		<!-- Rendered After Click -->
		<b-collapse :id="stepid">
			<accordion v-for="child in children.next" :step="step" :key="child.step" :data="child" :parentstep="data" :sibling="data.next" :scenario="scenario" :title="scenario.title" :isroot="_isroot" />
		</b-collapse>
	</div>
</template>

<script lang="ts">
import { PRODUCT_ID } from '@product/utils/configration';
import { UpdateServer } from '@/api/updateServer';
import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import BotConfigParent from '@/views/botConfig/index';
// import SlVueTree from "sl-vue-tree";
import { Ajax } from '@/utils/parts';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import ScenarioTemp from '@/components/ScenarioTemp/index.vue';
import { Scenario, ScenarioModule, ScenarioFlow, ScenarioStep } from '@/store/modules/scenario';
import any from 'element-ui/lib/locale/lang/ja';
// @ts-ignore
@Component
export default class Accordion extends Vue {
	private ajax: Ajax = new Ajax();
	@Prop()
	private name: string | undefined;

	@Prop()
	private data: any | ScenarioFlow | undefined;

	@Prop()
	private title: string | undefined;

	@Prop()
	private step: any; // ScenarioStep | undefined;

	@Prop()
	private parentstep: any | ScenarioStep | undefined;

	@Prop()
	private sibling: any;

	@Prop()
	private scenario: any;

	@Prop()
	private isroot: boolean | undefined;

	get children(): any {
		return this.data;
	}

	// childPaths() {
	//   return this.paths.slice(1);
	// },
	get stepid() {
		if (this.data) {
			return `${this.data.step}`;
		}
	}

	removeOption(id: string) {
		if (id) {
			this.$modal.show('dialog', {
				title: '削除してよろしいですか？',
				text: '',
				buttons: [
					{
						title: 'はい',
						handler: () => {
							this.doRemove(id);
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

	doRemove(id: string) {
		console.log(this.scenario);
		console.log(this.data);
		const searchFunc = (list: Array<ScenarioFlow>, callback: Function) => {
			for (let i = 0; i < list.length; i++) {
				callback(list[i]);
				if (list[i].next && list[i].next.length > 0) {
					searchFunc(list[i].next, callback);
				}
			}
		};
		const idlist: any = [];
		if (!this.data) {
			return;
		}
		searchFunc([this.data], (flow: any) => {
			idlist.push(flow.step);
		});
		let removeFlg = false;
		if (this.scenario) {
			for (let i = 0; i < idlist.length; i++) {
				if (idlist[i] in this.scenario.step) {
					delete this.scenario.step[idlist[i]];
					// this.syncroOption();
				}
			}
			const deleateFlowStepList = (_flow: ScenarioFlow) => {
				if (_flow.next && _flow.next.length > 0) {
					for (const __flow of _flow.next) {
						for (let i = 0; i < idlist.length; i++) {
							if (__flow.step === idlist[i]) {
								_flow.next = _flow.next.filter((o: ScenarioFlow) => o.step !== this.data.step);
								break;
							} else {
								deleateFlowStepList(__flow);
							}
						}
					}
				}
			};
			for (const flow of this.scenario.flow) {
				deleateFlowStepList(flow);
			}

			if (this.sibling) {
				this.sibling = this.sibling.filter((o: any) => this.scenario && o.step !== this.data.step);
				this.parentstep.options = this.sibling.map((o: any) => Object.assign({}, o.condition));
			}
			removeFlg = true;
			if (removeFlg) {
				ScenarioModule.saveScenario().then(o => {
					this.$modal.show('dialog', {
						text: '削除情報を保存しました',
					});
					// this.reset();
					UpdateServer.update();
				});
			}
		}
	}

	// dereateOption() {
	// 	alert("dereate");
	// }
	deleateOption(id: string) {
		if (id) {
			this.$modal.show('dialog', {
				title: '削除してよろしいですか？',
				text: '',
				buttons: [
					{
						title: 'はい',
						handler: () => {
							this.doDeleate(id);
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

	public async doDeleate(id: string) {
		this.$modal.show('dialog', {
			title: '削除中',
			text: '削除しています',
		});
		await this.ajax.http({
			url: `product/${PRODUCT_ID}/scenario/${id}`,
			method: 'DELETE',
			data: {},
		});
		await UpdateServer.update();
		await ScenarioModule.getScenario();
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

	get _isroot() {
		return false;
	}

	expandDropdown(e: any) {
		if (this.children && this.children.next && this.children.next.length > 0) {
			e.target.innerText = e.target.innerText == '▶︎' ? '▼' : '▶︎';
		}
	}

	// addNext(step: any) {
	// 	ScenarioModule.addTestFlow(step);
	// }
	setScenario(e: any) {
		eventHub.$emit('setCurrentScenario', this.scenario);
		if (this.data && this.parentstep) {
			eventHub.$emit('setCurrentScenarioData', {
				flow: this.data,
				step: this.scenario.step[this.data.step],
				parentstep: this.scenario.step[this.parentstep.step],
				sibling: this.sibling,
				scenario: this.scenario,
			});
		}
	}

	addOption(step: any) {
		if (this.data) {
			const newId = v4();

			if (this.data.next == null) {
				this.data.next = [];
			}
			this.data.next.push({
				condition: {
					value: '新しいタイトル',
				},
				step: newId,
				next: [],
			});
			if (this.step && !this.step[newId]) {
				this.step[newId] = {
					id: newId,
					type: 'q',
					title: '新しいタイトル',
					text: '',
					options: [],
				};
				this.step[this.data.step].options.push({
					value: this.step[newId].title,
				});
			}
		}
	}
// doRemove(step) {
//   ScenarioModule.dleateTestFlow(step);
// }
}
</script>
<style lang="scss">
.accordion {
	margin: 5px 0px 5px 15px;
	color: #000000 !important;
	position: relative;
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
		width: 15px;
		margin-left: 30px;
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
		margin-right: 66px;
	}
}
</style>
