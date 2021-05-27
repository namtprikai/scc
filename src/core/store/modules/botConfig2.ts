import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { Ajax } from '@/utils/parts';
import { PRODUCT_ID, subsystemUrl, scriptUrl } from '@product/utils/configration';
import { v4 } from 'uuid';
import { MessageList } from '@/api/messageList';
import { UserModule } from './user';
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { UpdateServer } from '@/api/updateServer';
import type { BotConfig, BotConfigFlow } from '@/utils/allInOneCsv/scenario';
import { changeNewBotConfig } from '@/utils/allInOneCsv/makeCsv';
import { changeOldBotConfig, changeOldSearchConfig } from '@/utils/allInOneCsv/makeScript';
import { TalkScriptModule } from './talkScript';
const ajax: Ajax = new Ajax({});
function isDuplicateFlow(flowList: BotConfigFlow[], scenarioId: string): boolean | BotConfigFlow {
	for (const flow of flowList) {
		if (flow.id === scenarioId) {
			return flow;
		}
	}
	return false;
}
function isArray(obj: any) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}
export interface IBotConfigState {
	BotConfig: any;
}

export interface BotConfigStep {
	action: {
		success: { type: string; value: string; items: any };
		error: { type: string; value: string };
	};
}
export { BotConfig, BotConfigFlow };
interface BotConfigFlowData extends BotConfigFlow {
	isActive?: boolean;
	isEdited?: boolean;
	next: Array<BotConfigFlowData>;
	// isEditing: boolean;
}
interface BotConfigData extends BotConfig {
	flow: { step: 'init'; next: Array<BotConfigFlowData> };
}
function getFlow(flowList: Array<BotConfigFlow>, step: string): { flow: BotConfigFlow; flowList: Array<BotConfigFlow>; is: boolean } {
	for (const flow of flowList) {
		if (flow.id === step) {
			return { flow, flowList, is: true };
		}
		if (flow.next && flow.next.length > 0) {
			const ret = getFlow(flow.next, step);
			if (ret.is) {
				return ret;
			}
		}
	}
	return { flow: flowList[0], flowList, is: false };
}
export function getFlowById(flowList: Array<BotConfigFlow>, id: string, deep = 0): { flow: BotConfigFlow; flowList: Array<BotConfigFlow>; is: boolean; deep: number; } {
	for (const flow of flowList) {
		if (flow.id === id) {
			return { flow, flowList, is: true, deep };
		}
		if (flow.next && flow.next.length > 0) {
			const ret = getFlowById(flow.next, id, deep + 1);

			if (ret.is) {
				return ret;
			}
		}
	}

	return { flow: flowList[0], flowList, is: false, deep };
}
export function getFlowByTitle(flowList: Array<BotConfigFlow>, title: string, deep = 0): { flow: BotConfigFlow; flowList: Array<BotConfigFlow>; is: boolean; deep: number; } {
	for (const flow of flowList) {
		if (flow.label === title) {
			return { flow, flowList, is: true, deep };
		}
		if (flow.next && flow.next.length > 0) {
			const ret = getFlowByTitle(flow.next, title, deep + 1);
			if (ret.is) {
				return ret;
			}
		}
	}
	return { flow: flowList[0], flowList, is: false, deep };
}
export function getFlowByLinkScriptId(
	flowList: Array<BotConfigFlow>,
	scriptId: string,
	deep = 0,
): {
	flow: BotConfigFlow;
	flowList: Array<BotConfigFlow>;
	is: boolean;
	deep: number;
} {
	for (const flow of flowList) {
		// is_category: true,link_script_id
		if (flow.items.is_category && flow.items.link_script_id === scriptId) {
			return { flow, flowList, is: true, deep };
		}
		if (flow.next && flow.next.length > 0) {
			const ret = getFlowByLinkScriptId(flow.next, scriptId, deep + 1);
			if (ret.is) {
				return ret;
			}
		}
	}
	return { flow: flowList[0], flowList, is: false, deep };
}
function cleanFixBotConfig(botConfig: BotConfigData | {}): any {
	if ('title' in botConfig) {
		const { flow } = botConfig;
		crorer(flow.next, _flow => {
			delete _flow.isEdited;
			delete _flow.isActive;
			if ('items' in _flow) {
				for (const itemName in _flow.items) {
					const items = _flow.items;
					const item = items[itemName];
					if (Array.isArray(item)) {
						items[itemName] = item.filter((o: any) => o != null && o != '');
						if (item.length == 0) {
							delete items[itemName];
							continue;
						}
					}
				}
			}
		});
		function crorer(flowList: Array<BotConfigFlowData>, fn: (flow: BotConfigFlowData) => void) {
			for (const _flow of flowList) {
				fn(_flow);
				if (_flow.next && _flow.next.length > 0) {
					crorer(_flow.next, fn);
				}
			}
		}
	}
	return botConfig;
}
function defaultBotConfig(id: string): BotConfig {
	const botConfig: BotConfig = {
		title: '新しいシナリオ',
		flow: { step: 'init', next: [] },
		description: '',
	};
	return botConfig;
}
export function defaultBotFlow(step: string, title: string): BotConfigFlow {
	const botConfig: BotConfigFlow = {
		label: title,
		id: step,
		// condition: { value: condition, type: "id" },
		// action:{value:"",type:"text",items:{}},
		text: '',
		items: { update_date: `${new Date().getTime()}` },
		next: [],
	};
	return botConfig;
}

