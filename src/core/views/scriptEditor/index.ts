import { Component, Vue, Watch } from "vue-property-decorator";
import { eventHub } from "@/init/eventHub";
import Tinymce from "@/components/Tinymce/index.vue";
import InputTag from "@/components/InputTag/index.vue";
import Synonym from "@/components/Synonym/index.vue";
import { Ajax } from "@/utils/parts";
import _ from "lodash";
import { bartUrl } from "@consoletype/utils/configration";
import { ScenarioModule } from "@/store/modules/scenario";

// @ts-ignore
@Component({
	components: { Tinymce, InputTag, Synonym },
})
export default class ScriptEditorCompParent extends Vue {
	protected item: any = "";
	protected isShow = true;
	protected currentSynonym = "";
	protected editValue = "";
	protected isEdit = false;
	protected message = "要編集リクエストが送られた当時のアイテムが存在しません。";

	protected isMessage = false;
	protected LOG_LIST = {
		log_scenario: "シナリオログ",
		log_faq: "FAQ番号",
		log_faq_parent_category: "親カテゴリ",
		log_faq_child_category: "子カテゴリ",
		log_faq_title: "FAQタイトル",
	};

	protected LOG_LIST_ORDER_LIST = [
		"log_scenario",
		"log_faq",
		"log_faq_parent_category",
		"log_faq_child_category",
		"log_faq_title",
	];

	@Watch("item.data.scenario")
	protected setScenarioIdItem(scenarioId: string) {
		this.item.data.items.scenario_id = scenarioId;
	}

	public get IsScenarioLink() {
		if ("items" in this.item.data) {
			if ("scenario_id" in this.item.data.items) {
				const scenarioId = this.item.data.items.scenario_id;
				const scenarioList = ScenarioModule.ScenarioList;
				if (scenarioList) {
					for (const scenario of scenarioList) {
						if (scenario.scenarioId == scenarioId) {
							console.log(scenarioId);
							return false;
						}
					}
				}
			}
		}
		return true;
	}

	protected setItem(item: any) {
		console.log(item);
		//
		if (item === null) {
			this.isShow = false;
			this.isMessage = true;
			this.item = item;
			return;
		}
		this.isShow = true;
		this.isMessage = false;
		this.item = item;
		if ("data" in item && "value" in item.data) {
			this.editValue = item.data.value.replace(/\n/g, "<br>");
		}
		if (!("status" in item.data)) {
			item.data.status = "published";
		}
		if (!("items" in item.data)) {
			item.data.items = item.item || {};
		}
		if ("items" in item.data) {
			if (!("scenario_id" in item.data.items)) {
				item.data.items.scenario_id = "";
			}
			if (!("log_faq" in item.data.items)) {
				item.data.items.log_faq = [""];
			}
		}
	}

	public resetItem() {
		this.editValue = this.item = "";
	}

	public setEdit() {
		if ("data" in this.item) {
			this.item.data.value = this.editValue;
		}
	}

	get Items() {
		return this.item.data.items || {};
	}

	get ItemList() {
		const LOG_LIST_ORDER_LIST = this.LOG_LIST_ORDER_LIST;
		const retList = [];
		const items = Object.assign({}, this.Items);
		if (Object.keys(items).length <= 0) {
			return [];
		}
		for (const key of LOG_LIST_ORDER_LIST) {
			if (items.hasOwnProperty(key)) {
				retList.push(key);
				delete items[key];
			}
		}
		for (const key in items) {
			retList.push(key);
		}
		return retList;
	}

	addItems() {
		this.$modal.show("dialog", {
			title: "ログ項目を追加する",
			text: `<div>
			<p>項目名:<input id="logItemKeyName" type="text" /></p>
			</div>`,
			buttons: [
				{
					title: "追加",
					handler: () => {
						const itemInput: any = document.getElementById("logItemKeyName");
						console.log(itemInput.value);
						if (itemInput.value && /^log_[a-z_]/.test(itemInput.value)) {
							const items = this.Items;
							items[itemInput.value] = [""];
							this.$forceUpdate();
						} else if (itemInput.value in this.Items) {
							this.$modal.show("すでにその項目名がついた項目が存在します");
						} else {
							this.$modal.show(
								"項目名はlog_のあとに小文字アルファベットもしくはアンダーバーの形式のみ利用できます。"
							);
						}
						// this.Items
						this.$modal.hide("dialog");
					},
				},
				{
					title: "中止",
					handler: () => {
						this.$modal.hide("dialog");
					},
				},
			],
		});
	}

	protected itemChangeId: any = null;
	get CurrentSynonym() {
		return this.currentSynonym;
	}

	@Watch("item", { deep: true })
	protected itemChange(item: any, oldItem: any) {
		if (item == null) {
			return;
		}
		this.isEdit = false;
		if (this.itemChangeId !== null) {
			clearTimeout(this.itemChangeId);
		}
		this.itemChangeId = setTimeout(() => {
			if (item.data && item.data.type === "leaf") {
				item.isLeaf = true;
			} else {
				item.isLeaf = false;
			}
			this.editValue = String(item.data.value).replace(/\n/g, "<br>");
			this.$forceUpdate();
		}, 500);
	}

	public removeQuestion(index: number) {
		this.item.data.questions.splice(index, 1);
		this.$forceUpdate();
	}

	public addQuestion() {
		if (!this.item.data.questions) {
			this.item.data.questions = [];
		}
		this.item.data.questions.push([]);
		this.$forceUpdate();
	}

	public tagClick(a: any, b: any) {
		// tslint:disable-next-line:no-string-literal
		this.currentSynonym = a;
		const modal: any = this.$refs.synonymModal;
		modal.show();
		// this.$modal.show(Synonym, { synonymvalue: a }, { draggable: true });
	}

	public isLog_script(data: any) {
		if ("items" in data && "log_faq" in data.items) {
			return true;
		}
		return false;
	}

	get Is_show() {
		if (this.isShow && this.item && this.item.hasOwnProperty("data")) {
			return true;
		}
		return false;
	}

	public tabClick() {
		this.resetItem();
	}

	ajax: Ajax = new Ajax();
	isBartSearch = false;
	makeKeyword() {
		this.isBartSearch = true;
		this.ajax
			.http({
				method: "POST",
				baseURL: bartUrl,
				url: "",
				data: { text: this.item.data.text || "" },
			})
			.then((data: any) => {
				console.log(data);
				const { tokens } = data;
				const questions: any = [];
				let keyWord = "";
				let nCount = 0;
				for (const token of tokens) {
					if (token.label === 1 || (token.label === 2 && nCount > 4)) {
						if (keyWord !== "") {
							questions.push(keyWord);
							nCount = 0;
							keyWord = "";
						}
						keyWord += token.surface;
					}
					if (token.label === 2) {
						nCount = 0;
						keyWord += token.surface;
					}
					if (token.label === 0) {
						nCount++;
					}
				}
				if (keyWord !== "") {
					questions.push(keyWord);
				}
				this.item.data.questions.push(questions);
				this.isBartSearch = false;
			})
			.catch(() => {
				this.isBartSearch = false;
			});
	}

	protected created() {
		ScenarioModule.getScenario();

		eventHub.$on("setScript", this.setItem);
		eventHub.$on("tabclick", this.tabClick);
	}

	protected destroyed() {
		eventHub.$off("setScript", this.setItem);
		eventHub.$off("tabclick", this.tabClick);
	}
}
