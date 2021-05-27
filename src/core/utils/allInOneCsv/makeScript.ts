// const fs = require('fs');
// const csvSync = require('csv-parse/lib/sync');
import { BotConfig, BotConfigFlow, OldScenario, OldSearchScenario } from './scenario';
import { TalkScript, RootTalkScript } from './script';
import _ from 'lodash';
import { valueAndGrad } from '@tensorflow/tfjs';
import { v4 } from 'uuid';
export function GetRootMenu(talkScript: Array<TalkScript>) {
	return talkScript.filter(t => t.parent === '#' && t.text !== OTHER_TEXT && t.status !== 'editing').map(t => t.text);
}
export function CleanRegExp(item: string): string {
	// if(item instanceof String){
	return item.replace(/[\[\\\^\$\|\*\+\(\)\]]/g, (m: string) => String.fromCharCode(m.charCodeAt(0) + 0xfee0));
	// }else if(item!=null){
	// 	for(let [key,value] of Object.entries(item)){
	// 	if(typeof item ==="string"){
	// 		value = value.replace(/[\\\^\$\.\|\?\*\+\(\)\]]/g,
	// 			(m: string)=>{
	// 				return String.fromCharCode(m.charCodeAt(0) + 0xFEE0);
	// 			})
	// 		}
	// }
	// return item;
}
export const OTHER_TEXT = '[自然文検索用]';
const MENU_SIZE = 3;
function AutoScriptLogTag(TalkScript: Array<TalkScript>) {
	const talkScript = JSON.parse(JSON.stringify(TalkScript));
	const logMapper = ['log_faq_parent_category', 'log_faq_child_category'];
	const linkScriptMap: any = {};
	const parent = [];
	for (const item of talkScript) {
		if (item.parent === '#') {
			_croler(item, talkScript, [item], (script, parents) => {
				const addItems: any = {};
				for (let i = 0; i < parents.length && i < logMapper.length; i++) {
					addItems[logMapper[i]] = [parents[i].text];
				}
				script.items = Object.assign(
					{},
					script.items || {},
					{
						log_faq_title: script.type == 'leaf' ? [script.text] : [],
					},
					addItems,
				);
				if ('scenario_id' in script.items && !Array.isArray(script.items.scenario_id)) {
					script.items.log_scenario = [script.items.scenario_id];
					script.items.log_faq = [script.items.scenario_id];
				}
			});
		}
	}
	return talkScript;
	function _croler(script: TalkScript, scriptList: Array<TalkScript>, parents: Array<TalkScript> = [], fn: (t: TalkScript, parents: Array<TalkScript>) => void) {
		fn(script, parents);
		for (const s of scriptList) {
			if (s.parent === script.id) {
				_croler(s, scriptList, parents.concat([s]), fn);
			}
		}
	}
}
function AutoBotLogTag({ TalkScript, BotConfig }: { TalkScript: Array<TalkScript>; BotConfig: BotConfig }): BotConfig {
	const botConfig: BotConfig = JSON.parse(JSON.stringify(BotConfig));
	const flow = botConfig.flow;
	console.log(flow);
	const rootFlowNext: Array<BotConfigFlow> = flow.next;
	const linkScriptMap: any = {};
	const linkScriptTitleMap: any = [];
	for (const item of TalkScript) {
		if (item.type === 'leaf') {
			const ancestorList = [item];
			const scenarioId: any = item.items.scenario_id || item.scenario;
			let parent = item.parent;
			loop1: while (parent !== '#') {
				for (const jItem of TalkScript) {
					if (jItem.id === parent) {
						ancestorList.unshift(jItem);
						parent = jItem.parent;
						if (parent == '#' || parent === undefined) {
							break loop1;
						}
						break;
					}
				}
			}
			if (item.items && item.items.scenario_id) {
				linkScriptMap[scenarioId] = ancestorList;
			} else if (item.scenario) {
				linkScriptMap[scenarioId] = ancestorList;
			}
			linkScriptTitleMap.push({ key: item.text, value: ancestorList });
		}
	}
	let count = 0;

	for (const rFlow of rootFlowNext) {
		const scenarioId = rFlow.id;
		search(
			rFlow,
			(flow: BotConfigFlow, parents: Array<{ position: number; flow: any; nextFlow?: any }>) => {
				let logName = `${scenarioId}`;
				if (parents.map((o, index) => index).filter((o, i) => i !== 0).length > 0) {
					logName = `${scenarioId}-${parents
						.filter((o, i) => i !== 0)
						.map(o => o.position + 1)
						.join('-')}`;
				}
				const stepKey = flow.id;
				if (scenarioId in linkScriptMap) {
					const scriptList = linkScriptMap[scenarioId];
					flow.items = Object.assign({}, scriptList[scriptList.length - 1].items || {}, flow.items || {}, {
						log_scenario: [logName],
						log_faq: [
							scenarioId, // scriptList[scriptList.length - 1].id
						],
						log_faq_parent_category: [scriptList[0].text],
						log_faq_child_category: [scriptList[1].text],
						log_faq_title: scriptList.length > 2 ? [scriptList[scriptList.length - 1].text] : [],
					});
					// console.log(new Date(parseInt(flow.items.update_date,10)));
					//
				} else if (flow.items?.is_category) {
					const logMapper = ['log_faq_parent_category', 'log_faq_child_category', 'log_faq_title'];
					let log: any = {};
					const script = TalkScript.find(s => s.id === flow.items.link_script_id);
					if (script) {
						log = script.items;
						if (script.type === "leaf" && script.scenario) {
							script.id = script.scenario;
							flow.items.link_script_id = script.scenario;
						}
					}
					// console.log(new Date(parseInt(log.update_date,10)));
					//
					flow.items = Object.assign({}, flow.items || {}, log, {
						log_scenario: [logName],
					});
				}
			},
			[{ position: count, flow: rFlow }],
		);
		count++;
	}

	function search(flow: any, fn: Function, parents: Array<{ position: number; flow: any; nextFlow?: any }> = []) {
		fn(flow, parents);
		let count = 0;
		for (const nextFlow of flow.next) {
			const nParents: Array<{
				position: number;
				flow: any;
				nextFlow?: any;
			}> = _.cloneDeep(parents);
			nParents.push({ nextFlow, position: count, flow });
			search(nextFlow, fn, nParents);
			count++;
		}
	}
	return botConfig;
}
/**
	* @param  {BotConfig} 新フォーマット
	* @returns OldSearchScenario　旧フォーマット
	*/
