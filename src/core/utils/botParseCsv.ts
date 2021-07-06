const scenarioList = (data: any) => ({
	flow: data.scenario.flow,
	steps: data.scenario.steps,
});

const regexSelection = /<button:[0-9]+./;

const recursiveFlow = (result: any, flow: any, next: any, isRoot: any = false, selection?: any, deep: any = 0) => {
	// rootからの深さ計算
	deep++;

	// nodeごとに抽出
	next.forEach((n: any, index: any) => {
		// 選択肢(文字列)抽出
		let selectText = "";
		if (selection) {
			const btnText = selection[index];
			const cnt = String(btnText).search(/\./);
			// 選択肢の場合、<>を外す。それ以外はそのまま
			cnt > 0 ? (selectText = btnText.slice(cnt + 1, btnText.length - 1)) : (selectText = btnText);
		}
		// 選択肢を外したテキスト抽出
		let title = n.title;
		const stepItems = n.stepItems;
		let tagText = "";
		if (stepItems) {
			for (const itemKey in stepItems) {
				const logItemList = stepItems[itemKey];
				const itemKeyText = itemKey.replace(/_/g, "-");
				if (logItemList) {
					for (const logItemValue of logItemList) {
						if (logItemValue != "") {
							tagText += `<${itemKeyText}:${logItemValue}>`;
						}
					}
				}
			}
		}
		if (String(n.title).search(regexSelection) > 0) {
			title = n.title.slice(0, String(n.title).search(regexSelection));
			console.log(n);
		}

		// 先頭のnode
		if (index === 0) {
			if (isRoot) {
				flow.push(n.condition.value + tagText);
			}
			if (selectText) {
				flow.push(selectText + tagText);
			}
			flow.push(title);
		} else {
			// 2番目以降のnode
			if (isRoot) {
				flow = [n.condition.value + tagText, title];
			} else {
				const number = 2 * deep - 2;
				flow = [...new Array(number).fill(""), selectText + tagText, title];
			}
		}

		// leafかどうか <buttun 的なのがあるかどうか
		const isLeaf = n.next.length == 0;
		if (isLeaf) {
			// 配列に追加して終了
			return result.push(flow);
		}

		// 次の選択肢抽出
		let selects = n.next.map((d: any) => d.condition.value);
		// <buttun 的なのがあるかどうか。ある場合、type numberと判断する
		if (regexSelection.test(n.title)) {
			selects = n.title.match(/<button:[0-9]+\..+?>/g);
			console.log(selects);
		}

		return recursiveFlow(result, flow, n.next, false, selects, deep);
	});
};

export namespace BotParseCsv {
	export const parse = (bot_csv: any) => parseCSVToArray(bot_csv);
}

function searchScenario(next: Array<any>, fn: Function) {
	for (const flow of next) {
		fn(flow);
		if ("next" in flow) {
			searchScenario(flow.next, fn);
		}
	}
}
function parseCSVToArray(bot_csv: any) {
	const sceneario = scenarioList(bot_csv);
	const result: any = [];
	const flow: any = [];
	searchScenario(sceneario.flow.root.next, (flow: any) => {
		try {
			const items = sceneario.steps[flow.step].action.success.items;
			flow.stepItems = items;
		} catch (e) {}
	});
	// 再帰処理
	recursiveFlow(result, flow, sceneario.flow.root.next, true);

	// 配列の最大値を抽出
	const max =
		Math.max.apply(
			null,
			result.map((record: any) => record.length),
		) + 1;
	result.unshift([""]);
	// 配列を文字列の,区切りにする
	return result
		.map((record: any) => {
			record.splice(1, 0, "");
			let data = record.map((column: any, index: number) => {
				// ダブルクォーテーションをエスケープ
				if (String(column).indexOf('"') !== -1) {
					column = `${column.trim().replace(/"/g, "'")}`;
				}
				// 改行コードが入っている場合、"で括る
				// if (String(column).indexOf("\n") !== -1) {
				column = `"${column}"`;
				// }
				return column;
			});
			const len = data.length;
			if (max > len) {
				// 配列の数を一致させるため空文字をいれる
				data = [...data, ...new Array(max - len).fill("")];
			}
			return data.join(",");
		})
		.join("\r\n");
}
