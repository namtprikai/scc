import { BModal } from "bootstrap-vue";
import { MessageList } from "@/api/messageList";
import { eventHub } from "@/init/eventHub";
import { UserModule } from "@/store/modules/user";
import { Ajax } from "@/utils/parts";
import WrapMessage from "@/components/WrapMessage/index.vue";
import { Component, Vue } from "vue-property-decorator";
import { CLIENT_ID, subsystemUrl } from "@consoletype/utils/configration";
import { AdminUserModule } from "@/store/modules/adminUser";
// @ts-ignore
@Component({
	components: { WrapMessage },
})
export default class SendParent extends Vue {
	get headers(): Array<string> {
		return [];
	}

	protected isHikitsugu = false;
	protected header = "";
	protected handleHeaderChange(value: string) {
		this.text = `${value}\n${this.text}`;
		this.header = this.headers[0];
	}

	protected get footers(): Array<string> {
		return [];
	}

	protected footer = "";
	protected handleFooterChange(value: string) {
		this.text = `${this.text}\n${value}`;
		this.footer = this.footers[0];
	}

	protected ajax: Ajax = new Ajax();
	protected text = "";
	protected userId = "";
	protected userName = "";
	get active() {
		return this.userId;
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

	async handleSend() {
		const answer = await this.confirm(`メッセージ\n「${this.text}」\nを送信しますか？`);
		if (!answer) {
			return;
		}

		await this.sendMessage();
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

	protected setUserByUser(user: any, isHikitsugu: boolean) {
		this.text = "";
		this.userId = user.id;
		this.userName = user.displayname;
		this.header = this.headers[0];
		this.footer = this.footers[0];
	}

	protected created() {
		console.log("Created response");
		eventHub.$on("setCurrentUser", this.setUserByUser);
	}

	protected destroyed() {
		eventHub.$off("setCurrentUser", this.setUserByUser);
	}
}
