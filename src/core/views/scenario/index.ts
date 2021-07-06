import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import { mapGetters } from "vuex";
import { UpdateServer } from "@/api/updateServer";
import { Ajax } from "@/utils/parts";
import { CLIENT_ID } from "@consoletype/utils/configration";
import { eventHub } from "@/init/eventHub";
import { v4 } from "uuid";
import { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import {
	Scenario,
	ScenarioModule,
	ScenarioFlow,
	ScenarioStep,
} from "@/store/modules/scenario";
import { leafSize } from "@/utils/scenarioParseCsv";
import axios from "axios";
import { watch } from "fs";
// @ts-ignore
@Component({
	components: {},
})
export default class ScenarioParent extends Vue {
	protected isSet = false;
	protected isSave = false;
	protected isEdit = false;
	protected editValue = "";
	protected contextMenuIsVisible = false;
	private LOG_LIST = {
		log_scenario: "シナリオログ",
		log_faq: "FAQ番号",
		log_faq_parent_category: "親カテゴリ",
		log_faq_child_category: "子カテゴリ",
		log_faq_title: "FAQタイトル",
	};

	protected scenario: Scenario | any = null;
	protected flow: ScenarioFlow | any = {};
	protected step: ScenarioStep | any = {};
	protected parentstep: ScenarioStep | any = {};
	protected sibling: ScenarioFlow[] | any = {};
	protected ajax: Ajax = new Ajax();
	protected created() {
		// this.fetchData();
		// eventHub.$on("setCurrentScenario", this.setScenario);
		eventHub.$on("setCurrentScenarioData", this.setScenarioData);
	}

	// @Watch('step.title')
	changeTitle(title: string) {
		console.log(title);
		// if () {
		// 	this.flow = { condition: { value: '' } };
		// }
		if (!("condition" in this.flow) || !("value" in this.flow.condition)) {
			Object.assign(this.flow, { condition: { value: "", type: "number" } });
			// this.flow.condition = { value: '' };
		}
		this.flow.condition.value = title;
	}

	// setScenario(scenario: Scenario) {
	// 	this.scenario = scenario;
	// 	ScenarioModule.setCurrentScenario(scenario);
	// 	this.isSet = true;
	// }
	@Watch("scenario.scenarioId")
	public changeScenarioId(scenarioId: string) {
		console.log(scenarioId);
		this.step.scenarioId = scenarioId;
	}

	public setDefaultItems() {
		for (const [key, item] of Object.entries(this.LOG_LIST)) {
			if (this.step.items && !(key in this.step.items)) {
				this.step.items[key] = [""];
			}
		}
	}

	public setScenarioData(data: {
		flow: ScenarioFlow;
		step: ScenarioStep;
		scenario: Scenario;
		parentstep: ScenarioStep;
		sibling: ScenarioStep[];
	}) {
		console.log(data);
		this.flow = data.flow;
		this.step = data.step;
		this.scenario = data.scenario;
		// this.parentstep = data.parentstep;
		// this.sibling = data.sibling;
		if (!("condition" in this.flow) || !("value" in this.flow.condition)) {
			Object.assign(this.flow, { condition: { value: "", type: "number" } });
			// this.flow.condition = { value: '' };
		}
		leafSize(this.flow);
		if ("text" in this.step) {
			this.editValue = this.step.text.replace(/\n/g, "<br>");
		}
		this.setDefaultItems();
		this.isSet = true;
	}

	public leafSize(flow: any) {
		return leafSize(flow);
	}

	protected destroyed() {
		// eventHub.$off("setCurrentScenario", this.setScenario);
		eventHub.$off("setCurrentScenarioData", this.setScenarioData);
	}

	// protected async fetchData() {
	// 	await ScenarioModule.getScenario();
	// 	this.scenario = ScenarioModule.Scenario;
	// }
	get Scenario() {
		return this.scenario;
	}

	get Flow() {
		return this.flow;
	}

	get Step() {
		return this.step;
	}

	get ParentStep() {
		return this.parentstep;
	}

	get Sibling() {
		return this.sibling;
	}

	public setEdit() {
		if ("text" in this.step) {
			this.step.text = this.editValue;
		}
	}

	saveId: any = null;
	save() {
		if (this.saveId !== null) {
			clearTimeout(this.saveId);
		}

		if (this.scenario) {
			this.$modal.show("dialog", {
				title: "保存してよろしいですか？",
				text: "",
				buttons: [
					{
						title: "はい",
						handler: () => {
							this.isSave = true;
							this.saveId = setTimeout(async () => {
								await this.doSave();
							}, 1000);
							this.$modal.hide("dialog");
						},
					},
					{
						title: "いいえ",
					},
				],
			});
		}
	}

	get Items() {
		return this.step.items || {};
	}

	addItems() {
		this.$modal.show("dialog", {
			title: "ログ項目を追加する",
			text: `<div>
			<p>項目名:<input id="logItemKeyName" type="text" /></p>
			</div>`,
			buttons: [
				{
					title: "追加",
					handler: () => {
						const itemInput: any = document.getElementById("logItemKeyName");
						console.log(itemInput.value);
						if (itemInput.value && /^log_[a-z_]/.test(itemInput.value)) {
							const items = this.Items;
							items[itemInput.value] = [""];
							this.$forceUpdate();
						} else if (itemInput.value in this.Items) {
							this.$modal.show("すでにその項目名がついた項目が存在します");
						} else {
							this.$modal.show(
								"項目名はlog_のあとに小文字アルファベットもしくはアンダーバーの形式のみ利用できます。"
							);
						}
						// this.Items
						this.$modal.hide("dialog");
					},
				},
				{
					title: "中止",
					handler: () => {
						this.$modal.hide("dialog");
					},
				},
			],
		});
	}

	async doSave() {
		await ScenarioModule.saveScenario(this.scenario);
		this.setDefaultItems();
		this.$modal.show("dialog", {
			title: "保存しました",
			text: "",
			buttons: [
				{
					title: "閉じる",
				},
			],
		});
		this.isSave = false;
		UpdateServer.update();

		// console.log(this.ajax);
		// return this.ajax.http({
		// 	url: `product/${CLIENT_ID}/scenario`,
		// 	method: "POST",
		// 	data: JSON.stringify(this.scenario)
		// });
	}

	reset() {
		this.scenario = {};
		this.flow = {};
		this.step = {};
		this.parentstep = {};
		this.sibling = {};
		this.isSet = false;
	}

	deleate() {
		if (this.scenario.hasOwnProperty("id")) {
			this.$modal.show("dialog", {
				title: "削除してよろしいですか？",
				text: "",
				buttons: [
					{
						title: "はい",
						handler: () => {
							this.doDelate(this.scenario.id);
							this.$modal.hide("dialog");
						},
					},
					{
						title: "いいえ",
					},
				],
			});
		}
	}

	async doDelate(id: string) {
		this.$modal.show("dialog", {
			title: "削除中",
			text: "削除しています",
		});
		await this.ajax.http({
			url: `product/${CLIENT_ID}/scenario/${id}`,
			method: "DELETE",
			data: {},
		});
		await UpdateServer.update();
		await ScenarioModule.getScenario();
		this.$modal.show("dialog", {
			title: "削除完了",
			text: "削除が完了しました",
			buttons: [
				{
					title: "閉じる",
				},
			],
		});
	}

	remove() {
		this.$modal.show("dialog", {
			title: "削除してよろしいでしょうか？",
			buttons: [
				{
					title: "hai",
					handler: () => {
						this.$modal.hide("dialog");
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
								props: ["pw"],
							},
							{
								pw: "",
							},
							{
								height: "auto",
							},
							{
								"before-close": (event: any) => {
									console.log("this will be called before the modal closes");
									const pwinput: any = document.getElementById("scenariopw");
									if (pwinput.value === "123") {
										this.doRemove();
										this.reset();
									} else {
										this.$modal.show("dialog", {
											title: "間違い",
											buttons: [
												{
													title: "hai",
												},
											],
										});
									}
								},
							}
						);
					},
				},
			],
		});
	}

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
		searchFunc([this.flow], (flow: any) => {
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
								_flow.next = _flow.next.filter(
									(o: ScenarioFlow) => o.step !== this.flow.step
								);
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
				this.sibling = this.sibling.filter(
					(o: any) => this.scenario && o.step !== this.flow.step
				);
				this.parentstep.options = this.sibling.map((o: any) =>
					Object.assign({}, o.condition)
				);
			}
			removeFlg = true;
			if (removeFlg) {
				ScenarioModule.saveScenario().then((o) => {
					this.$modal.show("dialog", {
						text: "削除情報を保存しました",
					});
					this.reset();
					UpdateServer.update();
				});
			}
		}
		// this.$rootScope.$applyAsync();
	}
}
