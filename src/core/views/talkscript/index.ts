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
export default class TalkscriptParent extends Vue {
	protected isLoad = false;
	protected scriptTreeData: {children:Array<ScriptDataTree>} = {children:[]};
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
			this.scriptTreeData.children = await TalkScriptModule.TalkScriptTree;
			await TalkScriptModule.setTalkScriptTree(this.scriptTreeData.children);
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
		this.scriptTreeData.children = TalkScriptModule.TalkScriptTree;
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

	get ScriptTreeData() {
		return this.scriptTreeData;
	}

	set ScriptTreeData(scriptTreeData) {
		// TalkScriptModule.setTalkScriptTree(scriptTreeData);
		this.scriptTreeData = scriptTreeData;
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
						console.log(this.scriptTreeData.children);
						await TalkScriptModule.setTalkScriptTree(this.scriptTreeData.children);
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

	getMaxScriptId(): string {
		function Crawler(data: ScriptDataTree[], fn: Function) {
			if (data) {
				for (const item of data) {
					fn(item);
					if (item.children) {
						Crawler(item.children, fn);
					}
				}
			}
		}
		let maxId = -1;
		Crawler(this.scriptTreeData.children, (data: ScriptDataTree | any) => {
			if (/^[0-9]+$/.test(data.data.id) && parseInt(data.data.id) > maxId) {
				maxId = parseInt(data.data.id);
			}
		});
		return String(maxId + 1);
	}

	select(node: ISlTreeNode<any>, event: MouseEvent) {
		ScriptDataTreeClean(this.scriptTreeData.children);
		console.log(this.scriptTreeData.children);
		console.log('select');
		console.log(node);

		ScriptDataTreeSearch(
			node.data.id,
			this.scriptTreeData.children,
			(data: ScriptDataTree | any) => {
				eventHub.$emit('setScript', data);
			},
			true,
		);
		this.contextMenuIsVisible = false;
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

	addRoot() {
		this.scriptTreeData.children.push({
			title: '',
			children: [],
			isLeaf: false,
			isExpanded: true,
			data: {
				status: 'published',
				parent: '#',
				id: this.getMaxScriptId(),
				text: 'new',
				type: 'node',
				items: {
					log_faq: [''],
					log_faq_child_category: [''],
					log_faq_parent_category: [''],
					log_faq_title: [''],
					log_scenario: [''],
				},
			},
		});
		// const Talkscript = document.getElementById('Talkscript');
		// (Talkscript || window).scrollTo(0, 999999);
		this.$scrollTo('#End', 500, {
			container: '#Talkscript',
			easing: 'ease-in',
			offset: 60,
			force: true,
			cancelable: true,
			onStart: element => {
				// scrolling started
			},
			onDone: element => {
				// scrolling is done
			},
			onCancel: () => {
				// scrolling has been interrupted
			},
			x: false,
			y: true,
		});
	}

	removeChild(node: any) {
		this.$modal.show('dialog', {
			title: '削除しますか？',
			text: '',
			buttons: [
				{
					title: 'はい',
					handler: () => {
						this.doRemoveChild(node);
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

	doRemoveChild(node: any) {
		console.log(node);
		// node.isExpanded = true;
		ScriptDataTreeSearch(
			node.data.id,
			this.scriptTreeData.children,
			(data: ScriptDataTree | any, deep: number, datas: Array<ScriptDataTree>) => {
				console.log(datas);
				for (let i = datas.length - 1; i >= 0; i--) {
					if (datas[i].data.id === data.data.id) {
						datas.splice(i, 1);
						break;
					}
				}
				console.log(datas);
				// this.$forceUpdate();
			},
			true,
		);
	}

	addChild(node: any) {
		console.log(node);
		node.isExpanded = true;
		ScriptDataTreeSearch(node.data.id, this.scriptTreeData.children, (data: ScriptDataTree | any, deep: number) => {
			if (data.children) {
				data.children.push({
					title: '',
					value: '',
					children: [],
					data: {
						id: this.getMaxScriptId(),
						text: 'new',
						type: deep <= 1 ? 'node' : 'leaf',
						items: {
							log_faq: [''],
							log_faq_child_category: [''],
							log_faq_parent_category: [''],
							log_faq_title: [''],
							log_scenario: [''],
						},
						questions: [],
					},
				});
			}
		});
	}
}
