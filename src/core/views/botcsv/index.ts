import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import ScenarioParent from '@/views/scenario/index';
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';

import ScenarioTemp from '@/components/ScenarioTemp/index.vue';
import { BotConfigModule } from '@/store/modules/botConfig';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
import EditWrap from '@/components/EditWrap/index.vue';
import { BotParseCsv } from '@/utils/botParseCsv';
import { UpdateServer } from '@/api/updateServer';
import { PRODUCT_ID } from '@product/utils/configration';

declare let window: any;
// @ts-ignore
@Component({})
export default class BotcsvParent extends Vue {
	protected file: any = null;
	protected isUpload = false;
	public async download() {
		await BotConfigModule.getBotConfig();
		const botConfig = BotConfigModule.botConfig;
		const data = BotParseCsv.parse(botConfig);
		const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
		const blob = new Blob([bom, data], { type: 'text/csv' });
		const url = (window.URL || window.webkitURL).createObjectURL(blob);
		const link = document.createElement('a');
		link.download = `${PRODUCT_ID}_BOTシナリオ_${this.$moment().format('YYYYMMDD_HHmm')}.csv`;
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	public async save() {
		if (!new RegExp(`^${PRODUCT_ID}_`).test(this.file.name)) {
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
		eventHub.$emit('botCsvUploadStart');
		this.isUpload = true;
		await BotConfigModule.saveTestBotConfigCsv({
			file: this.file,
			type: 'file_uploader',
		});

		this.isUpload = false;
		eventHub.$emit('botCsvUploadDone');
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

	get isBotdata() {
		return BotConfigModule.BotConfig;
	}
}
