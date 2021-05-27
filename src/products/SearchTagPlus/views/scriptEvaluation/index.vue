<template>
	<div class>
		<TabHeader>
			<b-button
				class="ml-2"
				size="sm"
				variant="primary"
				@click="evaluationStart"
				v-if="file"
				>分析</b-button
			>
			<b-button
				class="ml-2"
				size="sm"
				@click="csvDownload"
				:disabled="!isResultShow"
				>CSVダウンロード</b-button
			>
		</TabHeader>
		<div class="tab-body">
			<b-alert show variant="info" v-if="discription">
				<span
					class="text-discription __Info"
					v-html="$sanitize(discription)"
				></span>
			</b-alert>
			<div class="section">
				<div class>
					<!-- <FileInputWidget
						class=""
						placeholder="分析用CSVファイルを選択又はここにファイルをドラッグしてください。"
						dropPlaceholder="ここにファイルをドラッグしてください"
						@input="fileChanged"
					/>-->
					<b-form-file
						accept=".csv"
						v-model="file"
						:state="Boolean(file)"
						placeholder="分析用CSVファイルを選択又はここにファイルをドラッグしてください。"
						drop-placeholder="ここにファイルをドラッグしてください"
						browse-text="選択"
					></b-form-file>
				</div>
				<div class="section text-center" v-if="file">
					<b-button class variant="primary" size="lg" @click="evaluationStart"
						>分析</b-button
					>
				</div>
			</div>
			<div class="script-evaluation_contents" v-if="isResultShow">
				<el-tabs type="border-card" class="script-evaluation_content__tabs">
					<el-tab-pane label="円グラフ">
						<Pie titleText="精度検証結果" :data="ChartData" />
					</el-tab-pane>
					<el-tab-pane label="テーブル表示">
						<b-form-select v-model="tableSelect" :options="tableSelectOptions" />
						<vue-good-table
							:columns="tableColumns"
							:rows="tableRows"
							:pagination-options="{
								enabled: true,
								perPage: 15,
								perPageDropdown: [10, 15, 30, 50],
								rowsPerPageLabel: '表示件数',
								mode: 'pages',
							}"
						></vue-good-table>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import csvSync from 'csv-parse/lib/sync';
const Encoding = require('encoding-japanese');
import { PRODUCT_ID, subsystemUrl, scriptUrl } from '../../utils/configration';
import { ScriptMatchingManager } from '@sciseed/kctools/qaRetrieval';
import { Pie, Type } from '@/components/Charts';
import { BIconBraces } from 'bootstrap-vue';
import { IVueGoodTableColumn } from '../../components/TicketAnalyzer/index.i';
import _ from 'lodash';
import { FileInputWidget } from '@/components/Widgets';
import { ICSVHeader, CSVFactPlus } from '@/utils/csv';
import jszip from 'jszip';

function cleanText(text: string) {
	return (
		text &&
		text
			.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
				return String.fromCharCode(s.charCodeAt(0) - 65248);
			})
			.toLowerCase()
	);
}

const Encode = <const>{
	UTF8: 'utf-8',
	SJIS: 'sjis',
};
type UEncode = keyof typeof Encode;
type LEncode = typeof Encode[keyof typeof Encode];

// @ts-ignore
@Component({ name: 'ScriptEvaluation', components: { Pie, FileInputWidget } })
export default class ScriptEvaluation extends Vue {
	private page: number = 1;
	private packageFileName: string = 'bot_package';
	@Prop({ default: '' })
	private discription?: string;
	private get packageFileUrl(): string {
		return `https://script.ai-x-supporter.com/${PRODUCT_ID}/${
			this.packageFileName
		}.json?v=${Math.floor(Math.random() * 100)}`;
	}
	private file: File | null = null;
	private evaluate: any = {};
	private isResultShow: boolean = false;

	// Graph
	private pieData: Type.IDatum[] = [];

