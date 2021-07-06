import { BModal } from "bootstrap-vue";
import { MessageList } from "@/api/messageList";
import { eventHub } from "@/init/eventHub";
import { UserModule } from "@/store/modules/user";
import { Ajax } from "@/utils/parts";
import WrapMessage from "@/components/WrapMessage/index.vue";
import { Component, Vue } from "vue-property-decorator";
import { CLIENT_ID, subsystemUrl } from "@consoletype/utils/configration";
import { AdminUserModule } from "@/store/modules/adminUser";
import { Teikeibun } from "@/utils/teikeibun";
import { FileModule } from "@/store/modules/file";
import axios from "axios";
// @ts-ignore
@Component({
	components: { WrapMessage },
})
export default class ResponseParent extends Vue {
	protected teikeibun: Teikeibun = new Teikeibun(axios, CLIENT_ID, UserModule.name, FileModule);

	protected isHikitsugu = false;
	protected header = "";
	protected handleHeaderChange(value: string) {
		this.text = `${value}\n${this.text}`;
		this.header = this.headers[0];
	}

	protected footer = "";
	protected handleFooterChange(value: string) {
		this.text = `${this.text}\n${value}`;
		this.footer = this.footers[0];
	}

	protected ajax: Ajax = new Ajax();
	protected message: any = {};
	protected text = "";
	protected userId = "";
	protected userName = "";
	protected userDisplayName = "";
	get footers(): Array<string> {
		return [""];
	}

	get headers(): Array<string> {
		return [""];
	}

	get active() {
		return this.userId && this.message.is_read;
	}

	get state() {
		return this.userId && this.text.length > 0;
	}

	get replystate() {
		return this.userId;
	}

	protected confirm(title: string): Promise<boolean> {
		return new Promise((resolve) =>
			this.$modal.show("dialog", {
				title,
				buttons: [
					{
						title: "はい",
						handler: () => {
							this.$modal.hide("dialog");
							resolve(true);
						},
					},
					{
						title: "いいえ",
						handler: () => {
							this.$modal.hide("dialog");
							resolve(false);
						},
					},
				],
			}),
		);
	}

	reply(attr: { related_message_id: string; currentMessageId: string; currentScriptId: string | null }) {
		const { currentMessageId, currentScriptId, related_message_id } = attr;
		this.ajax
			.http({
				url: `product/${CLIENT_ID}/message/${currentMessageId}/reply/`,
				method: "PATCH",
				data: {
					talk_script_id: currentScriptId == null ? "NONE" : currentScriptId,
					related_message_id,
				},
			})
			.then(
				(res) => {},
				(res) => {},
			);
	}

	async handleSend() {
		const answer = await this.confirm(`メッセージ\n「${this.text}」\nを送信しますか？`);
		if (!answer) {
			return;
		}

		await this.sendMessage();
	}

	protected setDraft() {
		const scriptId = "NONE";
		// const currentScriptId = this.responseService.currentScriptId;
		const messageId: string = this.message.id;
		const { text } = this;
		if (text == null || text === "") {
			this.$modal.show("dialog", {
				title: "下書きが空です",
			});
			return;
		}
		if (messageId == null) {
			this.$modal.show("dialog", {
				title: "もう一度メッセージを選択してください",
			});
			return;
		}
		this.$modal.show("dialog", {
			title: `メッセージ\n「${text}」\nを下書きにしますか？`,
			buttons: [
				{
					title: "OK",
					handler: () => {
						this.$modal.hide("dialog");
						this.doSetDraft({ messageId, scriptId, text });
					},
				},
				{
					title: "CANCEL",
					handler: () => {
						this.$modal.hide("dialog");
					},
				},
			],
		});
	}

