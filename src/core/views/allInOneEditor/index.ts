import { Component, Vue, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import Tinymce from '@/components/Tinymce/index.vue';
import InputTag from '@/components/InputTag/index.vue';
import Synonym from '@/components/Synonym/index.vue';
import EditWrap from '@/components/EditWrap/index.vue';
import _ from 'lodash';
import { bartUrl } from '@product/utils/configration';
import { ScenarioModule } from '@/store/modules/scenario';
import { ScriptDataTree } from '@/utils/allInOneCsv/script';
import { BotConfigFlow } from '@/utils/allInOneCsv/scenario';
import { Ajax, Wait } from '@/utils/parts';
import WrapSppiner from '@/components/WrapSinner/index.vue';
// @ts-ignore
@Component({
	components: { Tinymce, InputTag, Synonym, EditWrap ,WrapSppiner},
})
export default class AllInOneEditorCompParent extends Vue {
	public isLoading:boolean=false;
	public script: ScriptDataTree | {} = {};
	public botConfig: BotConfigFlow | {} = {};
	public currentType: 'script' | 'bot' | '' = '';
	public reset() {
		this.isLoading=false;
		this.script = {};
		this.botConfig = {};
		this.currentType = '';
	}

	public saveScript() {
		this.reset();
	}

	public async setScript(item: ScriptDataTree) {
		this.isLoading=true;
		this.currentType = '';
		await Wait();
		this.script = item;
		this.currentType = 'script';
		this.isLoading=false;
	}

	public async setBotConfig(item: BotConfigFlow) {
		this.isLoading=true;
		this.currentType = '';
		await Wait();
		this.botConfig = item;
		this.currentType = 'bot';
		this.isLoading=false;
	}

	get Is_ScriptShow() {
		return this.currentType === 'script';
	}

	get Is_BotShow() {
		return this.currentType === 'bot';
	}

	protected created() {
		eventHub.$on('saveScript', this.saveScript);
		eventHub.$on('setScript', this.setScript);
		eventHub.$on('setCurrentBotFlow', this.setBotConfig);
		eventHub.$on('editUnLock', this.reset);
		// eventHub.$on("tabclick", this.tabClick);
	}

	protected destroyed() {
		eventHub.$off('saveScript', this.saveScript);
		eventHub.$off('setScript', this.setScript);
		eventHub.$off('setCurrentBotFlow', this.setBotConfig);
		eventHub.$off('editUnLock', this.reset);
		// eventHub.$off("tabclick", this.tabClick);
	}
}
