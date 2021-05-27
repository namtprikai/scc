import { Component, Vue } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { mapGetters } from 'vuex';
import { UpdateServer } from '@/api/updateServer';
import { Ajax } from '@/utils/parts';
import TreeItem from '@/components/TreeItem/index.vue';
import { PRODUCT_ID } from '@product/utils/configration';
import { eventHub } from '@/init/eventHub';
import { v4 } from 'uuid';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import { BotConfigModule } from '@/store/modules/botConfig';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
import axios from 'axios';
// @ts-ignore
@Component({
	components: { TreeItem },
})
export default class BotConfigParent extends Vue {
	protected isSave = false;
	protected isSet = false;
	protected contextMenuIsVisible = false;
	protected botConfigFlow: OldScenario.BotConfigFlow | any = {};
	protected ajax: Ajax = new Ajax();
	protected created() {
		// this.fetchData();
		eventHub.$on('setCurrentBotFlow', this.setBotConfig);
	}

	protected setBotConfig(botConfigFlow: OldScenario.BotConfigFlow) {
		console.log(botConfigFlow);
		this.botConfigFlow = botConfigFlow;
		// BotConfigModule.setCurrentFlow(botConfigFlow);
		this.isSet = true;
	}

	protected destroyed() {
		eventHub.$off('setCurrentBotFlow', this.setBotConfig);
	}

	// private async fetchData() {
	// 	await BotConfigModule.getBotConfig();
	// 	this.botConfig = BotConfigModule.BotConfig;
	// }
	get BotConfigFlow() {
		return this.botConfigFlow;
	}

	protected saveId: any = null;
	public save() {
		if (this.saveId !== null) {
			clearTimeout(this.saveId);
		}
		this.saveId = setTimeout(() => {
			this.doSave().then(r => {
				console.info(r);
				this.$modal.show('dialog', {
					title: '保存しました',
					text: '',
					buttons: [
						{
							title: '閉じる',
						},
					],
				});
				UpdateServer.update();
			});
		}, 1000);
	}

	protected doSave() {
		// console.log(this.ajax);
		// return this.ajax.http({
		// 	url: `product/${PRODUCT_ID}/botConfig`,
		// 	method: "POST",
		// 	data: JSON.stringify(this.botConfig)
		// })
		return BotConfigModule.saveBotConfig();
	}

	public reset() {
		this.botConfigFlow = {};
		this.isSet = false;
	}

	public deleate() {
		console.log(this.botConfigFlow);
		if (this.botConfigFlow.hasOwnProperty('step')) {
			this.$modal.show('dialog', {
				title: '削除してよろしいですか？',
				text: '',
				buttons: [
					{
						title: 'はい',
						handler: () => {
							console.log(this.botConfigFlow.id);
							this.doDelate(this.botConfigFlow.step);
							this.$modal.hide('dialog');
						},
					},
					{
						title: 'いいえ',
					},
				],
			});
		}
	}

	public async doDelate(id: string) {
		this.$modal.show('dialog', {
			title: '削除中',
			text: '削除しています',
		});
		BotConfigModule.dleateTestFlow(id);
		this.reset();
		// await this.ajax.http({
		// 	url: `product/${PRODUCT_ID}/botConfig/${id}`,
		// 	method: 'DELETE',
		// 	data: {}
		// });
		// await UpdateServer.update();
		// await BotConfigModule.getBotConfig();
		this.$modal.show('dialog', {
			title: '削除完了',
			text: '削除が完了しました',
			buttons: [
				{
					title: '閉じる',
				},
			],
		});
	}
}
