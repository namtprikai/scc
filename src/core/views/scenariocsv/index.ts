import { v4 } from "uuid";
import { getList } from "@/api/table";
import { Component, Vue } from "vue-property-decorator";
import { eventHub } from "@/init/eventHub";
import ScenarioParent from "@/views/scenario/index";
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";

import ScenarioTemp from "@/components/ScenarioTemp/index.vue";
import {
	ScenarioStep,
	ScenarioModule,
	ScenarioFlow,
} from "@/store/modules/scenario";
import csvSync from "csv-parse/lib/sync";
import {
	horizontaltojson,
	parseScenario,
	parseListToCsv,
} from "@/utils/scenarioParseCsv";

import WrapMessage from "@/components/WrapMessage/index.vue";
import { RequeuestWokersService, Ajax } from "@/utils/parts";
import { CLIENT_ID } from "@consoletype/utils/configration";
const Encoding = require("encoding-japanese");
declare let window: any;
// @ts-ignore
@Component({
	components: { WrapMessage },
})
export default class BotcsvParent extends Vue {
	protected file: any = null;
	protected isUpload = false;
	message = "アップロード中";
	created() {
		eventHub.$on("scenarioUploadMessage", this.scenarioUploadMessage);
	}

	protected destroyed() {
		eventHub.$off("scenarioUploadMessage", this.scenarioUploadMessage);
	}

	// { listSize: deleteListSize, count: deleteCount++, message: "削除中" });
	scenarioUploadMessage({
		listSize,
		count,
		message,
	}: {
		listSize: number;
		count: number;
		message: string;
	}) {
		this.message = `${message} ${count}/${listSize}  ${Math.floor(
			(count / listSize) * 100
		)}%`;
	}

	public async download() {
		const scenarioList: any = ScenarioModule.ScenarioList;
		const dataList: any = parseListToCsv(scenarioList);
		console.log(dataList);
		const data: any = dataList
			.map((ar: any) => {
				const r = ar.map((a: any) => `"${String(a).replace(/"/g, "'")}"`);
				return r.join(",");
			})
			.join("\n");
		console.log(data);
		const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
		const blob = new Blob([bom, data], { type: "text/csv" });
		const url = (window.URL || window.webkitURL).createObjectURL(blob);
		const link = document.createElement("a");
		link.download = `${CLIENT_ID}_scenario_${this.$moment().format(
			"YYYYMMDD_HHmm"
		)}.csv`;
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	public async save() {
		if (!new RegExp(`^${CLIENT_ID}_`).test(this.file.name)) {
			this.$modal.show("dialog", {
				title: "ファイル名の先頭のプロダクトIDが一致しません",
				text: `${CLIENT_ID}_ファイル名.csvのようにしてください`,
				buttons: [
					{
						title: "はい",
						handler: () => {
							this.$modal.hide("dialog");
						},
					},
				],
			});
			return;
		}
		this.isUpload = true;

		const fileReader = new FileReader();
		fileReader.readAsArrayBuffer(this.file);
		let csvString: any = await new Promise((r: Function) => {
			fileReader.onload = () => {
				r(fileReader.result);
			};
		});
		csvString = new Uint8Array(csvString);
		const isSJIS = Encoding.detect(csvString);
		if (isSJIS === "SJIS") {
			csvString = Encoding.convert(csvString, {
				to: "UTF8", // to_encoding
				from: "SJIS", // from_encoding
			});
			csvString = new Uint8Array(csvString);
		}
		csvString = new TextDecoder("utf-8").decode(csvString);
		console.log(csvString);
		const csv = csvSync(csvString);
		console.log(csv);
		const scenarioList = parseScenario(horizontaltojson(csv));
		console.log(scenarioList);
		// parseListToCsv(scenarioList);
		const count = 0;
		try {
			await ScenarioModule.saveScenarioList(scenarioList);
		} catch (e) {
			console.log(e);
		}

		this.isUpload = false;

		this.$modal.show("dialog", {
			title: "アップロード終了",
			text: "",
			buttons: [
				{
					title: "はい",
					handler: () => {
						this.$modal.hide("dialog");
					},
				},
			],
		});
	}
}
