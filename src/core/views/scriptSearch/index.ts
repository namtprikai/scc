import { Component, Vue } from 'vue-property-decorator';

import { mapGetters } from 'vuex';
import { Ajax, AutoScriptLogTag } from '@/utils/parts';
import TreeItem from '@/components/TreeItem/index.vue';
import { PRODUCT_ID } from '@product/utils/configration';
import { eventHub } from '@/init/eventHub';
import { v4 } from 'uuid';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';

import { TalkScript, TalkScriptModule, ParseTreeToList, ScriptDataTree, ScriptDataTreeSearch, ScriptDataTreeClean } from '@/store/modules/talkScript';
import { UpdateServer } from '@/api/updateServer';
import WrapSppiner from '@/components/WrapSinner/index.vue';

// @ts-ignore
@Component({
	components: { TreeItem, WrapSppiner },
})
export default class ScriptSearchParent extends Vue {
	protected isLoad = false;
	protected scriptData: Array<ScriptDataTree> = [];
	protected contextMenuIsVisible = false;
	protected ajax: Ajax = new Ajax();
	protected created() {
		this.fetchData();
		eventHub.$on('scriptCsvUploadDone', this.fetchData);
	}

	protected destroyed() {
		eventHub.$off('scriptCsvUploadDone', this.fetchData);
	}

	private async doAutoTag() {
		this.isLoad = true;
		await TalkScriptModule.getTalkScript();
		const TalkScript = TalkScriptModule.TalkScript;
		if (TalkScript) {
			const tagScript = AutoScriptLogTag(TalkScript);
			await TalkScriptModule.setTalkScript(tagScript);
			this.scriptData = await TalkScriptModule.TalkScriptEdit;
			await TalkScriptModule.setTalkScriptEdit(this.scriptData);
			await TalkScriptModule.saveTalkscript();
			await UpdateServer.update();
		}
		this.isLoad = false;
	}

	public autoTag() {
		this.$modal.show('dialog', {
			title: 'ログタグ強制自動付与',
			text: '本当にログタグ強制自動付与を実行しますか？今まで手動で付与されたタグ情報は完全に削除されます。',
			buttons: [
				{
					title: '実行',
					handler: () => {
						// alert("jikkou");
						this.$modal.hide('dialog');
						this.$modal.show('dialog', {
							title: '本当にログがリセットされますがよろしいでしょうか？',
							text: '本当にログタグ強制自動付与を実行しますか？今まで手動で付与されたタグ情報は完全に削除されます。',
							buttons: [
								{
									title: '実行',
									handler: () => {
										// alert("jikkou");
										this.doAutoTag();
										this.$modal.hide('dialog');
									},
								},
								{
									title: 'キャンセル',
									handler: () => {
										this.$modal.hide('dialog');
									},
								},
							],
						});
					},
				},
				{
					title: 'キャンセル',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
	}

	private async fetchData() {
		this.isLoad = true;
		await TalkScriptModule.getTalkScript();
		this.scriptData = TalkScriptModule.TalkScriptEdit;
		this.isLoad = false;
		// const data: any = await this.ajax.http(
		// 	{
		// 		url: `product/${PRODUCT_ID}/talk_script`,
		// 		method: "get"
		// 	}
		// );
		// console.log(data);
		// if (data.body) {
		// 	this.talkScript = data.body;
		// 	this.CategoryData = data.body;
		// }
	}

	get ScriptData() {
		return this.scriptData;
	}

	set ScriptData(scriptData) {
		// TalkScriptModule.setTalkScriptTree(scriptTreeData);
		this.scriptData = scriptData;
	}

	// get CategoryData() {
	// 	let res = this._parseTreeToList(this.categoryData);
	// 	for (let i = 0; i < res.length; i++) {
	// 		res[i].id = String(res[i].id);
	// 		res[i].parent = String(res[i].parent);
	// 	}
	// 	return res;
	// }
	// set CategoryData(datas: Array<Data>) {
	// 	for (let i = 0; i < datas.length; i++) {
	// 		datas[i].id = parseInt(String(datas[i].id), 10);
	// 		datas[i].parent = parseInt(String(datas[i].parent), 10);
	// 	}
	// 	this.categoryData = this.parseListToTree(datas);
	// }
	isSave = false;
	async save() {
		this.$modal.show('dialog', {
			title: '保存しますか？',
			text: '',
			buttons: [
				{
					title: 'はい',
					handler: async () => {
						this.isSave = true;
						console.log(this.scriptData);
						await TalkScriptModule.setTalkScriptTree(this.scriptData);
						await TalkScriptModule.saveTalkscript();
						await UpdateServer.update();
						this.isSave = false;
						this.$modal.hide('dialog');
					},
				},
				{
					title: 'いいえ',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
	}


	select(node: ISlTreeNode<any>, event: MouseEvent) {
		// ScriptDataTreeClean(this.scriptData);
		// console.log(this.scriptData);
		// console.log('select');
		// console.log(node);

		// ScriptDataTreeSearch(
		// 	node.data.id,
		// 	this.scriptData,
		// 	(data: ScriptDataTree | any) => {
		// 		eventHub.$emit('setScript', data);
		// 	},
		// 	true,
		// );
		// this.contextMenuIsVisible = false;
	}

	showContextMenu(node: ISlTreeNode<any>, event: MouseEvent) {
		event.preventDefault();
		this.contextMenuIsVisible = true;
		const $contextMenu: any = this.$refs.contextmenu;
		$contextMenu.style.left = event.clientX + 'px';
		$contextMenu.style.top = event.clientY + 'px';
	}

	removeNode() {
		this.contextMenuIsVisible = false;
		const $slVueTree: any = this.$refs.slVueTree;
		const paths = $slVueTree.getSelected().map((node: any) => node.path);
		console.log(paths);
		$slVueTree.remove(paths);
	}
}