@Module({ dynamic: true, store, name: 'botConfig2' })
class BotConfig2Store extends VuexModule {
	public botConfig2: BotConfig | {} = {};

	@Mutation
	private SET_BOTCONFIG2(botConfig: BotConfig) {
		this.botConfig2 = botConfig;
		console.log(botConfig);
	}

	@Mutation
	private ADD_FLOW_ID2({ step, scenarioId, newStepId = v4(), title = '新規' }: { step: string; scenarioId: string; newStepId: string; title: string }) {
		if (!('title' in this.botConfig2)) {
			Object.assign(this.botConfig2, defaultBotConfig(step));
		}
		let next = [];
		const newFlow = {
			id: `${scenarioId}`,
			text: title,
			items: {},

			label: title,
			next: [],
		};
		if ('title' in this.botConfig2) {
			if (step === 'init') {
				next = this.botConfig2.flow.next;
			} else {
				const { flow, flowList, is } = getFlow(this.botConfig2.flow.next, step);
				next = flow.next;
			}
			const duplicateFlow = isDuplicateFlow(this.botConfig2.flow.next, scenarioId);
			if (duplicateFlow) {
				Object.assign(duplicateFlow || {}, newFlow);
			} else {
				next.push(newFlow );
			}
		}
	}

	@Mutation
	private REMOVE_FLOW2({ step, id }: { step: string; id: string }) {
		if (!this.botConfig2) {
			return;
		}
		if ('title' in this.botConfig2) {
			const { flow, flowList, is } = getFlow(this.botConfig2.flow.next, step);
			if (step === 'init') {
				this.botConfig2.flow.next = this.botConfig2.flow.next.filter(d => d.id !== id);
			} else {
				flow.next = flow.next.filter(d => d.id !== id);
			}
		}
	}

	@Mutation
	private REMOVE_FLOW_BY_SCRIPTID({ LinkScriptId }: { LinkScriptId: string }) {
		if (!this.botConfig2) {
			return;
		}
		if ('title' in this.botConfig2) {
			let { flow, flowList, is } = getFlowByLinkScriptId(this.botConfig2.flow.next, LinkScriptId);
			if (is) {
				flowList = flowList.filter(d => !(d.items.is_category && flow.items.link_script_id === LinkScriptId));
			}
		}
	}