export function changeOldSearchConfig(_botConfig: BotConfig, talkScript: Array<TalkScript>, tagFlg = true): Array<OldSearchScenario.Scenario> {
	const botConfig: BotConfig = _.cloneDeep(_botConfig);
	const scenarioList: Array<OldSearchScenario.Scenario> = [];
	for (const next of botConfig.flow.next) {
		let title = "";
		if (Array.isArray(next.items?.log_faq_title)) {
			title = next.items.log_faq_title[0];
		}
		const oldScenarioConfig: OldSearchScenario.Scenario = {
			id: next.id,
			title,
			value: next.text,
			step: getStepByFlow([next], next.id),
			flow: convertFlow([next]),
			scenarioId: next.id
		};
		let oneflg = false;
		if (talkScript) {
			for (const t of talkScript) {
				if ((t.scenario && t.scenario === next.id) || (t.items && t.items.scenario_id === next.id)) {
					t.value = next.text;
					if (Object.keys(oldScenarioConfig.step).length <= 1) {
						delete t.scenario;
						const items = t.items;
						// if(items?.scenario_id){
						// 	delete items.scenario_id;
						// }

						oneflg = true;
					} else if (!Array.isArray(t.items.scenario_id)) {
						t.scenario = t.items.scenario_id;
					}
					break;
				}
			}
		} else {

		}
		if (oneflg === false || tagFlg === false) {
			scenarioList.push(oldScenarioConfig);
		}
	}
	return scenarioList;
	function convertFlow(_flows: Array<BotConfigFlow>): Array<OldSearchScenario.ScenarioFlow> {
		const flow: Array<OldSearchScenario.ScenarioFlow> = JSON.parse(JSON.stringify(_flows));
		cloler(flow);
		return flow;
		function cloler(_flow: Array<any>, parentFlow?: any, deep = 0) {
			let count = 1;
			for (const __flow of _flow) {
				// const buttonString = __flow.next.map((o: any, i: number) => `<button:${i + 1}.${o.label}>`).join('');
				__flow.title = __flow.text;
				// __flow.value = CleanRegExp(__flow.label);
				__flow.step = __flow.id;
				console.log(__flow);
				console.log(parentFlow);

				__flow.condition = {
					value: deep === 0 ? __flow.id : `${__flow.label}`,
					// type: deep === 0 ? 'equal' : 'number',
				};
				if (__flow.next && __flow.next.length > 0) {
					cloler(__flow.next, __flow, deep + 1);
				}
				delete __flow.label;
				delete __flow.text;
				delete __flow.action;
				count++;
			}
		}
	}
	function getStepByFlow(flows: Array<BotConfigFlow>, scenarioId: string): { [id: string]: OldSearchScenario.ScenarioStep } {
		const step: { [id: string]: OldSearchScenario.ScenarioStep } = {};
		cloler(flows);
		return step;
		function cloler(_flow: Array<BotConfigFlow>, parentFlow?: BotConfigFlow, deep = 0) {
			for (const __flow of _flow) {
				const buttonString = __flow.next.map((o: any, i: number) => `<button:${i + 1}.${String(o.label)}>`).join('');
				let title = "";
				if (Array.isArray(__flow.items?.log_faq_title)) {
					title = __flow.items.log_faq_title[0];
				}
				if(tagFlg){
					title = parentFlow?.label || __flow.label || title || "";
				}else{
					if(deep>0){
						title = __flow.label || title || "";
					}
				}
				step[__flow.id] = {
					id: __flow.id,
					type: __flow.next.length > 0 ? "q" : "a",
					title,
					text: __flow.text,
					items: __flow.items,
					options: __flow.next.map((o: any, i: number) => {
						return { value: o.label };
					}),
					scenarioId
				};
				if (__flow.next && __flow.next.length > 0) {
					cloler(__flow.next, __flow, deep + 1);
				}
			}
		}
	}
}
/**
	* @param  {BotConfig} 新フォーマット
	* @returns OldScenario　旧フォーマット
	*/
