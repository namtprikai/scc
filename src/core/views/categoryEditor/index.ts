import { Component, Vue, Watch } from "vue-property-decorator";
import { eventHub } from "@/init/eventHub";
import Tinymce from "@/components/Tinymce/index.vue";
import InputTag from "@/components/InputTag/index.vue";
import Synonym from "@/components/Synonym/index.vue";
import _ from "lodash";
import { Ajax, Wait } from "@/utils/parts";
import WrapSppiner from "@/components/WrapSinner/index.vue";
import { ICategoryData, IConditionData, IConditionGroupData } from "@/api/types";
import CategoryEditor from "@/components/CategoryEdit/CategoryEdit.vue";
// @ts-ignore
@Component({
	components: { Tinymce, InputTag, Synonym, WrapSppiner, CategoryEditor },
})
export default class CategoryEditorParent extends Vue {
	public isLoading = false;
	public category: ICategoryData | {} = {};
	public reset() {
		this.isLoading = false;
		this.category = {};
	}


	public async setCategory(data: {
		category: ICategoryData;
	}) {
		this.isLoading = true;
		this.category = {};
		await Wait();
		this.category = data.category;
		this.isLoading = false;
	}

	get Is_CategoryShow() {
		return Object.keys(this.category).length>0;
	}
	protected created() {
		eventHub.$on("setCategory", this.setCategory);
		eventHub.$on("resetCategory", this.reset);
	}

	protected destroyed() {
		eventHub.$off("setCategory", this.setCategory);
		eventHub.$off("resetCategory", this.reset);
	}
}
