import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { ScriptDataTree } from '@/store/modules/talkScript';
import { BotConfig, BotConfigFlow } from '@/store/modules/botConfig2';

import { eventHub } from '@/init/eventHub';
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
	components: {},
})
export default class AllInOneScriptParent extends Vue {
	@Prop()
	public scriptTreeData!: ScriptDataTree;

	@Prop()
	public botData!: BotConfig;

	public CurrentItem: {
		item: ScriptDataTree | undefined;
		parent: ScriptDataTree | undefined;
	} = { item: undefined, parent: undefined };

	// ドラック動作用
	public setCurrentItem(data: { item: ScriptDataTree; parent: ScriptDataTree; depth?: number }) {
		console.log('かれんとあいてむ');

		this.CurrentItem = data;
	}

	// public get ScriptTreeData() {
	// 	return this.scriptTreeData;
	// }

	public SelectItem(data: { type: 'bot' | 'script'; item: ScriptDataTree | BotConfigFlow }) {
		console.log('select');
		if (data.type == 'script') {
			eventHub.$emit('setScript', data.item);
		}
		if (data.type == 'bot') {
			eventHub.$emit('setCurrentBotFlow', data.item);
		}
	}
}