export function changeOldBotConfig(_botConfig: BotConfig): OldScenario.BotConfig {
	const botConfig: BotConfig = _.cloneDeep(_botConfig);
	const oldBotConfig: OldScenario.BotConfig = {
		scenario: {
			title: botConfig.title,
			description: botConfig.description,
			steps: getStepsByFlow(botConfig.flow.next),
			flow: {
				root: { step: 'init', next: convertFlow(botConfig.flow.next) },
			},
		},
	};
	return oldBotConfig;
	function convertFlow(_flows: Array<BotConfigFlow>): Array<OldScenario.BotConfigFlow> {
		const flows: Array<OldScenario.BotConfigFlow> = JSON.parse(JSON.stringify(_flows));
		cloler(flows);
		return flows;
		function cloler(_flow: Array<any>, deep = 0) {
			let count = 1;
			for (const __flow of _flow) {
				const buttonString = __flow.next.map((o: any, i: number) => `<button:${i + 1}.${o.label}>`).join('');
				__flow.title = CleanRegExp(__flow.text + buttonString);
				__flow.value = CleanRegExp(__flow.label);
				__flow.step = CleanRegExp(__flow.id);
				__flow.condition = {
					value: deep === 0 ? CleanRegExp(__flow.id) : `${count}`,
					type: deep === 0 ? 'equal' : 'number',
				};
				if (__flow.next && __flow.next.length > 0) {
					cloler(__flow.next, deep + 1);
				}
				delete __flow.label;
				delete __flow.text;
				delete __flow.action;
				count++;
			}
		}
	}
	function getStepsByFlow(flows: Array<BotConfigFlow>): { [id: string]: OldScenario.BotConfigStep } {
		const steps: { [id: string]: OldScenario.BotConfigStep } = {
			init: {
				action: {
					success: { type: 'text', value: '', items: {} },
					error: { type: 'text', value: '' },
				},
			},
		};
		cloler(flows);
		return steps;
		function cloler(_flow: Array<BotConfigFlow>) {
			for (const __flow of _flow) {
				const buttonString = __flow.next.map((o: any, i: number) => `<button:${i + 1}.${String(o.label)}>`).join('');
				steps[CleanRegExp(__flow.id)] = {
					action: {
						success: {
							type: 'text',
							value: CleanRegExp(__flow.text + buttonString),
							items: __flow.items,
						},
						error: {
							type: 'text',
							value: 'リッチメニューから項目を選択してください。',
						},
					},
				};
				if (__flow.next && __flow.next.length > 0) {
					cloler(__flow.next);
				}
			}
		}
	}
}
export function UpdateInfoMessage(
	_botConfig: BotConfig,
	searchActionConfig: {
		INFO_MESSAGE_PARENT: string;
		INFO_MESSAGE_CHILD: string;
	},
): BotConfig {

	const botConfig: BotConfig = _.cloneDeep(_botConfig);

	ScenarioCrawler(botConfig.flow.next, (scenarioFlow, depth) => {
		if (scenarioFlow.items.is_category) {
			if (depth == 0) {
				scenarioFlow.text = String(searchActionConfig.INFO_MESSAGE_PARENT).replace(/\[category-text\]/, scenarioFlow.label);
			} else if (depth == 1) {
				scenarioFlow.text = String(searchActionConfig.INFO_MESSAGE_CHILD).replace(/\[category-text\]/, scenarioFlow.label);
			}
		}
	});
	return botConfig;
	function ScenarioCrawler(scenarioList: Array<BotConfigFlow>, fn: (scenario: BotConfigFlow, depth: number) => void, parent = 'root', depth = 0) {
		// const step = scenarioGroup.getStep(scenario.step);
		// const parentStep = scenarioGroup.getStep(parent);
		for (const scenario of scenarioList) {
			fn(scenario, depth);

			if (scenario.next && depth + 1 < 2) {
				ScenarioCrawler(scenario.next, fn, scenario.id, depth + 1);
			}
		}
	}
}
export function makeScriptAndScenarioByData(
	talkScript: Array<TalkScript>,
	botScenario: BotConfig,
	searchActionConfig?: {
		INFO_MESSAGE_PARENT: string;
		INFO_MESSAGE_CHILD: string;
	},
) {
	let BotScenario = _.cloneDeep(botScenario);
	let TalkScript = _.cloneDeep(talkScript);

	const flg = true;
	const parentQue: Array<{
		id: string;
		scenarioId: string;
		text: string;
		parent: Array<string>;
	}> = [{ id: '#', scenarioId: '#', text: '#', parent: [] }];
	const categoryScenario: Array<BotConfigFlow> = [];
	while (parentQue.length > 0) {
		const parent = parentQue.shift();
		if (parent == undefined) {
			break;
		}
		for (const script of TalkScript) {
			if (script.parent == parent.id) {
				let cSId = parent.parent.length > 0 ? `${parent.parent.join('-')}-${script.text}` : `${script.text}`;
				if (parent.parent.indexOf(OTHER_TEXT) !== -1) {
					cSId = v4();
				}
				if (script.text != OTHER_TEXT&&parent.parent.indexOf(OTHER_TEXT)===-1) {
					const nextFlow = _.cloneDeep(BotScenario.flow.next.find(f => f.id == (script.scenario || script.items.scenario_id)));
					const nextQue = [];
					const cSList = getScenarioFlow(parent.scenarioId, categoryScenario);
					let text = '';
					if (parent.parent.length <= 0) {
						text = String(searchActionConfig?.INFO_MESSAGE_PARENT || script.text || '').replace(/\[category-text\]/, String(script.text));
					} else if (parent.parent.length === 1) {
						text = String(searchActionConfig?.INFO_MESSAGE_CHILD || script.text || '').replace(/\[category-text\]/, String(script.text));
					} else {
						text = nextFlow?.text || '';
					}

					if (nextFlow?.next && nextFlow.next.length > 0) {
						nextQue.push(nextFlow.next);
					}
					// else if(nextFlow?.next&&nextFlow.next.length===0){
					// 	nextQue.push([nextFlow]);
					// }
					while (nextQue.length > 0) {
						const nexts = nextQue.shift();
						if (!nexts) {
							break;
						}
						for (const f of nexts) {
							f.items = Object.assign({}, f.items || {}, {
								is_category: true,
								scenario_id: f.id,
							});
							// debugger;
							// f.id = v4();
							if (f.next && f.next.length > 0) {
								nextQue.push(f.next);
							}
						}
					}
					const next = nextFlow?.next;
					// let text=data.value || data.text;

					// 一問一答の場合は特殊
					if (nextFlow?.next && nextFlow.next.length === 0) {
						// next=[nextFlow];
						text = nextFlow.text;
						cSList.push({
							id: cSId,
							items: Object.assign({}, script.items, {
								is_category: true,
								link_script_id: script.id,
							}),
							label: script.text,
							text,
							next: next || [],
						});
					} else {
						cSList.push({
							id: cSId,
							items: Object.assign({}, script.items, {
								is_category: true,
								link_script_id: script.id,
							}),
							label: script.text,
							text,
							next: next || [],
						});
					}
				}
				const _parent = _.cloneDeep(parent.parent);
				_parent.unshift(script.text);
				parentQue.push({
					id: script.id,
					scenarioId: cSId,
					text: script.text,
					parent: _parent,
				});
			}
		}
		console.log(parentQue);
	}
	console.log(categoryScenario);
	BotScenario.flow.next = BotScenario.flow.next.filter(flow => !flow.items?.is_category).concat(categoryScenario);

	BotScenario.flow.next = BotScenario.flow.next.filter(flow => {
		if (flow.items.is_category) {
			return true;
		}
		return TalkScript.find(t => (t.items.scenario_id || t.scenario||true) === flow.id);
	});
	console.log(BotScenario);
	function getScenarioFlow(id: string, flowList: Array<BotConfigFlow>): Array<BotConfigFlow> {
		if (id == '#') {
			return flowList;
		}
		return flowCroler(id, flowList) || flowList;
		function flowCroler(_id: string, fList: Array<BotConfigFlow>): Array<BotConfigFlow> | null {
			for (const f of fList) {
				if (f.id == _id) {
					return f.next;
				} else if (Array.isArray(f.next)) {
					const ret = flowCroler(_id, f.next);
					if (ret) {
						return ret;
					}
				}
			}
			return null;
		}
	}
	croler(BotScenario.flow.next, (botConfig: BotConfigFlow, deep: number) => {
		if (botConfig.items.is_category && botConfig.items.link_script_id) {
			const script = talkScript.find(t => t.id == botConfig.items.link_script_id);
			if (script) {
				botConfig.label = script.text;
				botConfig.items = Object.assign({}, botConfig.items || {}, script.items || {});
				// botConfig.id = script.id;
				// カテゴリ文言を挿入；これは後にまとめてやる？
				// if(deep==0){
				// 	botConfig.text = String(searchActionConfig?.INFO_MESSAGE_PARENT || script.text).replace(/\[category-text\]/, String(botConfig.label));
				// }	else{
				// 	botConfig.text = String(searchActionConfig?.INFO_MESSAGE_CHILD || script.text).replace(/\[category-text\]/, String(botConfig.label));
				// }
			}
		}
	});
	/**
		スクリプトの子要素のリーフがすべてeditingならnodeもediting;
		*/
	TalkScriptEditingParse(TalkScript);
	FlowCroler(BotScenario.flow.next, BotScenario.flow, (flow, parentFlow) => {
		if (TalkScript.find(t => flow.items?.link_script_id && flow.items?.link_script_id === t.id && t.status === 'editing')) {
			if (parentFlow?.next) {
				parentFlow.next = parentFlow.next.filter(f => f.id !== flow.id);
			}
		}
	});
	TalkScript = AutoScriptLogTag(TalkScript);
	BotScenario = AutoBotLogTag({ TalkScript, BotConfig: BotScenario });
	return { TalkScript, BotScenario };
	function croler(botConfigList: Array<BotConfigFlow>, fn: (b: BotConfigFlow, deep: number) => void, deep = 0) {
		for (let i = 0; i < botConfigList.length; i++) {
			const botConfig = botConfigList[i];
			fn(botConfig, deep);
			if (botConfig.next && botConfig.next.length > 0) {
				croler(botConfig.next, fn, deep + 1);
			}
		}
	}
}
export function validateAllInOneCsv(bot_csv: Array<Array<string>>, setting?: Set<string>): [boolean, string | null] {
	type Csv = Array<Array<string>>;
	const indispensableIdSet = new Set(['1', '2', '3', '4', '5', '6', '7']);
	const coromIdList = bot_csv[0].map(s => s.replace(/\(.*\)/, "").trim());
	const coromMapper = new Map();

	for (let i = 0; i < coromIdList.length; i++) {
		if (!coromMapper.has(coromIdList[i])) {
			coromMapper.set(coromIdList[i], []);
		}
		coromMapper.get(coromIdList[i]).push(i);
	}
	for (const insispansableId of indispensableIdSet.values()) {
		if (!coromMapper.has(insispansableId)) {
			return [true, 'カラムIDが不正です。'];
		}
	}
	const menuIdList = coromMapper.get('4');
	const scenarioIdList = coromMapper.get('7');
	const sId = new Set();
	const menuList = [];
	let i = 1;
	while (i < bot_csv.length) {
		const scenarioIdCellValue = bot_csv[i][coromMapper.get('1')[0]].trim();
		// const scenarioId = scenarioIdCellValue !== "" ? scenarioIdCellValue : v4();
		const rowSize = getRowSize(bot_csv, i);
		const editing = bot_csv[i][coromMapper.get('2')[0]].trim();
		const updatingDate = bot_csv[i][coromMapper.get('3')[0]];
		const keyWords = bot_csv[i][coromMapper.get('5')[0]];
		const leafTitle = bot_csv[i][coromMapper.get('6')[0]];
		const menu: Array<string> = [];
		let menuCount = 0;
		for (const menuId of menuIdList) {
			if (bot_csv[i][menuId] == '' || bot_csv[i][menuId] == undefined) {
				if (menuCount == 0 || menuCount >= 2) {
					break;
				}
				// bot_csv[i][menuId] = 'その他';
				// menu.push(bot_csv[i][menuId]);
				break;
			}
			menu.push(bot_csv[i][menuId]);
			menuCount++;
		}
		if (scenarioIdCellValue !== '') {
			if (sId.has(scenarioIdCellValue)) {
				return [true, `IDに重複があります。:${i + 1}行目`];
			}
			sId.add(scenarioIdCellValue);
		}
		if (scenarioIdCellValue !== '' && !String(scenarioIdCellValue).match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/)) {
			return [true, `不正なID値が含まれています。:${i + 1}行目`];
		}
		if (leafTitle.match(/\n/)) {
			return [true, `6(Q)に改行が含まれています。:${leafTitle}:${i + 1}行目`];
		}
		// if(leafTitle&&scenarioIdCellValue !== ""){
		// 	return [true, `IDが未入力の項目があります。:${i}行目`];
		// }
		if (updatingDate !== '' && !String(updatingDate).match(/^20[2-9][0-9]\/[0-1]?[0-9]\/[0-3]?[0-9]$/)) {
			return [true, `不正な値が含まれています。:${i + 1}行目`];
		}
		if (menu.filter(m => m != null && m != '').length == 1) {
			return [true, `メニューが不正な形式です。:${i + 1}行目`];
		}
		if (setting && setting.has("needAllMenu")) {
			if (menu.filter(m => m != null && m != '').length < 2) {
				return [true, `メニューが不正な形式です。:${i + 1}行目`];
			}
		}
		if (rowSize > 0) {
			// シナリオ取得のために行数を取得する。そしてループをその行数＋１に飛ばす
			i += rowSize;
		}
		i++;
	}
	return [false, null];
	function getRowSize(bot_csv: Csv, index: number) {
		let count = 0;
		let i = index + 1;
		if (i >= bot_csv.length) {
			return count;
		}
		let id = bot_csv[i][coromMapper.get('6')];
		try {
			while (id === '' && i < bot_csv.length) {
				count++;
				i++;
				id = bot_csv[i][coromMapper.get('6')];
			}
		} catch (e) {
			console.log(e);
		}

		return count;
	}
}
export function makeScriptAndScenario(
	bot_csv: Array<Array<string>>,
	searchActionConfig?: {
		INFO_MESSAGE_PARENT: string;
		INFO_MESSAGE_CHILD: string;
	},
) {
	type Csv = Array<Array<string>>;
	const scenarioObj: BotConfig = {
		// scenario: {
		title: 'scenario1',
		description: '',
		flow: {
			step: 'init',
			next: [],
		},
		// }
	};
	const scenaristCount = 1;
	const talkScript: Array<TalkScript> = [];
	// console.log(bot_csv[0]);
	const coromIdList = bot_csv[0].map(s => s.replace(/\(.*\)/, "").trim());
	const coromMapper = new Map();
	for (let i = 0; i < coromIdList.length; i++) {
		if (!coromMapper.has(coromIdList[i])) {
			coromMapper.set(coromIdList[i], []);
		}
		coromMapper.get(coromIdList[i]).push(i);
	}
	// for (let [key, value] of coromMapper.entries()) {
	// 	console.log(`${key}: ${value}`);
	// 	if (key == 7) {

	// 	}
	// }

	// type TsMap = Map<string | number, TsMap>;
	const scenarioIdMap = new Map();
	interface TkMap {
		data: TalkScript | RootTalkScript;
		map: Map<string | number, TkMap>;
	}
	const talkScriptMap: TkMap = {
		data: { type: 'root', id: '#', position: 0 },
		map: new Map(),
	};
	const menuIdList = coromMapper.get('4');
	const scenarioIdList = coromMapper.get('7');
	const scenarioList = [];
	let i = 1;
	const menuCount = 1;
	let scenarioIdString = '';
	const menuList = [];
	while (i < bot_csv.length) {
		const scenarioIdCellValue = bot_csv[i][coromMapper.get('1')[0]].trim();
		const scenarioId = scenarioIdCellValue !== '' ? scenarioIdCellValue : v4();
		const rowSize = getRowSize(bot_csv, i);
		const editing = bot_csv[i][coromMapper.get('2')[0]].trim();
		const updatingDate = new Date(bot_csv[i][coromMapper.get('3')[0]]);
		const keyWords = bot_csv[i][coromMapper.get('5')[0]];
		const leafTitle = bot_csv[i][coromMapper.get('6')[0]];
		let menu: Array<string> = [];
		let menuCount = 0;
		for (const menuId of menuIdList) {
			if (bot_csv[i][menuId] == '' || bot_csv[i][menuId] == undefined) {
				if (menuCount == 0 || menuCount >= 2) {
					break;
				}
				// bot_csv[i][menuId] = 'その他';
				// menu.push(bot_csv[i][menuId]);
				break;
			}
			menu.push(bot_csv[i][menuId]);
			menuCount++;
		}
		// 自然文検索の場合
		if (menu.length + 1 < MENU_SIZE) {
			menu = [];
		}
		while (menu.length + 1 < MENU_SIZE) {
			menu.push(OTHER_TEXT);
		}
		// menu = [OTHER_TEXT, OTHER_TEXT, leafTitle];
		menu.push(leafTitle);
		// console.log(menu);
		const scenario = [];
		for (let j = 0; j <= rowSize; j++) {
			//
			scenario.push(scenarioIdList.map((sId: any) => String(bot_csv[i + j][sId])));
		}
		// if (menu.every(o => o == '')) {
		// 	continue;
		// }
		scenarioIdString = `${scenarioId}`;
		// 自然文検索の場合
		if (menu.length === MENU_SIZE && menu.indexOf(OTHER_TEXT) !== -1) {
			// scenarioIdString = leafTitle;
		}
		// if (scenario.length > 0) {
		//     if (menu.length > 0) {
		//         scenarioIdString = `s${("000000" + scenarioId).slice(-5)}`;
		//     } else {
		//         scenarioIdString = `menu${("000000" + menuCount++).slice(-2)}`;
		//     }
		// }
		// ↓ロジック

		let _tkMap: TkMap = talkScriptMap;

		for (let j = 0; j < menu.length; j++) {
			const nodeData: TalkScript = {
				id: v4(),
				type: 'node',
				parent: '',
				text: menu[j],
				title: menu[j],
				items: {},
				status: 'published',
				position: i,
			};

			if (j === menu.length - 1) {
				const leafData: TalkScript = {
					id: scenarioIdString,
					type: 'leaf',
					title: menu[j],
					questions: keyWords.split('\n'),
					parent: '',
					text: menu[j],
					items: { scenario_id: scenarioIdString },
					position: i,
					status: editing === '1' ? 'editing' : 'published',
					scenario: scenarioIdString,
				};
				if (!_tkMap.map.has(menu[j])) {
					_tkMap.map.set(menu[j], { data: leafData, map: new Map() });
				}
				const tkmenu = _tkMap.map.get(menu[j]);
				if (tkmenu) {
					_tkMap = tkmenu;
					_tkMap.data = leafData;
				}

				break;
			}
			if (!_tkMap.map.has(menu[j])) {
				_tkMap.map.set(menu[j], { data: nodeData, map: new Map() });
			}
			const tkmenu = _tkMap.map.get(menu[j]);
			if (tkmenu) {
				_tkMap = tkmenu;
			}
			const position = _tkMap.data.position;
			_tkMap.data = nodeData;
			_tkMap.data.position = position;
		}

		start(0, 0, scenario, (q, title, slectList, deep, index, scenarioDeepString, parentScenarioStep) => {
			let scenarioStepString = '';
			if (parentScenarioStep === 'root') {
				scenarioStepString = `${scenarioIdString}`;
			} else {
				scenarioStepString = `${parentScenarioStep}_${index}`;
			}

			for (const slect of slectList) {
				// console.log(slect);
			}
			const log_itemsMATCH = q.match(/<log-(.+?):(.+?)>/g);
			const log: any = {};
			if (log_itemsMATCH) {
				for (const matchTag of log_itemsMATCH) {
					const matchOneTag = matchTag.match(/<(log-.+?):(.+?)>/);
					if (!matchOneTag) {
						continue;
					}
					const [matchText, matchKey, matchId] = matchOneTag;
					const matchKeySt = matchKey.replace(/\-/g, '_');
					if (!(matchKeySt in log)) {
						log[matchKeySt] = [];
					}
					log[matchKeySt].push(matchId);
				}
			}
			const log_scenarioString = `${scenarioIdString}${scenarioDeepString}`;
			// すでにログシナリオがない場合のみ自動付与　（この条件は要検討）
			if (!('log_scenario' in log)) {
				log.log_scenario = [log_scenarioString];
			}
			if (!('log_faq' in log)) {
				log.log_faq = [scenarioIdString];
			}
			if (!('log_faq_title' in log)) {
				log.log_faq_title = [leafTitle];
			}
			const buttonString = slectList.map((o, i) => `<button:${i + 1}.${o.value}>`).join('');
			// flow追加ロジック
			const items = {
				update_date: `${updatingDate.getTime() || new Date().getTime()}`,
			};
			if (deep === 0) {
				/**
					* 野良だったら
					*/
				if (menu.length === 3 && menu[0] === OTHER_TEXT && menu[1] === OTHER_TEXT) {
					scenarioObj.flow.next.push({
						id: scenarioStepString,
						next: [],
						items: Object.assign({}, items, log, { is_search: true }),
						text: q,
						label: title,
					});
				} else {
					scenarioObj.flow.next.push({
						id: scenarioIdString,
						next: [],
						items: Object.assign({}, items, log),
						label: title,
						text: q,
						// action: {
						//     type: "text",
						//     value: q + buttonString,
						//     items: Object.assign({}, items, log)
						// }
					});
				}
			} else {
				SearchScenarioFlow(parentScenarioStep, scenarioObj.flow.next, flow => {
					flow.next.push({
						id: scenarioStepString, // `${parentScenarioStep}_${flow.next.length + 1}`,
						label: `${title}`, // `${flow.next.length + 1}.${title}`,
						next: [],
						items: Object.assign({}, items, log),
						text: q,
					});
				});
			}

			return scenarioStepString;
		});
		// ↑ロジック
		if (rowSize > 0) {
			// シナリオ取得のために行数を取得する。そしてループをその行数＋１に飛ばす
			i += rowSize;
		}
		i++;
	}
	/**
		* トークスクリプトの作成及びメニューからのシナリオ作成
		*/
	let talkScriptCount = 0;
	// makeNode(
	// 	talkScriptMap,
	// 	'#',
	// 	(key, value, parentId, deep, parentStepName, parentValue) => {
	// 		value.data.id = String(talkScriptCount++);
	// 		return '';
	// 	},
	// 	0,
	// 	'',
	// );
	makeNode(
		talkScriptMap,
		'#',
		(key, value, parentId, deep, parentStepName, parentValue) => {
			const { data, map } = value;
			if (data.type === 'root') {
				return '';
			}
			let scenarioStepString = data.id; // `C_${scenaristCount++}`;
			const items = {
				update_date: `${Array.isArray(data.items?.update_date) ? data.items?.update_date[0] : data.items?.update_date || new Date().getTime()}`,
			};
			const log_itemsMATCH = data.text.match(/<log-(.+?):(.+?)>/g);
			const log: any = {};
			if (log_itemsMATCH) {
				for (const matchTag of log_itemsMATCH) {
					const matchTagOne = matchTag.match(/<(log-.+?):(.+?)>/);
					if (matchTagOne) {
						const [matchText, matchKey, matchId] = matchTagOne;
						const matchKeySt = matchKey.replace(/\-/g, '_');
						if (!(matchKeySt in log)) {
							log[matchKeySt] = [];
						}
						log[matchKeySt].push(matchId);
					}
				}
			}
			let buttonString = '';
			let buttonCount = 1;
			for (const [childTitle, childValue] of map.entries()) {
				if (childValue.data.type == 'leaf') {
					buttonString += `<link:${childValue.data.scenario}>`;
				} else {
					buttonString += `<button:${buttonCount}.${childTitle}>`;
				}
				buttonCount++;
			}
			if (data.type === 'node') {
				talkScript.push({
					status: 'published',
					id: data.id,
					type: data.type,
					position: data?.position || 0,
					parent: parentId,
					items: Object.assign({}, items, data.items),
					text: String(key),
					title: String(key),
				});
				if (data.text !== OTHER_TEXT) {
					if (deep <= 0) {
						scenarioStepString = data.text;
						scenarioObj.flow.next.push({
							id: scenarioStepString, // scenarioIdString,
							items: Object.assign({}, items, log, data.items, {
								is_category: true,
								link_script_id: data.id,
							}),
							text: String(searchActionConfig?.INFO_MESSAGE_PARENT || data.text || '').replace(/\[category-text\]/, String(key)),
							label: data.text,
							next: [],
						});
					} else {
						let text = data.text || '';

						if (deep === 1 && searchActionConfig?.INFO_MESSAGE_CHILD) {
							text = String(searchActionConfig.INFO_MESSAGE_CHILD || data.text).replace(/\[category-text\]/, String(key));
						} else {
							const flow = scenarioObj.flow.next.find(f => f.id == (data.scenario || data.items.scenario_id));
							if (flow) {
								text = flow.text;
							}
						}
						SearchScenarioFlow(parentStepName, scenarioObj.flow.next, flow => {
							console.log(flow);
							scenarioStepString = data.text;
							scenarioStepString = `${parentStepName}_${scenarioStepString}`;
							flow.next.push({
								id: scenarioStepString,
								label: String(key),
								text,
								items: Object.assign({}, items, log, data.items, {
									is_category: true,
									link_script_id: data.id,
								}),
								next: [],
							});
						});
					}
				}
			} else {
				talkScript.push({
					id: data.id,
					type: data.type,
					position: data.position,
					parent: parentId,
					items: Object.assign({}, items, data.items, {
						scenario_id: data.scenario,
					}),
					text: String(key),
					title: String(key),
					questions: data.questions,
					scenario: data.scenario || '',
					status: data.status,
				});
				// let next: any = [];
				// for (const rootNext of scenarioObj.flow.next) {
				// 	if (data.scenario && rootNext.id === data.scenario) {

				// 		next = rootNext.next;
				// 		console.log(next);
				// 	}
				// }

				if (parentValue && 'text' in parentValue.data && parentValue.data.text !== OTHER_TEXT && data.status !== 'editing') {
					SearchScenarioFlow(parentStepName, scenarioObj.flow.next, flow => {
						console.log(flow);
						scenarioStepString = data.text;
						scenarioStepString = `${parentStepName}_${scenarioStepString}`;
						const nextFlow = _.cloneDeep(scenarioObj.flow.next.find(f => f.id == (data.scenario || data.items.scenario_id)));

						// const nextFlow = _.cloneDeep(scenarioObj.flow.next.find(f => f.id == flow.items.scenario_id));
						const nextQue = [];
						if (nextFlow?.next && nextFlow.next.length > 0) {
							nextQue.push(nextFlow.next);
						}
						// else if(nextFlow?.next&&nextFlow.next.length===0){
						// 	nextQue.push([nextFlow]);
						// }
						while (nextQue.length > 0) {
							const nexts = nextQue.shift();
							if (!nexts) {
								break;
							}
							for (const f of nexts) {
								f.items = Object.assign({}, f.items || {}, {
									is_category: true,
									scenario_id: f.id,
								});
								// debugger;
								// f.id = v4();
								if (f.next && f.next.length > 0) {
									nextQue.push(f.next);
								}
							}
						}
						const next = nextFlow?.next;
						let text = data.text;
						if (nextFlow?.text) {
							text = nextFlow.text;
						}
						// 一問一答の場合は特殊

						if (nextFlow?.next && nextFlow.next.length === 0) {
							// next=[nextFlow];
							text = nextFlow.text;
							flow.next.push({
								id: scenarioStepString,
								label: String(key),
								text,
								items: Object.assign({}, items, log, {
									is_category: true,
									link_script_id: data.id,
								}),
								next: [],
							});
						} else {
							flow.next.push({
								id: scenarioStepString,
								label: String(key),
								text,
								items: Object.assign({}, items, log, {
									is_category: true,
									link_script_id: data.id,
								}),
								next: next || [],
							});
						}
					});
				}
			}
			return scenarioStepString;
		},
		0,
		'',
	);

	/**
		スクリプトの子要素のリーフがすべてeditingならnodeもediting;
		*/
	TalkScriptEditingParse(talkScript);

	FlowCroler(scenarioObj.flow.next, scenarioObj.flow, (flow, parentFlow) => {
		if (talkScript.find(t => t.id === flow.items.link_script_id && t.status === 'editing')) {
			if (parentFlow?.next) {
				parentFlow.next = parentFlow.next.filter(f => f.id !== flow.id);
			}
		}
	});
	const tagScript = AutoScriptLogTag(talkScript);
	// }
	// TalkScript, BotConfig
	const tagScenarioObj = AutoBotLogTag({
		TalkScript: tagScript,
		BotConfig: scenarioObj,
	});
	const rootMenu = talkScript.filter(t => t.parent === '#' && t.text !== OTHER_TEXT && t.status !== 'editing').map(t => t.text);
	console.log(tagScript);
	return {
		talkScript: tagScript,
		scenario: tagScenarioObj,
		rootmenu: rootMenu,
	};
	function getRowSize(bot_csv: Csv, index: number) {
		let count = 0;
		let i = index + 1;
		if (i >= bot_csv.length) {
			return count;
		}
		let id = bot_csv[i][coromMapper.get('6')];
		try {
			while (id === '' && i < bot_csv.length) {
				count++;
				i++;
				id = bot_csv[i][coromMapper.get('6')];
			}
		} catch (e) {
			console.log(e);
		}

		return count;
	}

	// @ values :Array<{x:number,y:number}>
	function start(
		x: number,
		y: number,
		scenario: any,
		fn: (a: string, title: string, nexts: Array<{ x: number; y: number; value: string }>, deep: number, index: number, scenarioDeepString: string, parentScenarioStep: string) => string,
		deep = 0,
		index = 0,
		scenarioDeepString = '',
		parentScenarioStep = 'root',
	) {
		const nexts = getNextsForValue(x, y, scenario);
		let a = '';
		let title = '';
		if (scenario.length >= y && scenario[y] && scenario[y][x]) {
			a = scenario[y][x];
		}
		if (scenario.length >= y && scenario[y] && scenario[y][x - 1]) {
			title = scenario[y][x - 1];
		}
		parentScenarioStep = fn(a, title, nexts, deep, index, scenarioDeepString, parentScenarioStep);
		let count = 0;
		for (const next of nexts) {
			start(next.x, next.y, scenario, fn, deep + 1, count, scenarioDeepString + '-' + count, parentScenarioStep);
			count++;
		}
	}

	function getNextsForValue(x: number, y: number, table: Array<Array<string>>) {
		const value = [];
		let count = 0;
		// if(String(table[y][x]).match(/any/i)){
		// 	return [{x:x+1,y:y}];
		// }
		while (true) {
			// tslint:disable-next-line:no-unused-expression
			try {
				table[y][x + 1];
			} catch (e) {
				break;
			}
			const nextval = table[y][x + 1];
			const val = table[y][x];
			if (is_null(nextval)) {
				y++;
				count++;
				continue;
			}
			if (count !== 0) {
				if (!is_null(val)) {
					break;
				}
			}
			value.push({ x: x + 2, y, value: nextval });
			y++;
			count++;
		}
		return value;
	}

	function getSelects(x: number, y: number, table: Csv) {
		const value = [];
		let count = 0;
		while (true) {
			// tslint:disable-next-line:no-unused-expression
			try {
				table[y][x + 1];
			} catch (e) {
				break;
			}
			const nextval = table[y][x + 1];
			const val = table[y][x];

			if (is_null(nextval)) {
				y++;
				count++;
				continue;
			}
			if (count !== 0) {
				if (!is_null(val)) {
					break;
				}
			}
			value.push(nextval);
			y++;
			count++;
		}
		return value;
	}
	// tslint:disable-next-line:no-shadowed-variable
	function makeValue(text: string, x: number, y: number, bot_csv: Csv) {
		let retValue = '';
		if (x <= 0) {
			return retValue;
		}
		const matchTag = is_image(text);
		if (matchTag) {
			retValue = text.replace(matchTag[0], '');
		} else {
			const value = getStringValueForValue(x, y, bot_csv);
			if (value) {
				retValue = `${text}${value}`;
			} else {
				retValue = `${text}`;
			}
		}
		return retValue;
	}
	function is_image(text: string) {
		// console.log(text);
		return String(text).match(/<imagemap:(.+?)>/);
	}

	function is_onenext(x: number, y: number, table: Csv) {
		return getSelects(x, y, table).length === 1;
	}
	function getStringValueForValue(x: number, y: number, table: Csv) {
		if (getSelects(x, y, table).length <= 0) {
			return '';
		}
		return getSelects(x, y, table)
			.map((o, i) => `<button:${i + 1}.${o}>`)
			.join('');
		// const buttons = getSelects(x,y,table)
		// .map((o,i)=>{
		// 	return {label:`${i+1}.${o}`,text:`${i+1}.${o}`};
		// });
		// return `<json>${JSON.stringify({type:"button",buttons:buttons})}</json>`
	}

	function is_null(val: string) {
		return !(val && val.trim().length > 0);
	}

	function makeNode(
		tsNode: TkMap,
		parentId: string,
		fn: (key: string | number, value: TkMap, parentId: string, deep: number, parentStepName: string, parent?: TkMap) => string,
		deep = 0,
		parentStepName: string,
	) {
		let count = 0;
		if (tsNode.map == null) {
			return;
		}
		for (const [key, value] of tsNode.map.entries()) {
			const stepName = fn(key, value, tsNode.data.id, deep, parentStepName, tsNode);
			const { data, map } = value;
			data.position = count;
			if (data.type === 'leaf') {
			} else {
				makeNode(value, tsNode.data.id, fn, deep + 1, stepName);
			}
			count++;
		}
	}
	function SearchScenarioFlow(stepName: string, flowList: Array<BotConfigFlow>, fn: (flow: BotConfigFlow) => void) {
		for (const flow of flowList) {
			if (flow.id === stepName) {
				fn(flow);
				break;
			}
			if (flow.next && flow.next.length > 0) {
				SearchScenarioFlow(stepName, flow.next, fn);
			}
		}
	}
}
function FlowCroler(flowList: Array<BotConfigFlow>, parentFlow: any, fn: (flow: BotConfigFlow, parentFlow: BotConfigFlow | null) => void) {
	for (const flow of flowList) {
		fn(flow, parentFlow);
		if (flow.next && flow.next.length > 0) {
			FlowCroler(flow.next, flow, fn);
		}
	}
}

