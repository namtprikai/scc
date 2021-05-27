import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import Pie from '@/components/Charts/Pie.vue';
import ScenarioParent from '@/views/scenario/index';
import { Ajax } from '@/utils/parts';
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';

import ScenarioTemp from '@/components/ScenarioTemp/index.vue';
import { PRODUCT_ID, subsystemUrl, scriptUrl } from '@product/utils/configration';
import BotcsvParent from '@/views/botcsv';
import { ScriptMatchingManager } from '@sciseed/kctools/qaRetrieval';
import csvSync from 'csv-parse/lib/sync';
import { BotConfigModule } from '@/store/modules/botConfig';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
import EditWrap from '@/components/EditWrap/index.vue';
function cleanText(text: string) {
	return text && text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)).toLowerCase();
}
const Encoding = require('encoding-japanese');
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	components: { PieChart: Pie },
})
export default class ScriptTesterParent extends Vue {
	packageFileName = 'bot_package';
	protected evaluate: any = {};
	protected file: any = {};
	protected ajax = new Ajax();
	chartShow = true;
	options = [
		// { text: "完全一致", value: "one" },
		{ text: '一致', value: 'icchi' },
		{ text: '不一致', value: 'k' },
	];

	listLoading = false;
	protected submitScript() {
		if (this.file.name) {
			this.$modal.show('dialog', {
				title: `CSVを送信してよろしいでしょうか？<div class="text-center">${this.file.name}</div>`,
				buttons: [
					{
						title: 'OK',
						handler: () => {
							this.$modal.hide('dialog');
							this.sendScriptScriptTester();
						},
					},
					{
						title: 'CANCEL',
						handler: () => {
							this.$modal.hide('dialog');
						},
					},
				],
			});
		}
	}

	resetEvaluate() {
		this.evaluate = {};
		this.evaluate.ng_list_top_k = [];
		this.evaluate.ng_list_top_one = [];
		this.evaluate.ng_list_top_icchi = [];
		this.evaluate.num_of_matches = 0;
		this.evaluate.success_rate_top_one = 0;
		this.evaluate.success_rate_top_k = 0;
		this.evaluate.num_of_correct_matches_top_one = 0;
		this.evaluate.num_of_correct_matches_top_k = 0;
	}

	async sendScriptScriptTester() {
		const fileReader = new FileReader();
		fileReader.readAsArrayBuffer(this.file);
		let csvString: any = await new Promise((r: Function) => {
			fileReader.onload = () => {
				r(fileReader.result);
			};
		});
		csvString = new Uint8Array(csvString);
		const isSJIS = Encoding.detect(csvString);
		if (isSJIS === 'SJIS') {
			csvString = Encoding.convert(csvString, {
				to: 'UTF8', // to_encoding
				from: 'SJIS', // from_encoding
			});
			csvString = new Uint8Array(csvString);
		}
		csvString = new TextDecoder('utf-8').decode(csvString);
		console.log(csvString);
		const csv = csvSync(csvString);
		console.log(csv);
		// const response = await this.ajax.http({
		// 	baseURL:'https://script.ai-x-supporter.com',
		// 	url: `${PRODUCT_ID}/bot_package.json`,
		// 	method: "GET"
		// });
		const response = await fetch(`https://script.ai-x-supporter.com/${PRODUCT_ID}/${this.packageFileName}.json?v=${Math.floor(Math.random() * 100)}`);
		const data = await response.json();
		// const data = response;
		const scriptMatchingManager = new ScriptMatchingManager({
			matchingScript: data.script,
			invertedIndex: data.inverted_index,
			keywordVariationsDict: data.synonym_dict,
			invPostProbDist: data.script_by_id,
			categoryData: data.talk_script.body,
		});
		this.resetEvaluate();
		for (let i = 0; i < csv.length; i++) {
			const row = csv[i];
			console.log(row);

			const [searchText, ans] = row;
			if (searchText == '') {
				continue;
			}
			this.evaluate.num_of_matches++;
			const ansList = scriptMatchingManager.search(cleanText(searchText));
			console.log(ansList);
			let ngflg = true;
			let onengflg = true;
			for (let j = 0; j < Math.min(3, ansList.length); j++) {
				const botRecText = data.script.find((o: any) => o.id == ansList[j].id);
				if (botRecText.text == ans) {
					if (j == 0) {
						this.evaluate.num_of_correct_matches_top_one++;
						ngflg = false;
						onengflg = false;
					}
					this.evaluate.num_of_correct_matches_top_k++;
					ngflg = false;
					break;
				}
			}
			if (onengflg) {
				this.evaluate.ng_list_top_one.push({ q: searchText, a: ans });
			}
			if (ngflg) {
				this.evaluate.ng_list_top_k.push({ q: searchText, a: ans });
			} else {
				this.evaluate.ng_list_top_icchi.push({ q: searchText, a: ans });
			}
			this.evaluate.success_rate_top_one = this.evaluate.num_of_correct_matches_top_one / this.evaluate.num_of_matches;
			this.evaluate.success_rate_top_k = this.evaluate.num_of_correct_matches_top_k / this.evaluate.num_of_matches;
		}
		this.fetchChart();
		// const formData = new FormData();
		// this.listLoading = true;
		// formData.append("product_id", PRODUCT_ID);
		// console.log(this.file);
		// formData.append("file", this.file);
		// // new ScriptMatchingManager();
		// // this.evaluate={};
		// this.ajax
		// 	.http({
		// 		baseURL: `${scriptUrl}`,
		// 		url: `/evaluate/`,
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "multipart/form-data"
		// 		},
		// 		data: formData
		// 	})
		// 	.then(
		// 		(resp: any) => {
		// 			this.$modal.show("送信完了しました", {
		// 				title: "送信失敗",
		// 				text: "",
		// 				buttons: [
		// 					{
		// 						title: "はい",
		// 						handler: () => {
		// 							this.$modal.hide("dialog");
		// 						}
		// 					}
		// 				]
		// 			});
		// 			this.evaluate = resp;
		// 			this.fetchChart();
		// 			this.listLoading = false;
		// 		},
		// 		(resp: any) => {
		// 			console.log(resp);
		// 			this.$modal.show("dialog", {
		// 				title: "送信失敗",
		// 				text: "",
		// 				buttons: [
		// 					{
		// 						title: "はい",
		// 						handler: () => {
		// 							this.$modal.hide("dialog");
		// 						}
		// 					}
		// 				]
		// 			});
		// 		}
		// 	);
	}