	// Table
	private evaluateData: any = {};
	private tableSelectOptions: { text: string; value: string }[] = [
		{ text: '全て', value: 'all' },
		{ text: 'TOP3以内', value: 'top3' },
		{ text: 'その他', value: 'sonota' },
	];
	private tableSelect: string = this.tableSelectOptions[0].value;
	private tableColumns: IVueGoodTableColumn[] = [
		{ label: '検索クエリ', field: 'queryText' },
		{ label: 'ヒットさせたい質問文', field: 'wantResult' },
		{ label: '結果', field: 'result' },
	];
	private get tableRows(): any[] {
		if (!this.evaluate) return [];
		const top1 = _(this.evaluate.ng_list_top_one)
			.map((v) => {
				return { ...v, result: 'TOP3以内' };
			})
			.value();
		const top3 = _(this.evaluate.ng_list_top_k)
			.map((v) => {
				return { ...v, result: 'TOP3以内' };
			})
			.value();
		const sonota = _(this.evaluate.ng_list_top_icchi)
			.map((v) => {
				return { ...v, result: 'その他' };
			})
			.value();
		switch (this.tableSelect) {
			case 'all':
				return _(_.concat(top1, top3, sonota))
					.chain()
					// .groupBy((v) => `${v.q}_${v.result}`)
					.map((v) => {
						const a: any = Array.isArray(v) ? v[0] : v;
						return {
							queryText: a.q,
							wantResult: a.a,
							result: a.result,
						};
					})
					.value();
			case 'top3':
				return _(_.concat(top1, top3))
					.chain()
					// .groupBy((v) => v.q)
					.map((v) => {
						const a: any = Array.isArray(v) ? v[0] : v;
						return {
							queryText: a.q,
							wantResult: a.a,
							result: a.result,
						};
					})
					.value();
			case 'sonota':
				return _(sonota)
					.chain()
					// .groupBy((v) => v.q)
					.map((v) => {
						const a: any = Array.isArray(v) ? v[0] : v;
						return {
							queryText: a.q,
							wantResult: a.a,
							result: a.result,
						};
					})
					.value();
		}
		return [];
	}
	private fileChanged(file: File | null) {
		this.file = file;
	}

	private async evaluationStart() {
		if (this.file) {
			const csvString: any = await this.loadCSV(this.file);
			const csv = csvSync(csvString);
			const data = await this.fetchData(this.packageFileUrl);
			this.setEvaluation(data, csv);
			this.isResultShow = true;
		}
	}