	@Mutation
	private ADD_FLOW2({ step, index, newStepId = v4(), title = '新規' }: { step: string; index: number; newStepId: string; title: string }) {
		if (!this.botConfig2) {
			this.botConfig2 = defaultBotConfig(step);
		}
		const newFlow = {
			id: newStepId,
			label: title,
			text: title,
			items: {},
			next: [],
		};
		let next = [];
		if ('title' in this.botConfig2) {
			if (step === 'init') {
				next = this.botConfig2.flow.next;
			} else {
				const { flow, flowList, is } = getFlow(this.botConfig2.flow.next, step);
				next = flow.next;
			}
			const duplicateFlow = isDuplicateFlow(this.botConfig2.flow.next, newStepId);
			if (duplicateFlow) {
				Object.assign(duplicateFlow || {}, newFlow);
			} else {
				next.push(newFlow);
			}
		}
	}

	get UniqueCondition() {
		// const botConfig = this.BotConfig2;

		return v4();
	}
	@Action({
		commit: 'SET_BOTCONFIG2',
	})
	public async getConfig2(type: "bot" | "search" | "tag") {
		// 		// if(!BotConfigModule.BotConfig){
		// 			await BotConfigModule.getBotConfig();
		// 		// }

		// 		let oldBotConfig:any = BotConfigModule.BotConfig;
		//
		// 		// if(oldBotConfig.hasOwnProperty("scenario")){
		// 			oldBotConfig=changeNewBotConfig(oldBotConfig);

		// 			return oldBotConfig;
		// 		// }
		try {
			const data: any = await ajax.http({
				baseURL: `${scriptUrl}`,
				url: 'scenario_data/',
				method: 'get',
				params: {
					product_id: PRODUCT_ID,
					version: '2',
					type: type == 'bot' ? type : 'search'
				},
			});
			console.log(data);

			return data;
		} catch (e) {
			console.error(e);
		}
		return {};
	}
	@Action({
		commit: 'SET_BOTCONFIG2',
	})
	public async getBotConfig2() {
		// 		// if(!BotConfigModule.BotConfig){
		// 			await BotConfigModule.getBotConfig();
		// 		// }

		// 		let oldBotConfig:any = BotConfigModule.BotConfig;
		//
		// 		// if(oldBotConfig.hasOwnProperty("scenario")){
		// 			oldBotConfig=changeNewBotConfig(oldBotConfig);

		// 			return oldBotConfig;
		// 		// }
		try {
			const data: any = await ajax.http({
				baseURL: `${scriptUrl}`,
				url: 'scenario_data/',
				method: 'get',
				params: {
					product_id: PRODUCT_ID,
					version: '2',
					type: 'bot',
				},
			});
			console.log(data);

			return data;
		} catch (e) {
			console.error(e);
		}
		return {};
	}

	public async uploadChatConfig2() {
		const data: any = await ajax.http({
			baseURL: `${scriptUrl}`,
			url: 'scenario_data',
			method: 'post',
			data: {
				product_id: PRODUCT_ID,
				file: cleanFixBotConfig(this.botConfig2),
				version: '2',
				type: 'bot',
			},
		});
	}
	public async uploadTagConfig2() {
		const data: any = await ajax.http({
			baseURL: `${scriptUrl}`,
			url: 'scenario_data',
			method: 'post',
			data: {
				product_id: PRODUCT_ID,
				file: cleanFixBotConfig(this.botConfig2),
				version: '2',
				type: 'search',
			},
		});
	}
	get BotConfig2() {
		return this.botConfig2;
	}
	get Size() {
		const botConfig = this.botConfig2;
		let count = 0;
		if ("flow" in botConfig) {
			crorer(botConfig.flow.next, (flow: BotConfigFlowData) => {
				if (!flow.items.is_category) {
					count++;
				}
			});
		}

		return count;
		function crorer(flowList: Array<BotConfigFlowData>, fn: (flow: BotConfigFlowData) => void) {
			for (const _flow of flowList) {
				fn(_flow);
				if (_flow.next && _flow.next.length > 0) {
					crorer(_flow.next, fn);
				}
			}
		}
	}
	@Action({
		commit: 'REMOVE_FLOW2',
	})
	public removeFlow({ step, id }: { step: string; id: string }) {
		return { step, id };
	}

