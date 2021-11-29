<template>
	<div class="tab-body">
		<b-alert show variant="info"> 検索してください </b-alert>
		<div class="section">
			<b-form-group>
				<b-form-input
					name="title"
					type="text"
					v-model="subject"
					ref="mailSubject"
					placeholder=""
				/>
			</b-form-group>
		</div>
	</div>
</template>
<style type="scss" lang="scss" scoped>
.question {
	position: relative;
	overflow: hidden;
	display: flex;
	.input {
		// float: left;
		display: flex;
		width: 100%;
	}
	.removeButton {
		display: flex;
		// float: right;
	}
	.vue-input-tag-wrapper {
		width: 100%;
	}
}
</style>

<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
import Plugins from "@/components/Tinymce/plugins";
import Toolbar from "@/components/Tinymce/toolbar";
import _ from "lodash";
import { JSDOM } from "jsdom";
import { mailTo } from "mailstring";
import { AjaxService } from "@/services/ajax";
// @ts-ignore
@Component({
	components: {},
})
export default class UserWinComp extends Vue {
	protected isShow = true;
	protected isItto: "a" | "b" = "a";
	protected currentSynonym = "";
	protected editValue = "";
	protected isEdit = false;
	protected toolbar = Toolbar;
	protected plugins = Plugins;
	protected ticketTag: string = "";
	protected ticketTag2: string = "";
	protected message = "要編集リクエストが送られた当時のアイテムが存在しません。";
	@PropSync("value", { type: String })
	public dataValue!: string;
	protected isMessage = false;
	public subject: string = "";
	public text: string = ``;
	$refs!: {
		mailText: HTMLFormElement;
		mailSubject: HTMLFormElement;
	};
	public questionList: Array<{ value: string; text: string }> = [];
	get IsShow() {
		return this.isShow;
	}
	async init() {
		const res = await AjaxService.getInstance().http({
			url: `questions`,
		});
		console.log(res);
	}
	protected created() {
		// eventHub.$on("tabclick", this.tabClick);
	}

	protected destroyed() {
		// eventHub.$off("tabclick", this.tabClick);
	}

	public async mounted() {}
}
</script>
