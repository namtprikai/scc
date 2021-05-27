// const fs = require('fs');
// const csvSync = require('csv-parse/lib/sync');
import { BotConfig, BotConfigFlow } from './scenario';
import { TalkScript, RootTalkScript } from './script';
import csvParser from 'csv-parse';
import csvPtringify from 'csv-stringify';
// import talkScript from '../../components/FaqClientPage/talkScriptApi';
// import { Scenario } from '../../../products/185/store/modules/scenario';
const moment = require('moment');
// const talkScript = JSON.parse(fs.readFileSync("./talkScript.json", "utf-8"));
// const scenario: BotConfig = JSON.parse(fs.readFileSync("./scenario.json", "utf-8"));
interface RowObject {
	scenarioId: string;
	status?: 'published' | 'editing';
	keyWords: Array<string>;
	leafTitle: string;
	menu: Array<string>;
	updateDate: string;
	scenario: Array<Array<string>>;
}
interface ScenarioGroupInterface {
	// getStep(stepId: string): BotConfigStep;
}
interface ScriptGroupInterface<T> {
	getMenuListByScenarioId: (scenarioId: string) => Array<string>;
	getScriptByScenarioId: (scenarioId: string) => T | undefined;
	getScriptList: () => Array<T>;
}
class ScenarioGroup implements ScenarioGroupInterface {
	constructor(private scenario: BotConfig) {}
	private leafSize(flow: BotConfigFlow) {
		if (flow.next.length > 0) {
			let size = 0;
			for (const childFlow of flow.next) {
				size += leafSize(childFlow);
			}
			return size;
		} else {
			return 1;
		}
	}
	// getStep(stepId: string): BotConfigStep {
	//     for (const [stepKey, step] of Object.entries(this.scenario.steps)) {
	//         if (stepKey === stepId) {
	//             return step;
	//         }
	//     }
	// }
}
class ScriptGroup implements ScriptGroupInterface<TalkScript> {
	constructor(private scriptList: Array<TalkScript>) {}
	public getMenuListByScenarioId(scenarioId: string): Array<string> {
		let parentId = '#';
		const retMenuList = [];
		for (const script of this.scriptList) {
			if (script.scenario === scenarioId) {
				parentId = script.parent;
				retMenuList.unshift(script.text);
				break;
			}
		}
		if (retMenuList.length == 0) {
			return retMenuList;
		}
		let flg = true;
		while (parentId != '#' && flg) {
			flg = false;
			for (const script of this.scriptList) {
				if (script.id === parentId) {
					parentId = script.parent;
					retMenuList.unshift(script.text);
					flg = true;
				}
			}
		}
		return retMenuList;
	}

	getScriptByScenarioId(scenarioId: string): TalkScript | undefined {
		for (const script of this.scriptList) {
			if (script.scenario == scenarioId) {
				return script;
			}
		}
		return undefined;
	}

