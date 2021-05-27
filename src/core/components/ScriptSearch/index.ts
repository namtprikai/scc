import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { BotConfig, BotConfigFlow } from '@/store/modules/botConfig2';
import { BotConfig2Module } from '@/store/modules/botConfig2';
import { BotConfigModule } from '@/store/modules/botConfig';
import AllInOneScript from '../../components/AllInOneScript/index.vue';
import { AllInOneCsvMaker } from '@/utils/allInOneCsv';
import { ScriptDataTree, ScriptDataTreeCrawler } from '@/utils/allInOneCsv/script';
import { Wait } from '@/utils/parts';
import { TalkScript, TalkScriptModule, ParseTreeToList, ScriptDataTreeSearch, ScriptDataTreeClean } from '@/store/modules/talkScript';
import { eventHub } from '@/init/eventHub';
import EditEnd from '@/components/EditWrap/end.vue';
import { CallbackChecks } from '@/components/EditWrap/csv.i';
import { PRODUCT_ID, subsystemUrl, scriptUrl,Type } from '@product/utils/configration';
import EditWrap from '@/components/EditWrap/csv.vue';
import './style.scss';
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
	components: {EditEnd,EditWrap},
})
export default class ScriptSearchParent extends Vue {
	public searchText: string = "";
	@Prop()
	public scriptData!: Array<ScriptDataTree>;

	@Prop()
	public botData!: BotConfig;
	get BotDataList() {
		const flowList: Array<any> = [];
		search(this.botData.flow.next, 0, (flow: BotConfigFlow, depth: number) => {
			if (flow.next.length == 0 && depth > 0 && flow.items.is_category) {
				flowList.push(flow);
			}
		});
		return flowList;
		function search(flowList: Array<BotConfigFlow>, depth: number, fn: (flow: BotConfigFlow, depth: number) => void) {
			for (const flow of flowList) {
				fn(flow, depth);
				search(flow.next, depth+1, fn);
			}
		}
	}
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
			await BotConfig2Module.getConfig2(Type);
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
	public get ScriptData() {
		return this.scriptData;
	}
	get FilteredLeafs() {
		const botDataList = this.BotDataList;
		return botDataList.filter(b => b.items?.is_category!==true).map(b => { return { type: "bot", item: b } }).concat(this.scriptData.map(b => { return { type: "script", item: b.data } })).filter(script => {
			return script.item.type === "leaf" && (this.searchText === "" || script.item.text.indexOf(this.searchText) !== -1);
		});
  }
  public openSaveModal() {
    TalkScriptModule.setTalkScriptEdit(this.scriptData);
		const ScriptTreeData = TalkScriptModule.TalkScriptTree;
		const BotData = this.botData;
		// TalkScriptModule.setTalkScriptTree(ScriptTreeData);
		eventHub.$emit('BoxModalOpen', 'uploadModal', {
			scriptDataTree: ScriptTreeData,
      botData: BotData,
      type: Type,
		});
  }
  public setActive(item: any) {
    for(const leaf of this.FilteredLeafs){
      leaf.item.isActive = false;
    }
    item.isActive = true;
    this.$forceUpdate();
	}
	public SelectItem(data: { type: 'bot' | 'script'; item: ScriptDataTree | BotConfigFlow }) {
    console.log('select');
    this.setActive(data.item);
		if (data.type == 'script') {
			eventHub.$emit('setScript', {data: data.item,isLeaf:true});
		}
		if (data.type == 'bot') {
			eventHub.$emit('setCurrentBotFlow', data.item);
		}
	}
}
