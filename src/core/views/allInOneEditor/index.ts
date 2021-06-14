import { Component, Vue, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import Tinymce from '@/components/Tinymce/index.vue';
import InputTag from '@/components/InputTag/index.vue';
import Synonym from '@/components/Synonym/index.vue';
import _ from 'lodash';
import { Ajax, Wait } from '@/utils/parts';
import WrapSppiner from '@/components/WrapSinner/index.vue';
import { IAnswerData } from '@/api/types';
import AnsewerEditor from "@/components/AnsewerEditor/index.vue";
// @ts-ignore
@Component({
	components: { Tinymce, InputTag, Synonym ,WrapSppiner,AnsewerEditor},
})
export default class AllInOneEditorCompParent extends Vue {
	public isLoading:boolean=false;
	public answer:IAnswerData | {}={};
	public currentType: 'answer' | '' = '';
	public reset() {
		this.isLoading=false;
		this.answer = {};
		this.currentType = '';
	}


	public async setAnswer(item: IAnswerData) {
		this.isLoading=true;
		this.currentType = '';
		await Wait();
		this.answer = item;
		this.currentType = 'answer';
		this.isLoading=false;
	}


	get Is_AnswerShow() {
		return this.currentType === 'answer';
	}
	protected created() {
		eventHub.$on('setAnswer', this.setAnswer);
	}

	protected destroyed() {
		eventHub.$off('setAnswer', this.setAnswer);
	}
}