	data = [
		{ name: '完全一致率', value: 0 },
		{ name: '完全一致率', value: 0 },
		{ name: '完全一致率', value: 0 },
	];

	labels = [
		// "完全一致率",
		// "一致率 - 完全一致率",
		'一致',
		'不一致',
	];

	fetchChartId: any = null;
	fetchChart() {
		if (this.fetchChartId != null) {
			clearTimeout(this.fetchChartId);
		}
		this.fetchChartId = setTimeout(() => {
			this.data = [
				// { name: "完全一致率", value: this.getSuccessRateOne() },
				// {
				// 	name: "一致率 - 完全一致率",
				// 	value: this.getSuccessRateK() - this.getSuccessRateOne()
				// },
				{
					name: '一致',
					value: this.getSuccessRateK(),
				},
				{ name: '不一致', value: 100 - this.getSuccessRateK() },
			];
		}, 500);
	}

	colors = ['#8CB2C6', '#D7D7D7', '#F63D41'];
	currentShow = 'k';
	getNglist() {
		if (!this.evaluate) {
			return [];
		}
		if (this.currentShow == 'one') {
			return this.evaluate.ng_list_top_one || [];
		}
		if (this.currentShow == 'k') {
			return this.evaluate.ng_list_top_k || [];
		}
		if (this.currentShow == 'icchi') {
			return this.evaluate.ng_list_top_icchi || [];
		}
	}

	@Watch('currentShow')
	changecurrentShow() {
		console.log('currentShow');
		this.chartShow = false;
		setTimeout(() => {
			this.chartShow = true;
		}, 1000);
	}

	getNum_of_matches() {
		return this.evaluate.num_of_matches || 0;
	}

	getSuccessRateOne() {
		return this.evaluate.success_rate_top_one * 100;
	}

	getSuccessRateK() {
		return this.evaluate.success_rate_top_k * 100;
	}

	getCorrectMatcheOne() {
		return this.evaluate.num_of_correct_matches_top_one;
	}

	getCorrectMatcheK() {
		return this.evaluate.num_of_correct_matches_top_k;
	}
	// EscapeSJIS(str: string) {
	// 	return str.replace(/[^*+.-9A-Z_a-z-]/g, function(s) {
	// 		var c = s.charCodeAt(0),
	// 			m;
	// 		return c < 128
	// 			? (c < 16 ? "%0" : "%") + c.toString(16).toUpperCase()
	// 			: 65376 < c && c < 65440
	// 			? "%" + (c - 65216).toString(16).toUpperCase()
	// 			: (c = JCT11280.indexOf(s)) < 0
	// 			? "%81E"
	// 			: "%" +
	// 			  ((m =
	// 					((c < 8272 ? c : (c = JCT11280.lastIndexOf(s))) - (c %= 188)) /
	// 					188) < 31
	// 					? m + 129
	// 					: m + 193
	// 			  )
	// 					.toString(16)
	// 					.toUpperCase() +
	// 			  ((64 < (c += c < 63 ? 64 : 65) && c < 91) ||
	// 			  95 == c ||
	// 			  (96 < c && c < 123)
	// 					? String.fromCharCode(c)
	// 					: "%" + c.toString(16).toUpperCase());
	// 	});
	// }
}
