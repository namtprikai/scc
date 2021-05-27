import { Component, Vue } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { mapGetters } from 'vuex';
import { UpdateServer } from '@/api/updateServer';
import { Ajax } from '@/utils/parts';
import TreeItem from '@/components/TreeItem/index.vue';
import { eventHub } from '@/init/eventHub';
import { PRODUCT_ID, subsystemUrl, scriptUrl } from '@product/utils/configration';
import { v4 } from 'uuid';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import { Scenario, ScenarioModule } from '@/store/modules/scenario';
import axios from 'axios';

const Encoding = require('encoding-japanese');
// @ts-ignore
@Component({
	components: { TreeItem },
})
export default class ScriptcsvParent extends Vue {
	protected scriptFile: any = null;
	protected synonymFile: any = null;
	protected ajax = new Ajax();
	public async saveSynonymCsv(_file: File) {
		if (!new RegExp(`^${PRODUCT_ID}_`).test(_file.name)) {
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
		const getText = (file: File) =>
			new Promise(r => {
				const reader: any = new FileReader();
				reader.onload = () => {
					r(reader.result);
				};
				reader.readAsArrayBuffer(file);
			});
		let fileText: any = await getText(_file);
		fileText = new Uint8Array(fileText);
		const isSJIS = Encoding.detect(fileText);
		if (isSJIS === 'SJIS') {
			fileText = Encoding.convert(fileText, {
				to: 'UTF8', // to_encoding
				from: 'SJIS', // from_encoding
			});
			fileText = new Uint8Array(fileText);
		}
		const file: any = new Blob([fileText.buffer], { type: 'text/csv' }); // await getText(_file);
		const formData = new FormData();
		formData.append('product_id', PRODUCT_ID);
		formData.append('file', file);
		await this.ajax.http({
			baseURL: `${scriptUrl}`,
			url: '/upload_synonym/',
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data: formData,
		});
		UpdateServer.update();
		eventHub.$emit('scriptCsvUploadDone');
		this.$modal.show('dialog', {
			title: 'アップロード終了',
			text: '',
			buttons: [
				{
					title: 'はい',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
	}

	public async sendScriptCsv(_file: File) {
		if (!new RegExp(`^${PRODUCT_ID}_`).test(_file.name)) {
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
		const getText = (file: File) =>
			new Promise(r => {
				const reader: any = new FileReader();
				reader.onload = () => {
					r(reader.result);
				};
				reader.readAsArrayBuffer(file);
			});
		let fileText: any = await getText(_file);
		fileText = new Uint8Array(fileText);
		const isSJIS = Encoding.detect(fileText);
		if (isSJIS === 'SJIS') {
			fileText = Encoding.convert(fileText, {
				to: 'UTF8', // to_encoding
				from: 'SJIS', // from_encoding
			});
			fileText = new Uint8Array(fileText);
		}
		const file: any = new Blob([fileText.buffer], { type: 'text/csv' }); // await getText(_file);
		const formData = new FormData();
		formData.append('product_id', PRODUCT_ID);
		formData.append('file', file);
		await this.ajax.http({
			baseURL: `${scriptUrl}`,
			url: '/upload_script/',
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data;',
			},
			data: formData,
		});
		await UpdateServer.update();
		eventHub.$emit('scriptCsvUploadDone');
		this.$modal.show('dialog', {
			title: 'アップロード終了',
			text: '',
			buttons: [
				{
					title: 'はい',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
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
		element.setAttribute('download', `${PRODUCT_ID}_${type}_${this.$moment().format('YYYYMMDD_HHmm')}.csv`);
		document.body.appendChild(element); // Append the element to work in firefox
		element.click();
	}
}