	// REMOVE_FLOW_BY_SCRIPTI
	@Action({
		commit: 'REMOVE_FLOW_BY_SCRIPTID',
	})
	public removeFlowByScriptID({ LinkScriptId }: { LinkScriptId: string }) {
		return { LinkScriptId };
	}

	@Action({
		commit: 'ADD_FLOW2',
	})
	public addFlow2({ step, index, title }: { step: string; index: number; title: string }) {
		const newStepId = v4();

		return { step, index, newStepId, title };
	}

	@Action({
		commit: 'ADD_FLOW_ID2',
	})
	public addFlow2ID({ step, scenarioId, title }: { step: string; scenarioId: string; title: string }) {
		const newStepId = v4();
		return { step, scenarioId, newStepId, title };
	}
	@Action({
		commit: 'SET_BOTCONFIG2',
	})
	public async saveConfig2(type: "bot" | "search" | "tag") {
		const fixedConfig = cleanFixBotConfig(this.botConfig2);
		if ('flow' in this.botConfig2) {
			const res = await ajax.http({
				baseURL: `${scriptUrl}`,
				url: 'scenario_data/',
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				data: {
					product_id: PRODUCT_ID,
					file: cleanFixBotConfig(this.botConfig2),
					version: '2',
					type: type == 'bot' ? type : 'search',
				},

			});
			// await TalkScriptModule.saveTalkscript();
			let TalkScript = TalkScriptModule.TalkScript;
			if (!(TalkScript?.length > 0)) {
				await TalkScriptModule.getTalkScript();
			}

			TalkScript = TalkScriptModule.TalkScript;
			let file = null;
			switch (type) {
				case 'bot':
					file = changeOldBotConfig(fixedConfig);
					break;
				case 'search':
					file = changeOldSearchConfig(fixedConfig, TalkScript, false);
					break;
				case 'tag':
					file = changeOldSearchConfig(fixedConfig, TalkScript);
					break;
			}
			const res2 = await ajax.http({
				baseURL: `${scriptUrl}`,
				url: 'scenario_data/',
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				data: {
					product_id: PRODUCT_ID,
					file: file,
					version: '1',
					type: type == 'bot' ? type : 'search',
				},
			});

			if (type === 'tag' || type === 'search') {
				TalkScriptModule.setTalkScript(TalkScript);
				await TalkScriptModule.saveTalkscript();
			}

		}
		const botConfig = this.botConfig2;
		return botConfig;
	}
	@Action({
		commit: 'SET_BOTCONFIG2',
	})
	public async saveBotConfig2() {
		if ('flow' in this.botConfig2) {
			const res = await ajax.http({
				baseURL: `${scriptUrl}`,
				url: 'scenario_data/',
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				data: {
					product_id: PRODUCT_ID,
					file: cleanFixBotConfig(this.botConfig2),
					version: '2',
					type: 'bot',
				},
			});
			const res2 = await ajax.http({
				baseURL: `${scriptUrl}`,
				url: 'scenario_data/',
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				data: {
					product_id: PRODUCT_ID,
					file: changeOldBotConfig(cleanFixBotConfig(this.botConfig2)),
					version: '1',
					type: 'bot',
				},
			});
		}

		const botConfig = this.botConfig2;
		return botConfig;
		// return [];
	}

	@Action({
		commit: 'SET_BOTCONFIG2',
	})
	public setBotConfig2(botConfig2: BotConfig) {
		return botConfig2;
	}
}

export const BotConfig2Module = getModule(BotConfig2Store);
