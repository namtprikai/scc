<template>
	<div>
		<TabHeader>
			<EditEnd />
			<b-button class="ml-2" size="sm" variant="primary" @click="openSaveModal()" :disabled="isLoad">反映ステップへ進む</b-button>
		</TabHeader>

		<div class="tab-body">
			<div class="text-right mt-3">
				<b-button class @click="addRoot()" variant="secondary">
					<svg-icon name="arrows_plus" />
				</b-button>
			</div>
			<div>
				<wrap-sppiner v-if="isLoad" />
				<all-in-one-script v-if="isShow" :scriptTreeData="scriptTreeData" :botData="BotData" />
				<div id="End"></div>
				<div class="mt-3">
					<b-button block class @click="addRoot()" variant="secondary">
						<svg-icon name="arrows_plus" />
					</b-button>
				</div>
				<div class="contextmenu" ref="contextmenu" v-show="contextMenuIsVisible">
					<div @click="removeNode">Remove</div>
				</div>
			</div>
			<edit-wrap
				:messages="[
					'編集を開始すると、他のユーザーは編集できなくなります。 編集が終了したら「編集終了」をクリックして終了してください。',
					'編集を行って保存すると編集前の状態は失われます。バックアップを取りたい場合は以下のチェックボックスを選択し、編集前の状態をCSVファイルで保存してください。',
				]"
				:editingmessage="''"
				:callback-checks="callbackChecks"
				:isEndbutton="false"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { Component, Vue } from 'vue-property-decorator';
import { MessageListModule } from '@/store/modules/messageList';
import { eventHub } from '@/init/eventHub';
import TalkscriptParent from '@/views/talkscript/index';
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import WrapSppiner from '@/components/WrapSinner/index.vue';
import { CallbackChecks } from '@/components/EditWrap/csv.i';
import EditWrap from '@/components/EditWrap/csv.vue';
import EditEnd from '@/components/EditWrap/end.vue';
import { BotConfig2Module } from '@/store/modules/botConfig2';
import { BotConfigModule } from '@/store/modules/botConfig';
import AllInOneScript from '../../components/AllInOneScript/index.vue';
import { AllInOneCsvMaker } from '@/utils/allInOneCsv';
import { PRODUCT_ID, subsystemUrl, scriptUrl,Type } from '../../utils/configration';
import { ScriptDataTree, ScriptDataTreeCrawler } from '@/utils/allInOneCsv/script';
import { Wait } from '@/utils/parts';
import { TalkScript, TalkScriptModule, ParseTreeToList, ScriptDataTreeSearch, ScriptDataTreeClean } from '@/store/modules/talkScript';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: 'success',
				draft: 'gray',
				deleted: 'danger',
			};
			return statusMap[status];
		},
	},
	components: {
		SlVueTree,
		EditWrap,
		EditEnd,
		WrapSppiner,
		AllInOneScript,
	},
})
export default class TalkscriptComp extends TalkscriptParent {
	public isShow = true;
	public callbackChecks: CallbackChecks = [
		{
			message: '編集開始と同時にバックアップファイル（CSVファイル）を保存する（推奨）',
			isCheck: true,
			callback: () => {
				this.download();
			},
		},
	];

	public async download() {
		await BotConfig2Module.getConfig2("search");
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

	public openSaveModal() {
		const ScriptTreeData = this.ScriptTreeData.children;
		const BotData = this.BotData;
		// TalkScriptModule.setTalkScriptTree(ScriptTreeData);
		eventHub.$emit('BoxModalOpen', 'uploadModal', {
			scriptDataTree: ScriptTreeData,
      botData: BotData,
      type: Type,
		});
	}

	public removeScript(id: string) {
		this.scriptTreeData.children = this.scriptTreeData.children.filter(d => d.data.id !== id);
	}

	private async reset() {
		this.isShow = false;
		this.isLoad = true;
		await TalkScriptModule.getTalkScript();
		await BotConfig2Module.getConfig2(Type);
		await this.resetEditing();
		this.isLoad = false;
	}

	async mounted() {
		eventHub.$on('saveScript', this.resetEditing);
		eventHub.$on('removeScriptDataTree', this.removeScript);
		eventHub.$on('editUnLock', this.reset);
		await BotConfig2Module.getConfig2(Type);
	}

	public beforeDestroy() {
		eventHub.$off('saveScript', this.resetEditing);

		eventHub.$off('removeScriptDataTree', this.removeScript);
		eventHub.$off('editUnLock', this.reset);
	}

	public async resetEditing() {
		this.isShow = false;
		this.scriptTreeData.children = TalkScriptModule.TalkScriptTree;
		await Wait(500);
		this.isShow = true;
		this.isLoad = false;
	}

	// get ScriptTreeData(){
	// 	const scriptTreeData = super.ScriptTreeData;
	// 	return scriptTreeData;
	// }
	// 	destroyed(){
	// eventHub.$off("allInOneEditing", this.resetEditing);
	// }
	// 	public resetEditing(){
	// 	ScriptDataTreeCrawler(this.ScriptTreeData,(item:ScriptDataTree,deep:number)=>{
	// 		console.log(item);
	// 		console.log(deep);
	// 		item.isEditing=false;
	// 	})
	// }
	public async saveConfig() {
		await TalkScriptModule.setTalkScriptTree(this.scriptTreeData.children);
		Promise.all([TalkScriptModule.saveTalkscript(), BotConfig2Module.saveConfig2("tag")]).then(() => {
			alert('保存しました。');
		});
	}

	private nodes = [
		{ title: 'Item1', isLeaf: true },
		{ title: 'Item2', isLeaf: true, data: { visible: false } },
		{ title: 'Folder1' },
		{
			title: 'Folder2',
			isExpanded: true,
			children: [
				{ title: 'Item3', isLeaf: true },
				{ title: 'Item4', isLeaf: true },
			],
		},
	];

	get BotData() {
		return BotConfig2Module.BotConfig2;
	}
}
</script>
<style type="sass"></style>
<style type="scss" scoped>
.item-icon {
	display: inline-block;
	text-align: left;
	width: 20px;
}
</style>
