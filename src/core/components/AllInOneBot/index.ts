import { Component, Vue, Prop, PropSync, Emit } from 'vue-property-decorator';
import { ScriptDataTree } from '@/store/modules/talkScript';
import { BotConfig, BotConfigFlow } from '@/store/modules/botConfig2';

// @ts-ignore
@Component({
	components: {
		botdion: () => import('@/components/TreeFile/bot.vue'),
	},
})
export default class AllInOneBotParent extends Vue {
	@Prop()
	public botData!: BotConfigFlow;

	@Emit('SelectItem')
	public SelectItem(item: { type: 'bot' | 'script'; item: ScriptDataTree | BotConfigFlow }) {
		return item;
	}

	public CurrentItem: {
		item: BotConfigFlow | undefined;
		parent: BotConfigFlow | undefined;
	} = { item: undefined, parent: undefined };

	public setCurrentItem(data: { item: BotConfigFlow; parent: BotConfigFlow }) {
		console.log('BOTかれんとあいてむ');
		this.CurrentItem = data;
	}

	public editing() {
		this.$emit('editing');
	}
}
