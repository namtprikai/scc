<template>
	<div class="tab-bodya">
		<!-- <div v-if="IsShow">
			<b-card no-body>
				<b-card-body> -->
					<b-alert show variant="info">
						mailto:の件名と本文にユーザーの検索情報を挿入することができます。
					</b-alert>
					<div class="section">
						<b-form-group>
							<b-row>
								<b-col sm="3">件名</b-col>
								<b-col sm="9">
									<b-input-group inline>
										<b-select v-model="ticketTag2" v-bind:options="ticketTagList" />
										<b-input-group-append>
											<b-button @click="inToTagSubject(ticketTag2)">挿入</b-button>
										</b-input-group-append>
									</b-input-group>
								</b-col>
							</b-row>
							<b-form-input
								name="title"
								type="text"
								v-model="subject"
								ref="mailSubject"
								placeholder="例：sAI Chatのお問い合わせ[start-time]"
							/>
						</b-form-group>
					</div>
					<div class="section">
						<b-form-group>
							<b-row>
								<b-col sm="3">本文</b-col>
								<b-col sm="9">
									<b-input-group>
										<b-select v-model="ticketTag" v-bind:options="ticketTagList" />
										<b-input-group-append>
											<b-button @click="inToTag(ticketTag)">挿入</b-button>
										</b-input-group-append>
									</b-input-group>
								</b-col>
							</b-row>
							<b-form-textarea
								ref="mailText"
								placeholder="例：
以下のついてご回答をお願いします。
----------------------
■検索情報
親カテゴリ：[parent-category]
子カテゴリ：[child-category]
質問：[question]
----------------------"
								name="text"
								type="text"
								rows="14"
								v-model="text"
							></b-form-textarea>
							<div class="text-center section">
								<b-button @click="setData()" center>反映</b-button>
							</div>
						</b-form-group>
					</div>
				<!-- </b-card-body>
			</b-card>
		</div> -->
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
import {
	BotConfig2Module,
	BotConfigFlow,
	defaultBotFlow,
} from "../../store/modules/botConfig2";
import { JSDOM } from "jsdom";
import { mailTo } from "mailstring";
// @ts-ignore
@Component({
	components: {},
})
export default class MailToComp extends Vue {
	protected isShow = true;
	protected isItto: "a" | "b" = "a";
	protected currentSynonym = "";
	protected currentBotData: BotConfigFlow | {} = {};
	protected editValue = "";
	protected isEdit = false;
	protected toolbar = Toolbar;
	protected plugins = Plugins;
	protected ticketTag: string = "";
	protected ticketTag2: string = "";
	protected message =
		"要編集リクエストが送られた当時のアイテムが存在しません。";
	@PropSync("value", { type: String })
	public dataValue!: string;
	protected isMessage = false;
	public subject: string = "";
	public text: string = ``;
	$refs!: {
		mailText: HTMLFormElement;
		mailSubject: HTMLFormElement;
	};
	public ticketTagList: Array<{ value: string; text: string }> = [
		{ value: "", text: "検索情報を選択" },
		{ value: "[user-id]", text: "ユーザーID" },
		{ value: "[parent-category]", text: "親カテゴリ" },
		{ value: "[child-category]", text: "子カテゴリ" },
		{ value: "[start-time]", text: "開始日時" },
		{ value: "[end-time]", text: "終了日時" },
		{ value: "[year]", text: "年" },
		{ value: "[month]", text: "月" },
		{ value: "[day]", text: "日" },
		{ value: "[day-of-the-week]", text: "曜日" },
		{ value: "[status]", text: "完了ステータス" },
		{ value: "[faq-id]", text: "faq-id" },
		{ value: "[question]", text: "質問文" },
		{ value: "[search-query]", text: "ユーザー入力文字" },
		{ value: "[log-scenario]", text: "シナリオログ" },
	];
	get IsShow() {
		return this.isShow;
	}
	public setData() {
		const dataValue = this.dataValue;
		const dataDOM = new JSDOM(dataValue);
		const aList = dataDOM.window.document.getElementsByTagName("a");
		for (const a of aList) {
			console.log(a.href);
			const matchMailto = a.href.match(/^mailto:.+/);
			if (matchMailto) {
				const mailList = a.href.match(
					/[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9\-\.]+\.[a-zA-Z]+/g
				);
				if (mailList) {
					const href = mailTo(mailList.join(","), {
						subject: this.subject,
						body: this.text,
					});
					a.href = href.replace(/%5D/g,"]").replace(/%5B/g,"[");
					a.target = "_blank";
				}
			}
		}
		this.dataValue = dataDOM.window.document.body.innerHTML || dataValue;
	}
	public inToTagSubject(tag: string) {
		const textarea = this.$refs.mailSubject;
		const corsolPosition = textarea.selectionStart;
		this.subject =
			this.subject.slice(0, corsolPosition) +
			tag +
			this.subject.slice(corsolPosition);
	}
	public inToTag(tag: string): void {
		const textarea = this.$refs.mailText;
		const corsolPosition = textarea.selectionStart;
		this.text =
			this.text.slice(0, corsolPosition) +
			tag +
			this.text.slice(corsolPosition);
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