	getScriptList() {
		return this.scriptList;
	}
}
export async function Main(talkScript: Array<TalkScript>, scenario: BotConfig) {
	const talkScriptGroup = new ScriptGroup(talkScript);
	const scenarioGroup = new ScenarioGroup(scenario);
	const rowList: Array<RowObject> = [];
	for (const flow of scenario.flow.next) {
		const row: RowObject = {
			leafTitle: '',
			menu: [],
			scenarioId: '',
			scenario: [],
			keyWords: [],
			updateDate: '',
		};
		row.menu = talkScriptGroup.getMenuListByScenarioId(flow.id);
		const currentScript = talkScriptGroup.getScriptByScenarioId(flow.id);
		row.scenarioId = flow.id;
		if (flow.items?.update_date) {
			if (Array.isArray(flow.items.update_date)) {
				row.updateDate = `${flow.items.update_date[0]}`;
			} else {
				row.updateDate = `${flow.items.update_date}`;
			}
		}
		console.log('currentScript');
		console.log(flow.id);
		console.log(currentScript);
		// if (flow.condition.type == 'text' && !flow.action.items.is_search) {
		// 	continue;
		// }
		if (currentScript && currentScript.questions) {
			row.keyWords = currentScript.questions;
			row.status = currentScript.status;
		}

		if (row.menu.length > 0) {
			row.leafTitle = row.menu[row.menu.length - 1];
		} else {
		}
		row.scenario = makeScenarioArray(flow);
		rowList.push(row);
		console.table(row.scenario);
	}
	const csvArray: Array<Array<string>> = [];
	let MaxScenario = 0;
	let MaxMenu = 0;
	for (const row of rowList) {
		MaxScenario = Math.max(MaxScenario, row.scenario.length);
		MaxMenu = Math.max(MaxMenu, row.menu.length);
	}
	const csvString = '';
	csvArray.push(['1', '2', '3']);
	for (let i = 0; i < MaxMenu; i++) {
		csvArray[0].push('4');
	}
	csvArray[0].push('5');
	csvArray[0].push('6');
	for (let i = 0; i < MaxScenario; i++) {
		csvArray[0].push('7');
	}

	// let rowIndex=0;
	for (const row of rowList) {
		csvArray.push([]);

		csvArray[csvArray.length - 1].push(row.scenarioId.replace(/^s/, ''));
		csvArray[csvArray.length - 1].push(row.status == 'published' ? '1' : '0');
		csvArray[csvArray.length - 1].push(moment(row.updateDate).format('YYYY/MM/DD'));
		for (let i = 0; i < MaxMenu; i++) {
			csvArray[csvArray.length - 1].push(row.menu[i] || '');
		}
		csvArray[csvArray.length - 1].push(row.keyWords.join('\n'));
		csvArray[csvArray.length - 1].push(row.leafTitle);
		const scenarioPosition = csvArray[csvArray.length - 1].length;
		for (let i = 0; i < MaxScenario; i++) {
			csvArray[csvArray.length - 1].push(row.scenario[0][i] || '');
		}
		for (let i = 1; i < row.scenario.length; i++) {
			csvArray.push([]);
			for (let j = 0; j < scenarioPosition; j++) {
				csvArray[csvArray.length - 1].push('');
			}
			for (let j = 0; j < row.scenario[i].length; j++) {
				csvArray[csvArray.length - 1].push(row.scenario[i][j]);
			}
		}
	}
	// fs.writeFileSync(`./allinone.csv`, csvArray.map(a => a.map(b => `"${b}"`).join(',')).join('\n'));
	return await new Promise(r => {
		csvPtringify(csvArray, { quoted: true }, (err, records) => {
			r(records);
		});
	}); // .map(a => a.map(b => `"${b}"`).join(',')).join('\n');
	function makeScenarioArray(scenario: BotConfigFlow): Array<Array<string>> {
		const retArray: Array<Array<string>> = [];
		// retArray[0] = [scenario.condition.value];
		let rowCount = 0;
		// for (const childScenario of scenario.next) {
		ScenarioCrawler(scenario, (sc, depth) => {
			console.log(`anser:${sc.text} , question:${sc.label}`);
			while (retArray[rowCount] == null) {
				retArray.push([]);
			}
			while (retArray[rowCount].length < depth * 2) {
				retArray[rowCount].push('');
			}

			// console.log('retArray');
			// console.table(retArray);
			let itemTagString = '';
			for (const [itemKey, itemValue] of Object.entries(sc.items)) {
				if (itemKey.match(/^log_/) && Array.isArray(itemValue)) {
					for (const item of itemValue) {
						itemTagString += `<${itemKey.replace(/_/g, '-')}:${item}>`;
					}
				}
			}
			retArray[rowCount][depth * 2] = String(sc.text).replace(/<(button|link):.+?>/g, '') + itemTagString;

			if (depth > 0) {
				retArray[rowCount][depth * 2 - 1] = String(sc.label).replace(/^\d+\./, '');
			}
			if (!sc.next || sc.next.length == 0) {
				rowCount += 1;
			}
		});
		// }
		return retArray;
		function ScenarioCrawler(scenario: BotConfigFlow, fn: (scenario: BotConfigFlow, depth: number) => void, parent = 'root', depth = 0) {
			// const step = scenarioGroup.getStep(scenario.step);
			// const parentStep = scenarioGroup.getStep(parent);
			fn(scenario, depth);
			for (const sc of scenario.next) {
				ScenarioCrawler(sc, fn, scenario.id, depth + 1);
			}
		}
	}
}
export function leafSize(flow: BotConfigFlow) {
	if (flow.next.length > 0) {
		let size = 0;
		for (const childFlow of flow.next) {
			size += leafSize(childFlow);
		}
		return size;
	} else {
		return 1;
	}
}