	private resetEvaluate() {
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

	private loadCSV(file: File, from: UEncode = 'SJIS', to: UEncode = 'UTF8') {
		return new Promise((resolve: Function, reject: Function) => {
			if (!file) reject(new Error('file undefined'));
			const fr = new FileReader();
			fr.readAsArrayBuffer(file);
			fr.onload = () => {
				const rawText: any = fr.result;
				let u8s = new Uint8Array(rawText);
				if (Encoding.detect(u8s) === from) {
					u8s = Encoding.convert(u8s, { to: to, from: from });
					u8s = new Uint8Array(u8s);
				}
				const csvString = new TextDecoder(Encode[to]).decode(u8s);
				resolve(csvString);
			};
		});
	}

	private async fetchData(url: string) {
		const resp = await fetch(url);
		const data = await resp.json();
		return data;
	}

	private setEvaluation(scriptData: any, csvData: any) {
		const scriptMatchingManager = new ScriptMatchingManager({
			matchingScript: scriptData.script,
			invertedIndex: scriptData.inverted_index,
			keywordVariationsDict: scriptData.synonym_dict,
			invPostProbDist: scriptData.script_by_id,
			categoryData: scriptData.talk_script.body,
		});
		this.resetEvaluate();
		for (let i = 0; i < csvData.length; i++) {
			const [searchText, answer] = csvData[i];
			if (searchText === '') continue;
			this.evaluate.num_of_matches++;
			const answerList = scriptMatchingManager.search(cleanText(searchText));
			let flag = 0; // 0: その他, 1: TOP3以内 2: TOP1
			for (let j = 0; j < Math.min(3, answerList.length); j++) {
				const botRecText = scriptData.script.find(
					(o: any) => o.id == answerList[j].id,
				);
				if (botRecText.text === answer) {
					flag = j === 0 ? 2 : 1;
					break;
				}
			}
			switch (flag) {
				case 2:
					this.evaluate.num_of_correct_matches_top_one++;
					this.evaluate.ng_list_top_one.push({ q: searchText, a: answer });
				case 1:
					this.evaluate.num_of_correct_matches_top_k++;
					this.evaluate.ng_list_top_k.push({ q: searchText, a: answer });
					break;
				case 0:
					this.evaluate.ng_list_top_icchi.push({ q: searchText, a: answer });
					break;
			}
			this.evaluate.success_rate_top_one =
				this.evaluate.num_of_correct_matches_top_one / this.evaluate.num_of_matches;
			this.evaluate.success_rate_top_k =
				this.evaluate.num_of_correct_matches_top_k / this.evaluate.num_of_matches;
		}
	}
	private get Num_of_matches() {
		return this.evaluate.num_of_matches || 0;
	}
	private get SuccessRateOne() {
		return this.evaluate.success_rate_top_one * 100;
	}
	private get SuccessRateK() {
		return this.evaluate.success_rate_top_k * 100;
	}
	private get CorrectMatcheOne() {
		return this.evaluate.num_of_correct_matches_top_one;
	}
	private get CorrectMatcheK() {
		return this.evaluate.num_of_correct_matches_top_k;
	}

	private get ChartData(): Type.IDatum[] {
		if (!this.evaluate) return [];
		return [
			{ name: 'TOP3以内', value: this.SuccessRateK },
			{ name: 'その他', value: 100 - this.SuccessRateK },
		];
	}
	private csvHeader: ICSVHeader = [
		{ label: '検索クエリ', field: 'queryText', type: 'text' },
		{ label: 'ヒットさせたい質問文', field: 'wantResult', type: 'text' },
		{ label: '結果', field: 'result', type: 'text' },
	];
	private csvDownload(): void {
		const sel = this.tableSelect;
		this.tableSelect = 'all';
		const rows = this.tableRows;
		this.tableSelect = sel;
		const cfp = new CSVFactPlus(this.csvHeader, rows);
		const csv = cfp.getCSV();
		const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
		const blob = new Blob([bom, csv], { type: 'text/csv' });
		const url = (window.URL || window.webkitURL).createObjectURL(blob);
		const link = document.createElement('a');
		link.download = 'evaluation_rawdata.csv';
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	private saveAs(content: any, fileName: string) {
		const elm = document.createElement('a');
		const url = URL.createObjectURL(content);
		elm.href = url;
		elm.setAttribute('download', fileName);
		document.body.appendChild(elm);
		elm.click();
	}
}
</script>
<style lang="scss" scoped>
.script-evaluation {
	background: #edf2f6;
	padding: 32px;
	&_controlpanel {
		&__buttons {
			width: 100%;
			& > button {
				display: inline-block;
				&:nth-child(n + 2) {
					margin-left: 16px;
				}
			}
		}
	}
	&_infomessage {
		font-family: 'Meiryo Bold';
		font-weight: 800;
		color: #9c9c9c;
		width: 100%;
		height: 400px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-flow: column wrap;
		font-size: 26px;
	}
	&_widgets {
		margin: 16px 0;
		background: #fff;
		border-radius: 3px;
	}
	&_widget {
		margin: 8px;
		&:nth-child(n) {
			border-right: solid 1px #dfdfdf;
		}
		&:last-child {
			border-right: 0;
		}
	}
}

$widget-background-color: #fff;
$widget-default-width: 0%; //200px;
$widget-default-height: 250px;
// small
$widget-small-width: 25%;
$widget-small-height: 0px;
// medium
$widget-medium-width: 50%; //100px;
$widget-medium-height: 0px;
// large
$widget-large-width: 100%; //200px;
$widget-large-height: 0px;
.widgets {
	display: flex;
	flex-flow: row wrap;
}
.widget {
	@mixin widget-seed {
		padding: 16px;
		background-color: $widget-background-color;
	}
	&_title {
		font-weight: 700;
	}
	&-s {
		@include widget-seed;
		width: $widget-default-width + $widget-small-width;
		height: $widget-default-height + $widget-small-height;
	}
	&-m {
		@include widget-seed;
		width: $widget-default-width + $widget-medium-width;
		height: $widget-default-height + $widget-medium-height;
	}
	&-l {
		@include widget-seed;
		width: $widget-default-width + $widget-large-width;
		height: $widget-default-height + $widget-large-height;
	}
}
</style>