function TalkScriptEditingParse(talkScript: Array<TalkScript>) {
	const TalkScript = talkScript;
	// const PScriptSet = new Set();
	// const MaxDepth = 2;
	// for (let i = 0; i < MaxDepth; i++) {
	// 	for (const tItem of TalkScript) {
	// 		if (tItem.status === "published") {
	// 			PScriptSet.add(tItem.parent);
	// 		}
	// 	}
	// 	for (const tItem of TalkScript) {
	// 		if (!PScriptSet.has(tItem.id) && tItem.type === "node" && tItem.status === "published") {
	// 			tItem.status = "editing";
	// 			PScriptSet.delete(tItem.id);
	// 			PScriptSet.delete(tItem.parent);
	// 		}
	// 	}
	// }
	for (const tItem of TalkScript) {
		if (tItem.type === 'node' && tItem.parent !== '#') {
			let isEditing = true;
			for (const tItemj of TalkScript) {
				if (tItemj.type === 'leaf' && tItemj.parent === tItem.id) {
					if (tItemj.status === 'published') {
						isEditing = false;
					}
				}
			}
			if (isEditing) {
				tItem.status = 'editing';
			}
		}
	}
	for (const tItem of TalkScript) {
		if (tItem.type === 'node' && tItem.parent === '#') {
			let isEditing = true;
			for (const tItemj of TalkScript) {
				if (tItemj.parent === tItem.id) {
					if (tItemj.status === 'published') {
						isEditing = false;
					}
				}
			}
			if (isEditing) {
				tItem.status = 'editing';
			}
		}
	}
}
