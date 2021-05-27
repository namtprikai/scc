import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import ScenarioParent from '@/views/scenario/index';
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';

import ScenarioTemp from '@/components/ScenarioTemp/index.vue';
import EditWrap from '@/components/EditWrap/csv.vue';
import EditEnd from '@/components/EditWrap/end.vue';
import UploadModal from '@/components/UploadModal/index.vue';
import { CallbackChecks } from '@/components/EditWrap/csv.i';
import { AllInOneCsvMaker } from '@/utils/allInOneCsv';
import { TalkScript, ScriptDataTree, TalkScriptModule, ParseTreeToList, ScriptDataTreeSearch, ScriptDataTreeClean } from '@/store/modules/talkScript';
import { Ajax } from '@/utils/parts';
import { UpdateServer } from '@/api/updateServer';
import { PRODUCT_ID, subsystemUrl, scriptUrl, Type } from '@product/utils/configration';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
import { BotConfig2Module } from '../../store/modules/botConfig2';
const Encoding = require('encoding-japanese');
const csvSync = require('csv-parse/lib/sync');
declare let window: any;
// @ts-ignore
@Component({
	components: {
		EditWrap,
		EditEnd,
		UploadModal,
	},
})
export default abstract class BotcsvParent extends Vue {
	protected faqFile: any = null;
	protected file: any = null;
	protected synonymFile: any = null;
	protected isUpload = false;
	protected scenario = '';
	protected ajax = new Ajax();
	public callbackChecks: CallbackChecks = [
		{
			message: '編集開始と同時にバックアップファイル（CSVファイル）を保存する（推奨）',
			isCheck: true,
			callback: () => {
				this.download();
			},
		},
	];
	public abstract download(): any;
	public async doDownload(type: "bot" | "search" | "tag" = "bot") {
		await BotConfig2Module.getConfig2(type);
		const botConfig = BotConfig2Module.BotConfig2;
		await TalkScriptModule.getTalkScript();
		const TalkScript = TalkScriptModule.TalkScript;

		if ('title' in botConfig) {
			const data = await AllInOneCsvMaker.makeCsv(TalkScript, botConfig);
			const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
			const blob = new Blob([bom, data], { type: 'text/csv' });
			const url = (window.URL || window.webkitURL).createObjectURL(blob);
			const link = document.createElement('a');
			link.download = `${PRODUCT_ID}_FAQ_${this.$moment().format('YYMMDD_HHmm')}.csv`;
			link.href = url;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

		// const data = BotParseCsv.parse(botConfig);
	}

	public async downloadCsv(type = 'script') {
		const res = await this.ajax.http({
			baseURL: `${scriptUrl}`,
			url: `download_${type}`,
			method: 'GET',
			params: {
				product_id: PRODUCT_ID,
				password: 8671,
			},
		});
		const csvSt = res;
		const bom: any = new Uint8Array([0xef, 0xbb, 0xbf]);
		const element: any = document.createElement('a');
		const blob = new Blob([bom, csvSt], {
			type: 'text/csv',
		});
		// if(code=="SJIS"){
		// blob = new Blob([bom, csvSt], {
		//   type: 'text/csv;charset=shift_jis'
		// });
		// }
		const url = URL.createObjectURL(blob);
		element.href = url;
		element.setAttribute('download', `${PRODUCT_ID}_${type === 'script' ? 'FAQ' : type}_${this.$moment().format('YYMMDD_HHmm')}.csv`);
		document.body.appendChild(element); // Append the element to work in firefox
		element.click();
	}
	public async save() {
		this.doSave();
	}
	public async doSave(type: "bot" | "search" | "tag" = "bot") {
		if (this.file && !new RegExp(`^${PRODUCT_ID}_`).test(this.file.name)) {
			this.$modal.show('dialog', {
				title: 'ファイル名の先頭のプロダクトIDが一致しません',
				text: `${PRODUCT_ID}_ファイル名.csvのようにしてください`,
				buttons: [
					{
						title: 'はい',
						handler: () => {
							this.$modal.hide('dialog');
						},
					},
				],
			});
			return;
		}
		if (this.synonymFile && !new RegExp(`^${PRODUCT_ID}_`).test(this.synonymFile.name)) {
			this.$modal.show('dialog', {
				title: 'ファイル名の先頭のプロダクトIDが一致しません',
				text: `${PRODUCT_ID}_ファイル名.csvのようにしてください`,
				buttons: [
					{
						title: 'はい',
						handler: () => {
							this.$modal.hide('dialog');
						},
					},
				],
			});
			return;
		}
		if (this.file) {
			// let fileText: any = await getText(this.file);
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
			const fileText = csvSync(csvString, { relax_column_count: true });
			const setting: Set<string> = new Set();
			if (type === "search") {
				setting.add("needAllMenu");
			}
			const [isError, errorMessage] = AllInOneCsvMaker.ValidateAllInOneCsv(fileText, setting);
			if (isError) {
				this.$bvToast.toast(`${errorMessage}`, {
					toaster: 'b-toaster-top-center',
				});
				return;
			}
		}
		this.isUpload = true;

		eventHub.$emit('BoxModalOpen', 'uploadModal', {
			file: this.file,
			synonymFile: this.synonymFile,
			type
		});
	}
}
