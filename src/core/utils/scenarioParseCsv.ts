import { Scenario, ScenarioFlow } from "@/store/modules/scenario";

function search(flowList: Array<ScenarioFlow>, parentStep: string, fn: Function, depth = 0) {
	if (flowList) {
		let index = 0;
		let beforeLeafSize = 0;
		let beforeLeaf = null;
		for (const flow of flowList) {
			fn({ flow, parentStep, index, depth, beforeLeafSize });
			if (flow.next.length > 0) {
				search(flow.next, flow.step, fn, depth + 1);
			}
			index++;
			if (beforeLeaf) {
				beforeLeafSize = leafSize(beforeLeaf);
			}
			beforeLeaf = flow;
		}
	}
}
function search2(flowList: Array<ScenarioFlow>, parentStep: string, fn: Function, depth = 0) {
	const que = [];
	let y = 0;
	let leafSizeNumber = 0;
	let bDepth = 0;
	let index = 0;
	for (const flow of flowList) {
		que.push({ flow, depth, y, index });
		leafSizeNumber = leafSize(flow);
		y += leafSizeNumber;
		console.log(y);
		index++;
	}
	while (que.length > 0) {
		const o: any = que.shift();
		if (o.depth != bDepth) {
			y = 0;
			o.y = 0;
			bDepth = o.depth;
		}
		fn(o);
		for (let i = 0; i < o.flow.next.length; i++) {
			que.push({
				flow: o.flow.next[i],
				depth: o.depth + 1,
				index: i,
				y,
				parentFlow: o.flow,
			});
			if (i > 0) {
				// for (let j = 0; j < i - 1; j++) {
				// 	y += leafSize(o.flow.next[j]);
				// }
				y += leafSize(o.flow.next[i - 1]);
			}
		}
	}
}
export function leafSize(flow: ScenarioFlow) {
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
export const parseListToCsv = (scenarioList: Array<Scenario>) => {
	let csvListList: any = [];
	for (let i = 0; i < scenarioList.length; i++) {
		const scenario: any = scenarioList[i];
		const bIndex = 0;
		const csvList: any = [];
		let leafCount = 0;
		search(
			scenario.flow,
			"#",
			(ob: { flow: ScenarioFlow; depth: number; y: number; parentFlow?: any }) => {
				console.log(`${leafCount}:::depth${ob.depth}`);
				while (csvList.length <= leafCount) {
					csvList.push([]);
				}
				const row = csvList[leafCount];
				while (row.length - 1 <= ob.depth * 2 + 1) {
					row.push("");
				}
				const step = scenario.step[ob.flow.step];
				let itemString = "";
				if (step.scenarioId) {
					itemString += `<scenario-id:${step.scenarioId}>`;
				}
				if (step.items) {
					for (const itemKey in step.items) {
						itemString += `<${itemKey.replace(/_/g, "-")}:${step.items[itemKey]}>`;
					}
				}
				row[ob.depth * 2] = step.title + itemString;
				row[ob.depth * 2 + 1] = step.text;
				if (ob.flow.next.length <= 0) {
					leafCount++;
				}
			},
			0,
		);

		csvListList = csvListList.concat(csvList);
		// for (let j = 0; j < scenario.flow.length; j++) {
		// 	const flowItem = scenario.flow[j];
		// 	const size = leafSize(flowItem);

		// 	console.log(flowItem);
		// 	console.log(size);
		// }
	}
	csvListList.unshift(["", ""]);
	let maxX = 0;
	for (const csvRow of csvListList) {
		maxX = Math.max(maxX, csvRow.length);
	}
	for (const csvRow of csvListList) {
		while (csvRow.length <= maxX) {
			csvRow.push("");
		}
	}
	return csvListList.map((row: any) => {
		row.splice(1, 0, "");
		return row;
	});
};
export const parseCsvToList = (csvFile: any) => {};
export const parseScenario = (bot_json_list: any) => {
	const scenarioList = [];
	for (let h = 0; h < bot_json_list.length; h++) {
		const bot_json = bot_json_list[h];
		console.log("bot_json");
		console.log(bot_json);
		const scenarioObj: any = {
			id: "",
			type: "",
			title: "",
			value: bot_json[0].value,
			step: {},
			flow: [],
			scenarioId: bot_json[0].scenario,
			bname: "",
		};
		let flow: any = {
			step: "",
			condition: { value: bot_json[0].scenario || "" },
			next: [],
		};
		bot_json.forEach((o: any, i: any, ar: any) => {
			// if(!o.is_root){
			const TITLE_TEXT = o.title;
			// const title = TITLE_TEXT.replace(/(<log-faq:.+?>)|(<log-scenario:.+?>)|(<log-faq-link:.+?>)/g, '');
			// const log_faqMATCH = TITLE_TEXT.match(/<log-faq:(.+?)>/);
			// const log_scenarioMATCH = TITLE_TEXT.match(/<log-scenario:(.+?)>/);
			// const log_faq_linkMATCH = TITLE_TEXT.match(/<log-faq-link:(.+?)>/);

			const items = o.log_items;
			// if (log_faqMATCH) {
			// 	log_faq = log_faqMATCH[1];
			// }
			// if (log_scenarioMATCH) {
			// 	log_scenario = log_scenarioMATCH[1];
			// }
			// if (log_faq_linkMATCH) {
			// 	log_faq_link = log_faq_linkMATCH[1];
			// }
			scenarioObj.step[o.step] = {
				id: o.step,
				type: o.type,
				title: o.title.replace(/<log-(.+?):(.+?)>/g, ""),
				text: o.value,
				scenarioId: o.scenario,
				// tslint:disable-next-line:max-line-length
				options: o.options.map((p: any) => Object.assign(p, { value: p.value.replace(/(<log-.+?:.+?>)/g, "") })),
				items,
			};
			// }
			if (o.is_root) {
				scenarioObj.id = `${h}`;
				scenarioObj.type = o.type;
				scenarioObj.title = o.title;
				scenarioObj.bname = o.bname;
				// scenarioObj.text=o.value;
				const flowObj = {
					step: o.step,
					condition: { value: o.scenario || "" },
					next: [],
				};
				// if(o.type=="q"){
				flow = flowObj;
				flow.step = o.step;
				// }
			}
		});
		if (flow.step !== "") {
			scenarioObj.flow.push(flow);
			parse([flow], bot_json);
		}
		scenarioList.push(scenarioObj);
	}
	return scenarioList;
	function parse(objList: any, bot_json: any) {
		for (let i = 0; i < objList.length; i++) {
			const flowObj = objList[i];
			const bot_jsonItem = getObjForId(flowObj.step);
			if (bot_jsonItem.hasOwnProperty("nextSteps")) {
				if (bot_jsonItem.nextSteps.length == 0) {
					continue;
				}
			}
			const nextNameList = bot_jsonItem.nextSteps;
			const nexts = bot_json
				.filter((o: any) => nextNameList.indexOf(o.step) !== -1)
				.map((o: any) => {
					console.log(o);
					return {
						condition: {
							value: o.scenarioId || o.title.replace(/(<log-.+?:.+?>)/g, ""),
						},
						step: o.step,
						next: [],
					};
				});
			flowObj.next = nexts;
			parse(nexts, bot_json);
		}
	}
	function getObjForId(id: any) {
		for (let i = 0; i < bot_json_list.length; i++) {
			for (let j = 0; j < bot_json_list[i].length; j++) {
				if (bot_json_list[i][j].id == id) {
					return bot_json_list[i][j];
				}
			}
		}
		return {};
	}
};
export const horizontaltojson = (bot_csv: any) => {
	const rootKeyList = [];
	// rootkey 作る
	const X = 0;
	for (let i = 1; i < bot_csv.length; i++) {
		if (!is_null(bot_csv[i][X])) {
			rootKeyList.push({
				x: X,
				y: i,
			});
		}
	}
	console.log(rootKeyList);
	const list = [];
	let rootList = [];
	rootList = rootKeyList.map((o) => {
		const TITLETEXT = bot_csv[o.y][o.x];
		const title = TITLETEXT.replace(/(<log-.+?:.+?>)/g, "");
		const matchScenarioId = TITLETEXT.match(/<scenario-id:(.+?)>/);
		const scenario = title;
		let scenarioId = "";
		if (matchScenarioId) {
			scenarioId = matchScenarioId[1];
		}
		return { id: scenarioId || scenario, title };
	});
	const stepSet = new Set();
	for (let h = 0; h < rootKeyList.length; h++) {
		let child_list: any = [];
		start([rootKeyList[h]], (o_: any, i: any) => {
			let nextNumber = 1;
			let SCENARIO_ID = "";
			if (is_onenext(o_.x, o_.y, bot_csv)) {
				nextNumber = 1;
			}
			if (o_.x == 0) {
				nextNumber = 2;
				SCENARIO_ID = bot_csv[o_.y][o_.x];
				const MATCH_SCENARIO_ID = SCENARIO_ID.match(/<scenario-id:(.+?)>/);
				if (MATCH_SCENARIO_ID) {
					SCENARIO_ID = MATCH_SCENARIO_ID[1];
				}
			} else if (is_null(bot_csv[o_.y][o_.x + 1])) {
				nextNumber = 0;
			}
			const TITLETEXT = o_.x == 0 ? bot_csv[o_.y][o_.x] : bot_csv[o_.y][o_.x + nextNumber - 1];
			const title = String(TITLETEXT)
				.replace(/(<log-.+?:.+?>)/g, "")
				.replace(/<scenario-id:(.+?)>/g, "");
			const scenario = SCENARIO_ID.replace(/(<log-.+?:.+?>)/g, "");
			// if (matchScenarioId) {
			// 	scenarioId = matchScenarioId[1];
			// }
			const conditionTEXT = o_.x == 0 ? bot_csv[o_.y][0] : String(i + 1);
			const log_itemsMATCH = conditionTEXT.match(/<log-(.+?):(.+?)>/g) || TITLETEXT.match(/<log-(.+?):(.+?)>/g);
			console.log(log_itemsMATCH);
			const log: any = {};
			if (log_itemsMATCH) {
				console.log(log_itemsMATCH);
				for (const matchTag of log_itemsMATCH) {
					const [_matchText, matchKey, matchId] = matchTag.match(/<(log-.+?):(.+?)>/);
					const matchKeySt = matchKey.replace(/\-/g, "_");
					if (!(matchKeySt in log)) {
						log[matchKeySt] = [];
					}
					log[matchKeySt].push(matchId);
					console.log(log);
				}
			}
			const log_items = log;
			if (!bot_csv[o_.y][o_.x + nextNumber]) {
				console.log("NONEVALUE");
				console.log(bot_csv[o_.y]);
			}
			let obj = {
				value: bot_csv[o_.y][o_.x + nextNumber],
				title, // id:o_.x==0?bot_csv[o_.y][0]:String(i+1),
				nexts: getNextsForValue(o_.x == 0 ? o_.x + 2 : o_.x + 1, o_.y, bot_csv),
				log_items,
				keyValue: bot_csv[o_.y][o_.x + nextNumber],
				position: `${o_.x + nextNumber}_${o_.y}`,
			};
			if (o_.x == X) {
				obj = Object.assign(obj, { is_root: true, scenario });
				console.log(scenario);
			} else {
				obj = Object.assign(obj, { is_root: false });
			}
			child_list.push(obj);
		});
		let stepIdCount = 0;
		child_list = child_list.map((o: any, i: any) => {
			let step;

			step = `C_${h}_${i + stepIdCount}`;
			while (stepSet.has(step)) {
				step = `C_${h}_${i + ++stepIdCount}`;
			}
			stepSet.add(step);
			return Object.assign(o, {
				step,
				id: step,
			});
		});

		child_list = child_list.map((o: any, i: any, ar: any) => {
			const options = o.nexts
				.map((_o: any, _i: any) => {
					const val = bot_csv[_o.y][_o.x + 1];
					return (
						ar.find((k: any) => k.position == `${_o.x + 1}_${_o.y}`) || {
							title: null,
						}
					).title;
				})
				// tslint:disable-next-line:no-shadowed-variable
				.filter((o: any) => o);
			const nextSteps = o.nexts
				.map((_o: any, _i: any) => {
					const val = bot_csv[_o.y][_o.x + 1];

					return (
						ar.find((k: any) => k.position == `${_o.x + 1}_${_o.y}`) || {
							step: null,
						}
					).step;
				})
				// tslint:disable-next-line:no-shadowed-variable
				.filter((o: any) => o);

			return Object.assign(o, { options, nextSteps });
		});
		for (let i = 0; i < child_list.length; i++) {
			if (child_list[i].options.length > 0) {
				child_list[i].type = "q";
			} else {
				child_list[i].type = "a";
			}

			child_list[i].options = child_list[i].options.map((o: any, j: any) => ({
				value: o,
			}));
			child_list[i].error_value = "すいません認識できませんでした";
			delete child_list[i].keyValue;
			// delete list[i].nextSteps;
			delete child_list[i].nexts;
		}

		list.push(child_list);
	}
	return list;
	// @ values :Array<{x:number,y:number}>
	function start(values: any, callback: any) {
		for (let i = 0; i < values.length; i++) {
			callback(values[i], i);
			const nexts = getNextsForValue(values[i].x == 0 ? values[i].x + 2 : values[i].x + 1, values[i].y, bot_csv);
			if (nexts.length !== 0) {
				start(nexts, callback);
			}
		}
	}
	// value座標からx,y座標セットの配列を取得する関数
	function getNextsForValue(x: any, y: any, table: any) {
		const value = [];
		let count = 0;
		// if(String(table[y][x]).match(/any/i)){
		// 	return [{x:x+1,y:y}];
		// }
		while (true) {
			try {
				// tslint:disable-next-line:no-unused-expression
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
			value.push({
				x: x + 1,
				y,
			});
			y++;
			count++;
		}
		return value;
	}
	// tslint:disable-next-line:no-shadowed-variable
	function makeValue(text: any, x: any, y: any, bot_csv: any) {
		let retValue = "";
		const matchTag = is_image(text);
		if (matchTag) {
			retValue = text.replace(matchTag[0], "");
		} else {
			retValue = `${text}\n${getStringValueForValue(x, y, bot_csv)}`;
		}
		return retValue;
	}
	function is_image(text: any) {
		return String(text).match(/<imagemap:(.+?)>/);
	}
	// tslint:disable-next-line:no-shadowed-variable
	function parse(list = [], callBack: any) {
		if (list.length !== 0) {
			callBack(list);
			for (let i = 0; i < list.length; i++) {
				parse(list[i], callBack);
			}
		}
	}
	function is_onenext(x: any, y: any, table: any) {
		return getSelects(x, y, table).length == 1;
	}
	function getStringValueForValue(x: any, y: any, table: any) {
		if (getSelects(x, y, table).length <= 1) {
			return "";
		}
		return getSelects(x, y, table)
			.map((o: any, i: any) => `<button:${i + 1}.${o}>`)
			.join("\n");
	}
	function getSelects(x: any, y: any, table: any) {
		const value: any = [];
		let count = 0;
		while (true) {
			try {
				// tslint:disable-next-line:no-unused-expression
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
	function is_null(val: any) {
		return !(val && val.trim().length > 0);
	}
	return bot_csv;
};