	async responseComplete() {
		const answer = await this.confirm("対応終了しますか？");
		if (!answer) {
			return;
		}
		const userName = this.userName;
		const userDisplayName = this.userDisplayName;
		const data: any = await this.ajax.http({
			url: `product/${CLIENT_ID}/user/${this.userId}/message`,
			method: "get",
			data: {
				limit: 1000,
			},
		});

		let currentMessageId = null;
		const currentScriptId = null;
		let related_message_id = null;
		let ticket = { partitionKey: null, rangeKey: null };
		const setFlg = { admin: false, user: false, ticket: false };
		for (let i = data.length - 1; i >= 0; i--) {
			if (data[i].is_admin && !setFlg.admin) {
				related_message_id = data[i].id;
				setFlg.admin = true;
			}
			if (!data[i].is_admin && !setFlg.user) {
				currentMessageId = data[i].id;
				setFlg.user = true;
			}
			if (!data[i].is_admin && !setFlg.ticket) {
				const match: any = String(data[i].text).match(/<ticket-operator:\s*?(.+?)_(.+?)>/);
				if (match) {
					const [_t, rangeKey, partitionKey] = match;
					ticket = { rangeKey, partitionKey };
					setFlg.ticket = true;
				}
			}
			if (setFlg.admin && setFlg.user && setFlg.ticket) {
				break;
			}
		}
		if (currentMessageId && related_message_id) {
			this.reply({ currentMessageId, currentScriptId, related_message_id });
			const ticketData: any = await this.ajax.http({
				baseURL: subsystemUrl,
				url: `product/${CLIENT_ID}/data_get`,
				method: "get",
				params: {
					type: "ticket",
					rangeKey: ticket.rangeKey,
					partitionKey: ticket.partitionKey,
				},
			});
			console.log(ticketData);
			this.ajax.http({
				baseURL: subsystemUrl,
				url: `product/${CLIENT_ID}/data_post`,
				method: "POST",
				data: {
					type: "ticket",
					values: Object.assign({}, ticketData.message || {}, {
						assignee_id: UserModule.id,
						assignee: UserModule.name,
						displayname: userDisplayName,
					}),
					range_key: ticket.rangeKey,
					partition_key: ticket.partitionKey,
				},
			});
		} else {
			this.$modal.show("dialog", {
				title: "対応履歴がないため、対応完了することができません",
			});
		}
	}

	process(attr: { related_message_id: string; messageId: any; scriptId: any }) {
		this.ajax
			.http({
				url: `product/${CLIENT_ID}/message/${attr.messageId}/process/`,
				method: "PATCH",
				data: {
					// "talk_script_id":this.is_talkscriptNone?"NONE":currentScriptId,
					related_message_id: attr.related_message_id,
				},
			})
			.then(
				(res) => {
					// this.is_talkscriptNone=false;
				},
				(res) => {},
			);
	}

	protected async doSetDraft(attr: { messageId: string; scriptId: string; text: string }) {
		const data: any = await this.ajax.http({
			url: `product/${CLIENT_ID}/draft`,
			method: "POST",
			data: {
				talk_script_id: attr.scriptId,
				message_id: attr.messageId,
				text: attr.text,
				type: "text",
			},
		});
		console.log(data);
		this.process({
			related_message_id: data.id,
			messageId: attr.messageId,
			scriptId: attr.scriptId,
		});
		eventHub.$emit("setCurrentMessage", this.message);
	}

	protected async sendMessage() {
		const message = await MessageList.sendMessage(
			{
				user_id: this.userId,
				type: "text",
				text: this.text,
				assignee_id: UserModule.id,
			},
			this.userName,
		);
		this.text = "";

		eventHub.$emit("setCurrentMessage", message);
	}

	protected setUserByMessage(message: any, isHikitsugu: boolean) {
		console.log(isHikitsugu);
		this.isHikitsugu = isHikitsugu;
		console.log(message);
		this.message = message;
		this.text = "";
		this.userId = message.user_id;
		this.userName = message.user ? message.user.name : "";
		this.userDisplayName = message.user ? message.user.displayname : "";
		this.header = this.headers[0];
		this.footer = this.footers[0];
	}

	protected setDraftMessage(draft: any) {
		this.text = draft.text;
	}

	protected created() {
		console.log("Created response");
		eventHub.$on("setCurrentMessage", this.setUserByMessage);
		eventHub.$on("draftMessage", this.setDraftMessage);
	}

	protected destroyed() {
		eventHub.$off("setCurrentMessage", this.setUserByMessage);
		eventHub.$off("draftMessage", this.setDraftMessage);
	}
}
