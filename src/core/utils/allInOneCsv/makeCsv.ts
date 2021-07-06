// const fs = require('fs');
// const csvSync = require('csv-parse/lib/sync');
import { BotConfig, BotConfigFlow, OldScenario } from "./scenario";
import { TalkScript, RootTalkScript } from "./script";
import { OTHER_TEXT } from "./makeScript";
import csvPtringify from "csv-stringify";
// import talkScript from '../../components/FaqClientPage/talkScriptApi';
// import { Scenario } from '../../../products/185/store/modules/scenario';
const moment = require("moment");
// const talkScript = JSON.parse(fs.readFileSync("./talkScript.json", "utf-8"));
// const scenario: BotConfig = JSON.parse(fs.readFileSync("./scenario.json", "utf-8"));
interface RowObject {
	scenarioId: string;
	status?: "published" | "editing";
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
const IdLabelMapper = new Map();
IdLabelMapper.set("1", "ID").set("2", "非公開フラグ").set("3", "最終更新日").set("4", "メニュー").set("5", "キーワード").set("6", "Q").set("7", ["A", "選択肢"]);
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
		let parentId = "#";
		const retMenuList = [];
		for (const script of this.scriptList) {
			if (script.scenario === scenarioId || script.items.scenario_id === scenarioId) {
				parentId = script.parent;
				retMenuList.unshift(script.text);
				break;
			}
		}
		if (retMenuList.length == 0) {
			return retMenuList;
		}
		let flg = true;
		while (parentId != "#" && flg) {
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
	public getObjectMenuListByScenarioId(scenarioId: string): Array<TalkScript> {
		let parentId = "#";
		const retMenuList = [];
		for (const script of this.scriptList) {
			if (script.scenario === scenarioId || script.items.scenario_id === scenarioId) {
				parentId = script.parent;
				retMenuList.unshift(script);
				break;
			}
		}
		if (retMenuList.length == 0) {
			return retMenuList;
		}
		let flg = true;
		while (parentId != "#" && flg) {
			flg = false;
			for (const script of this.scriptList) {
				if (script.id === parentId) {
					parentId = script.parent;
					retMenuList.unshift(script);
					flg = true;
				}
			}
		}
		return retMenuList;
	}
	getScriptByScenarioId(scenarioId: string): TalkScript | undefined {
		for (const script of this.scriptList) {
			if (script.scenario == scenarioId || script.items.scenario_id === scenarioId) {
				return script;
			}
		}
		return undefined;
	}

	getScriptList() {
		return this.scriptList;
	}
}
/**
 * @param  {OldScenario.BotConfig} 旧フォーマット
 * @returns BotConfig　新フォーマット
 */
export function changeNewBotConfig(_botConfig: OldScenario.BotConfig): BotConfig {
	const botConfig: OldScenario.BotConfig = JSON.parse(JSON.stringify(_botConfig));
	const oldBotConfig: BotConfig = {
		title: botConfig.scenario.title,
		description: botConfig.scenario.description,
		flow: {
			step: "init",
			next: convertFlow(botConfig.scenario.flow.root.next, botConfig.scenario.steps),
		},
	};
	return oldBotConfig;
	function convertFlow(_flows: Array<OldScenario.BotConfigFlow>, steps: { [key: string]: OldScenario.BotConfigStep }, parent?: OldScenario.BotConfigFlow): Array<BotConfigFlow> {
		const flows: Array<BotConfigFlow> = JSON.parse(JSON.stringify(_flows));
		cloler(flows, parent);
		return flows;
		function cloler(_flow: Array<any>, parentFlow: any) {
			for (let __flow of _flow) {
				__flow = {
					id: __flow.step,
					label: parentFlow ? __flow.step : parentFlow.condition.value,
					type: steps[__flow.step].action.success.type,
					text: steps[__flow.step].action.success.value,
					items: steps[__flow.step].action.success.items,
				};
				if (__flow.next && __flow.next.length > 0) {
					cloler(__flow.next, __flow);
				}
			}
		}
	}
}
export async function Main(talkScript: Array<TalkScript>, scenario: BotConfig, isOutputTag = false): Promise<string> {
	const talkScriptGroup = new ScriptGroup(talkScript);
	const scenarioGroup = new ScenarioGroup(scenario);
	const rowList: Array<RowObject> = [];
	const sortedScenarioNext = scenario.flow.next.sort((a: BotConfigFlow, b: BotConfigFlow) => {
		const positionLista = talkScriptGroup.getObjectMenuListByScenarioId(a.id).map((t) => t.position || 0);
		const positionListb = talkScriptGroup.getObjectMenuListByScenarioId(b.id).map((t) => t.position || 0);
		for (let i = 0; i < Math.min(positionLista.length, positionListb.length); i++) {
			if (positionLista[i] > positionListb[i]) {
				return 1;
			}
			if (positionLista[i] < positionListb[i]) {
				return -1;
			}
		}
		return 0;
	});
	for (const flow of sortedScenarioNext) {
		if (flow.items.is_category) {
			continue;
		}
		const row: RowObject = {
			leafTitle: "",
			menu: [],
			scenarioId: "",
			scenario: [],
			keyWords: [],
			updateDate: "",
		};
		// 自然文検索を削除
		row.menu = talkScriptGroup.getMenuListByScenarioId(flow.id).map((st) => (st === OTHER_TEXT ? "" : st));
		const currentScript = talkScriptGroup.getScriptByScenarioId(flow.id);
		row.scenarioId = flow.id;
		if (flow.items?.update_date) {
			if (Array.isArray(flow.items.update_date)) {
				row.updateDate = `${flow.items.update_date[0]}`;
			} else {
				row.updateDate = `${flow.items.update_date}`;
			}
		}

		console.log("currentScript");
		console.log(flow.id);
		console.log(currentScript);
		// if (!flow.items.is_search) {
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
		for (const scenarioRow of row.scenario) {
			MaxScenario = Math.max(MaxScenario, scenarioRow.length);
			// break;
		}
		MaxMenu = Math.max(MaxMenu, row.menu.length - 1);
	}
	const csvString = "";
	csvArray.push(["1", "2", "3"]);
	for (let i = 0; i < MaxMenu; i++) {
		csvArray[0].push("4");
	}
	csvArray[0].push("5");
	csvArray[0].push("6");
	for (let i = 0; i < MaxScenario; i++) {
		csvArray[0].push("7");
	}
	// csvArray.push([]);
	let labelcount = 0;
	let oldCellId = null;
	let count = 0;
	for (const cellid of csvArray[0]) {
		const label = IdLabelMapper.get(cellid);
		if (oldCellId !== cellid) {
			labelcount = 0;
		} else {
			labelcount++;
		}
		if (Array.isArray(label)) {
			csvArray[0][count] = `${csvArray[0][count]}(${label[labelcount % label.length]})`;
		} else {
			csvArray[0][count] = `${csvArray[0][count]}(${label})`;
		}

		oldCellId = cellid;
		count++;
	}
	// let rowIndex=0;
	for (const row of rowList) {
		csvArray.push([]);

		csvArray[csvArray.length - 1].push(row.scenarioId || "");
		csvArray[csvArray.length - 1].push(row.status == "editing" ? "1" : "");
		csvArray[csvArray.length - 1].push(row.updateDate && /^\d+$/.test(row.updateDate) ? moment(parseInt(row.updateDate, 10)).format("YYYY/MM/DD") : "");
		for (let i = 0; i < MaxMenu; i++) {
			csvArray[csvArray.length - 1].push(row.menu[i] || "");
		}
		csvArray[csvArray.length - 1].push(row.keyWords.join("\n"));
		csvArray[csvArray.length - 1].push(row.leafTitle);
		const scenarioPosition = csvArray[csvArray.length - 1].length;
		for (let i = 0; i < MaxScenario; i++) {
			csvArray[csvArray.length - 1].push(row.scenario[0][i] || "");
		}
		for (let i = 1; i < row.scenario.length; i++) {
			csvArray.push([]);
			for (let j = 0; j < scenarioPosition; j++) {
				csvArray[csvArray.length - 1].push("");
			}
			for (let j = 0; j < row.scenario[i].length; j++) {
				csvArray[csvArray.length - 1].push(row.scenario[i][j]);
			}
		}
	}
	// fs.writeFileSync(`./allinone.csv`, csvArray.map(a => a.map(b => `"${b}"`).join(',')).join('\n'));
	let maxRowSize = 0;
	for (const row of csvArray) {
		maxRowSize = Math.max(maxRowSize, row.length);
	}
	for (const row of csvArray) {
		while (maxRowSize >= row.length) {
			row.push("");
		}
	}
	return await new Promise((r) => {
		csvPtringify(csvArray, { quoted: true }, (err, records) => {
			r(records || "");
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
				retArray[rowCount].push("");
			}

			// console.log('retArray');
			// console.table(retArray);
			let itemTagString = "";
			if (sc.items && isOutputTag) {
				for (const [itemKey, itemValue] of Object.entries(sc.items)) {
					if (itemKey.match(/^log_/) && Array.isArray(itemValue)) {
						for (const item of itemValue) {
							itemTagString += `<${itemKey.replace(/_/g, "-")}:${item}>`;
						}
					}
				}
			}

			retArray[rowCount][depth * 2] = String(sc.text).replace(/<(button|link):.+?>/g, "") + itemTagString;

			if (depth > 0) {
				retArray[rowCount][depth * 2 - 1] = String(sc.label).replace(/^\d+\./, "");
			}
			if (!sc.next || sc.next.length == 0) {
				rowCount += 1;
			}
		});
		// }
		return retArray;
		function ScenarioCrawler(scenario: BotConfigFlow, fn: (scenario: BotConfigFlow, depth: number) => void, parent = "root", depth = 0) {
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
