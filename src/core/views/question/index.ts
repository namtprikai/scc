import { Component, Vue } from "vue-property-decorator";

import { mapGetters } from "vuex";
import { eventHub } from "@/init/eventHub";
import { v4 } from "uuid";
import { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import { AjaxService } from "@/services/ajax";
import { QuestionModule } from "@/store/modules/question";

import WrapSppiner from "@/components/WrapSinner/index.vue";
import { BCardAccordion } from "@/components/BCardAccodion";
import { ProductsModule } from "@/store/modules/products";
import { IQuestionData } from "@/api/types";
// @ts-ignore
@Component({
	components: { WrapSppiner, BCardAccordion },
})
export default class QuestionParent extends Vue {
	protected searchText = "";
	protected isLoad = false;
	protected contextMenuIsVisible = false;
	public currentProducts: Array<any> = [];
	protected created() {
		this.fetchData();
		eventHub.$on("scriptCsvUploadDone", this.fetchData);
	}
	public keywordGroups = [];
	protected destroyed() {
		eventHub.$off("scriptCsvUploadDone", this.fetchData);
	}
	get ProductOptions() {
		return ProductsModule.Products.map((p) => {
			return { text: p.name, value: p.id };
		});
	}
	public search() {}
	private async fetchData() {
		this.isLoad = true;
		await Promise.all([
			ProductsModule.GetProducts(),
			QuestionModule.GetQuestions(),
		]);
		this.isLoad = false;
	}
	public edit(id:number,data:IQuestionData){

	}
	private doEdit(id:number,data:IQuestionData){
		QuestionModule.EditQuestion(id,data);
	}
	get Questions() {
		if (this.searchText === "") {
			return QuestionModule.Questions;
		} else {
			return QuestionModule.Questions.filter((q) => {
				return q.title.match(new RegExp(this.searchText, "g"));
			});
		}
	}
	isSave = false;
	async save() {
		this.$modal.show("dialog", {
			title: "保存しますか？",
			text: "",
			buttons: [
				{
					title: "はい",
					handler: async () => {
						this.isSave = true;
						this.isSave = false;
						this.$modal.hide("dialog");
					},
				},
				{
					title: "いいえ",
					handler: () => {
						this.$modal.hide("dialog");
					},
				},
			],
		});
	}

	select(node: ISlTreeNode<any>, event: MouseEvent) {}

	showContextMenu(node: ISlTreeNode<any>, event: MouseEvent) {
		event.preventDefault();
		this.contextMenuIsVisible = true;
		const $contextMenu: any = this.$refs.contextmenu;
		$contextMenu.style.left = event.clientX + "px";
		$contextMenu.style.top = event.clientY + "px";
	}

	removeNode() {
		this.contextMenuIsVisible = false;
		const $slVueTree: any = this.$refs.slVueTree;
		const paths = $slVueTree.getSelected().map((node: any) => node.path);
		console.log(paths);
		$slVueTree.remove(paths);
	}
	addQuestion(question:IQuestionData){
		QuestionModule.AddQuestion(question);
		this.$scrollTo("#End", 500, {
			container: "#Talkscript",
			easing: "ease-in",
			offset: 60,
			force: true,
			cancelable: true,
			onStart: (element) => {
				// scrolling started
			},
			onDone: (element) => {
				// scrolling is done
			},
			onCancel: () => {
				// scrolling has been interrupted
			},
			x: false,
			y: true,
		});
	}
	addRoot() {
		// const Talkscript = document.getElementById('Talkscript');
		// (Talkscript || window).scrollTo(0, 999999);
		this.$scrollTo("#End", 500, {
			container: "#Talkscript",
			easing: "ease-in",
			offset: 60,
			force: true,
			cancelable: true,
			onStart: (element) => {
				// scrolling started
			},
			onDone: (element) => {
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
		this.$modal.show("dialog", {
			title: "削除しますか？",
			text: "",
			buttons: [
				{
					title: "はい",
					handler: () => {
						this.doRemoveChild(node);
						this.$modal.hide("dialog");
					},
				},
				{
					title: "いいえ",
					handler: () => {
						this.$modal.hide("dialog");
					},
				},
			],
		});
	}

	doRemoveChild(node: any) {}

	addChild(node: any) {}
}
