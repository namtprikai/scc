import Cookies from "js-cookie";
import {
	VuexModule,
	Module,
	Mutation,
	Action,
	getModule,
} from "vuex-module-decorators";
import store from "@/store";

import { Ajax, RequeuestWokersService } from "@/utils/parts";
import {
	CLIENT_ID,
	subsystemUrl,
	apiUrl,
} from "@consoletype/utils/configration";
import { v4 } from "uuid";
import { MessageList } from "@/api/messageList";
import axios from "axios";
import { eventHub } from "../../init/eventHub";

const ajax: Ajax = new Ajax();
export interface IScenarioState {
	ScenarioList: any;
	// TalkScriptTree:any;
}
export interface ScenarioFlow {
	step: string;
	condition?: { value: string };
	next: Array<ScenarioFlow>;
}
export interface ScenarioStep {
	id: string;
	type: string;
	items?: { [log: string]: Array<any> };
	title: string;
	text: string;
	options: Array<{ value: string }> | null;
}
export interface Scenario {
	id: string;
	title: string;
	step: any;
	flow: Array<ScenarioFlow>;
	value: string;
	scenario: Scenario;
	scenarioId: string;
}
function isArray(obj: any) {
	return Object.prototype.toString.call(obj) === "[object Array]";
}
function cleanFixScenario(scenario: Scenario) {
	if ("step" in scenario) {
		const { step } = scenario;
		for (const stepName in step) {
			const flowOb = getFlow(scenario.flow, stepName);
			if (flowOb) {
				step[stepName].parent_step = flowOb.parentStep;
			}
			try {
				if ("items" in step[stepName]) {
					for (const itemName in step[stepName].items) {
						const items = step[stepName].items;
						if (isArray(items[itemName])) {
							items[itemName] = items[itemName].filter(
								(o: any) => o != null && o != ""
							);
							if (items[itemName].length == 0) {
								delete items[itemName];
								continue;
							}
						}
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
	}
	return scenario;
}
function getFlow(
	flowList: Array<ScenarioFlow>,
	step: string,
	parentStep = "root"
): any {
	for (const flow of flowList) {
		if (flow.step === step) {
			return { flow, flowList, parentStep };
		}
		if (flow.next && flow.next.length > 0) {
			const ret = getFlow(flow.next, step, flow.step);
			if (ret) {
				return ret;
			}
		}
	}
	return false;
}
function defaultScenario(id: string) {
	const scenario = {
		id,
		title: "新しいシナリオ",
		value: "",
		scenarioId: id,
		step: {
			1: {
				id: "1",
				type: "q",
				scenarioId: id,
				title: "新しいステップ",
				text: "",
				options: [],
				items: {
					log_faq: [""],
					log_faq_child_category: [""],
					log_faq_parent_category: [""],
					log_faq_title: [""],
					log_scenario: [id],
				},
			},
		},
		flow: [
			{
				// condition:{value:``,type:},
				step: "1",
				next: [],
			},
		],
	};
	return scenario;
}
@Module({ dynamic: true, store, name: "scenario" })
class ScenarioStore extends VuexModule implements IScenarioState {
	public scenarioList: any = [];
	private currentScenarioId = "";
	@Mutation
	public INIT() {
		console.log("INIT");
	}

	get CurrentScenario() {
		for (let i = 0; i < this.scenarioList.length; i++) {
			if (this.scenarioList[i].id === this.currentScenarioId) {
				return this.scenarioList[i];
			}
		}
		return null;
	}

	// @Mutation
	// public SET_CURRENTMESSAGE(message: any) {
	// 	this.currentMessage = message;
	// }
	@Mutation
	private SET_CURRENT_SCENARIO(scenario: Scenario) {
		console.log("GET_SCENARIO");
		console.log(scenario);
		this.currentScenarioId = scenario.id;
	}

	@Mutation
	private SET_SCENARIOLIST(scenarioList: Array<Scenario>) {
		console.log("GET_SCENARIO");
		console.log(scenarioList);
		this.scenarioList = scenarioList.map((s: Scenario) => cleanFixScenario(s));
	}

	@Mutation
	private ADD_FLOW({
		step,
		index,
		scenario,
		newStepId = v4(),
	}: {
		step: string;
		index: number;
		scenario: Scenario;
		newStepId: string;
	}) {
		// const newStepId: any = v4();
		for (const _scenario of this.scenarioList) {
			if (scenario.id == _scenario.id) {
				const { flow, flowList } = getFlow(_scenario.flow, step);

				flow.next.push({
					condition: {
						type: "number",
						value: `${index}`,
					},
					step: newStepId,
					title: "新規",
					next: [],
				});
				_scenario.step[newStepId] = {
					id: newStepId,
					type: "q",
					title: "新規",
					items: {
						log_faq: [""],
						log_faq_child_category: [""],
						log_faq_parent_category: [""],
						log_faq_title: [""],
						log_scenario: [""],
					},
					options: [],
				};
				break;
			}
		}
		return newStepId;
	}

	@Action({
		commit: "ADD_FLOW",
	})
	addFlow({ step, index, scenario }: any) {
		console.log(step);
		const newStepId = v4();
		return { step, index, scenario, newStepId };
	}

	@Action({
		commit: "SET_SCENARIOLIST",
	})
	public async getScenario() {
		const data: any = await ajax.http({
			url: `product/${CLIENT_ID}/scenario?${Math.floor(Math.random() * 100)}`,
			method: "get",
		});
		return data;
	}

	get defaultScenario() {
		const maxScenarioId = this.maxScenarioId;
		const scenario = {
			id: maxScenarioId,
			title: "新しいシナリオ" + maxScenarioId,
			value: maxScenarioId,
			scenarioId: maxScenarioId,
			step: {
				1: {
					id: "1",
					type: "q",
					title: "新しいステップ",
					text: "",
					scenarioId: maxScenarioId,
					items: {
						log_faq: ["-"],
						log_faq_child_category: ["-"],
						log_faq_parent_category: ["-"],
						log_faq_title: ["-"],
						log_scenario: ["-"],
					},
					options: [],
				},
			},
			flow: [
				{
					step: "1",
					next: [],
				},
			],
		};
		return scenario;
	}

	get ScenarioList() {
		console.log(this.scenarioList);
		return this.scenarioList;
	}

	set ScenarioList(scenarioList: Scenario[] | undefined) {
		this.scenarioList = scenarioList;
	}

	// public getStep(step: string) {
	// 	if (this.scenario) {
	// 		return this.scenario.step[step];
	// 	}
	// 	return '';
	// }
	get maxScenarioId() {
		const scenarioList = this.ScenarioList || [];
		let maxId = 0;
		for (let i = 0; i < scenarioList.length; i++) {
			if (maxId < parseInt(scenarioList[i].id)) {
				maxId = parseInt(scenarioList[i].id);
			}
		}
		maxId += 1;
		return String(maxId);
	}

	@Action({
		commit: "SET_SCENARIOLIST",
	})
	public async addScenario() {
		if (this.scenarioList) {
			const newScenario = this.defaultScenario;
			// this.scenarioList.push(newScenario);
			await ajax.http({
				url: `product/${CLIENT_ID}/scenario`,
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				data: JSON.stringify(newScenario),
			});
			const scenarioList = await this.getScenario();
			return scenarioList;
		}
		// return [];
	}

	@Action({
		commit: "SET_SCENARIOLIST",
	})
	public async deleteScenario(id: string) {
		await axios.delete(`${apiUrl}/product/${CLIENT_ID}/scenario/${id}`, {
			baseURL: apiUrl,
			url: `product/${CLIENT_ID}/scenario/${id}`,
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
				"If-Modified-Since": "null",
				Authorization: `Bearer ${ajax.getToken()}`,
			},
		});
		let scenarioList = [];
		try {
			scenarioList = await this.getScenario();
		} catch (e) {
			console.log(e);
		}

		return scenarioList;

		// return [];
	}

	@Action({
		commit: "SET_SCENARIOLIST",
	})
	public async saveScenario(scenario?: Scenario | any) {
		const currentScenario = cleanFixScenario(
			Object.assign({}, scenario || this.CurrentScenario)
		);
		console.log(currentScenario);
		if (currentScenario) {
			await axios.delete(
				`${apiUrl}/product/${CLIENT_ID}/scenario/${currentScenario.id}`,
				{
					baseURL: apiUrl,
					url: `product/${CLIENT_ID}/scenario/${currentScenario.id}`,
					method: "DELETE",
					headers: {
						"Content-type": "application/json",
						"If-Modified-Since": "null",
						Authorization: `Bearer ${ajax.getToken()}`,
					},
				}
			);
			// this.scenarioList.push(newScenario);
			await axios.post(
				`${apiUrl}/product/${CLIENT_ID}/scenario`,
				JSON.stringify(currentScenario),
				{
					headers: {
						"Content-type": "application/json",
						"If-Modified-Since": "null",
						Authorization: `Bearer ${ajax.getToken()}`,
					},
				}
			);
			const scenarioList = await this.getScenario();
			return scenarioList;
		}
		// return [];
	}

	@Action({
		commit: "SET_SCENARIOLIST",
	})
	public async saveScenarioList(scenarioList: Scenario[]) {
		const worker = new RequeuestWokersService(new Ajax());
		worker.WokerSize = 10;
		const worker2 = new RequeuestWokersService(new Ajax());
		worker2.WokerSize = 10;
		let deletescenarioList = [];
		try {
			deletescenarioList = await this.getScenario();
		} catch (e) {
			console.log(e);
		}

		const deleteListSize = deletescenarioList.length;
		const listSize = scenarioList.length;
		let deleteCount = 0;
		let count = 0;
		for (const scenario of deletescenarioList) {
			worker.setQueue(
				{
					baseURL: apiUrl,
					url: `product/${CLIENT_ID}/scenario/${scenario.id}`,
					method: "DELETE",
					headers: {
						"Content-type": "application/json",
						"If-Modified-Since": "null",
						Authorization: `Bearer ${ajax.getToken()}`,
					},
				},
				() => {
					eventHub.$emit("scenarioUploadMessage", {
						listSize: deleteListSize,
						count: deleteCount++,
						message: "削除中",
					});
				},
				() => {},
				-1
			);
		}
		for (const scenario of scenarioList) {
			const currentScenario = cleanFixScenario(scenario);
			worker2.setQueue(
				{
					baseURL: apiUrl,
					url: `product/${CLIENT_ID}/scenario`,
					method: "POST",
					headers: {
						"Content-type": "application/json",
						"If-Modified-Since": "null",
						Authorization: `Bearer ${ajax.getToken()}`,
					},
					data: JSON.stringify(currentScenario),
				},
				() => {
					eventHub.$emit("scenarioUploadMessage", {
						listSize,
						count: count++,
						message: "アップロード中",
					});
				},
				() => {},
				2
			);
		}
		console.log("start");
		await worker.start();
		console.log("start2");
		await worker2.start();
		console.log("startdone");

		const afscenarioList: any = await this.getScenario();
		return afscenarioList;
	}

	@Action({
		commit: "SET_SCENARIOLIST",
	})
	public setScenarioList(scenarioList: any) {
		return scenarioList;
	}

	@Action({
		commit: "SET_CURRENT_SCENARIO",
	})
	public setCurrentScenario(scenario: any) {
		return scenario;
	}
}

export const ScenarioModule = getModule(ScenarioStore);
