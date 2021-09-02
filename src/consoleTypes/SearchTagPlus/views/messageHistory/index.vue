<template>
	<div class="app-container">
		<ul class="list-group replyHistory__ul" id="line_recent_message_list">
			<li
				class="sub__sidebar__tolk replyHistory__message"
				v-for="item in messages"
				:key="item.id"
				v-bind:class="{
					__admin: item.is_admin,
					__user: !item.is_admin,
					__draft: item.is_draft,
				}"
				v-bind:id="'message' + item.id"
			>
				<div class="replyDate">
					{{ item.created_date | moment("MM/DD HH:mm") }}
				</div>
				<div
					class="sub__sidebar__tolk__balloon"
					v-bind:class="{
						__image:
							item.type == 'sticker' ||
							item.type == 'image' ||
							item.type == 'imagemap',
					}"
				>
					<div class="message_text replyHistory__message_text">
						<div
							v-bind:class="{
								__admin: item.is_admin,
								__user: !item.is_admin,
								__draft: item.is_draft,
							}"
						>
							<span
								v-if="
									item.type != 'imagemap' &&
									item.type != 'image' &&
									item.type != 'sticker' &&
									!item.is_draft
								"
								v-html="$sanitize(item.text)"
							></span>
							<span v-if="isTicket(item.text)">
								チケット情報
								<span v-if="isShow(item.id)">
									<p v-for="t in TicketText(item.text)" v-bind:key="t">
										{{ t }}
									</p>
								</span>
								<b-button
									v-if="!isShow(item.id)"
									v-on:click="show(item.id)"
									class="ml-2"
									>詳細</b-button
								>
							</span>

							<div v-if="item.is_draft">
								<span>{{ item.text }}</span>
								<div class="mx-auto">
									<b-button pill size="sm" class="mx-auto" v-on:click="select(item)"
										>下書き選択</b-button
									>
									<b-button pill size="sm" class="mx-auto" v-on:click="deleteDraft(item)"
										>下書き削除</b-button
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
		<!-- <el-table
			v-loading="listLoading"
			:data="messages"
			element-loading-text="メッセージを選択してください"
			border
			fit
			highlight-current-row
		>
			<el-table-column label="メッセージ">
				<template slot-scope="scope">{{ scope.row.text }}</template>
			</el-table-column>
			<el-table-column align="center" prop="created_at" label="Display_time" width="200">
				<template slot-scope="scope">
					<i class="el-icon-time"/>
					<span>{{ scope.row.updated_date }}</span>
				</template>
			</el-table-column>
		</el-table>-->
	</div>
</template>

<script lang="ts">
import { getList } from "@/api/table";
import { MessageList } from "@/api/messageList";
import { Component, Vue, Watch } from "vue-property-decorator";
import { MessageListModule } from "@/store/modules/messageList";
import { eventHub } from "@/init/eventHub";
import { MessageObj, VirtualStreamData } from "@/utils/parts";
import { CLIENT_ID, subsystemUrl } from "./../../utils/configration";
// @ts-ignore
@Component({
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: "success",
				draft: "gray",
				deleted: "danger",
			};
			return statusMap[status];
		},
	},
})
export default class MessageHistory extends Vue {
	private list: any = null;
	private listLoading = true;
	private listQuery = {};
	private count = 0;
	private unredMessage = 0;
	private currentMessage = null;
	private messageList: Array<VirtualStreamData> = [];
	private messages: Array<MessageObj> = [];
	private ticketData: any = {};
	isTicket(text: string) {
		return String(text).match(/<ticket-bot:\s*?(.+?)_(.+?)>/);
	}

	showList: any = {};
	show(id: any) {
		this.showList[id] = true;
		this.$forceUpdate();
	}

	isShow(id: any) {
		if (id in this.showList) {
			return true;
		}
		return false;
	}

	mapper(key: string) {
		const mapper = new Map();
		mapper.set("log_faq", "FAQ番号");
		mapper.set("log_faq_child_category", "子カテゴリ");
		mapper.set("log_faq_parent_category", "親カテゴリ");
		mapper.set("log_faq_title", "FAQタイトル");
		mapper.set("log_scenario", "シナリオログ");
		if (mapper.has(key)) {
			return mapper.get(key);
		}
		return key;
	}

	sani = '<img src="https://file.ai-x-supporter.com/114/Inkedsample_LI.jpg" />';
	TicketText(text: string) {
		const match = text.match(/<ticket-bot:\s*?(.+?)_(.+?)>/);
		if (match) {
			console.log(match);
			const [_t, rangeKey, partitionKey] = match;
			if (rangeKey in this.ticketData) {
				return this.ticketData[rangeKey];
			}
			const keyMepper = new Map();
			keyMepper.set("child_category", "子カテゴリー");
			keyMepper.set("parent_category", "親カテゴリ");
			keyMepper.set("faq_title", "タイトル");
			keyMepper.set("faq_id", "faq_id");
			keyMepper.set("mode", "モード");
			keyMepper.set("step_id", "ステップID");
			keyMepper.set("query", "クエリ");
			// this.ajax
			// 	.http({
			// 		baseURL: subsystemUrl,
			// 		url: `product/${CLIENT_ID}/data_get`,
			// 		method: "get",
			// 		params: { type: "ticket", rangeKey, partitionKey },
			// 	})
Promise.resolve()
				.then((data: any) => {
					console.log(data);
					const text = [];
					for (const key in data.message) {
						if (keyMepper.has(key)) {
							text.push(`${keyMepper.get(key)}: ${data.message[key]}`);
						} else if (key.match(/log_/)) {
							try {
								for (const value of data.message[key]) {
									text.push(`${this.mapper(key)}: ${value}`);
								}
							} catch (e) {}
						}
					}
					console.log(text);
					this.ticketData[rangeKey] = text;
					this.$forceUpdate();
				});
		}
		return "";
	}

	private async setCurrentMessage(message: any, is_scroll = false) {
		this.messages = [];
		this.currentMessage = message;
		this.count++;
		await this.setMessages(message.user_id || message.user.id);
		let scrollId = `#message${this.messageList[this.messageList.length - 1].id}`;
		if (is_scroll) {
			scrollId = `#message${message.id}`;
		}
		console.log(scrollId);
		this.$scrollTo(scrollId, 500, {
			container: "#MessageHistory",
			easing: "ease-in",
			offset: -60,
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

	public select(message: any) {
		eventHub.$emit("draftMessage", message);
	}

	public async setMessages(userId: string) {
		const data: any = await Promise.resolve();
// this.ajax.http({
// 			url: `product/${CLIENT_ID}/user/${userId}/message`,
// 			method: "get",
// 			data: {
// 				limit: 100,
// 			},
// 		});
		this.messages = data.map((d: any) => {
			const { text, ...others } = d;
			return { text: this.textFormatter(text).text, ...others };
		});
		for (let i = this.messages.length - 1; i >= 0; i--) {
			if (this.messages[i].is_draft) {
				eventHub.$emit("draftMessage", this.messages[i]);
				break;
			}
		}
		if (this.messages) {
			this.messageList = this.messages.map((o) => {
				const message: VirtualStreamData = {
					author: o.is_admin ? "support" : "me",
					id: o.id,
					index: o.id,
					avatar: "",
					message: o.text,
					attachment: null,
					isRight: o.is_admin,
				};
				return message;
			});
		}
	}

	private textFormatter(t: string): { text: string; attachment: object[] } {
		const tagRegexp = /<log-(.+?):.+?>/g;
		const tags = String(t).match(tagRegexp) || [];
		const attachment: object[] = [];
		tags.forEach((tag) => {
			const [_, key, value] = tag.match(/<log-(.+?):(.+?)>/) || [null, null, null];
			if (key && value) attachment.push({ [key]: value });
		});
		return {
			text: String(t).replace(tagRegexp, "").trim(),
			attachment,
		};
	}

	deleteDraft(message: MessageObj) {
		this.$modal.show("dialog", {
			title: `以下の下書きを削除してよろしいでしょうか？
			<div>
			<span class="response__modalTitle">下書き:</span><span class="response__modalVal">${message.text}</span>
			</div>`,
			buttons: [
				{
					title: "OK",
					handler: () => {
						this.$modal.hide("dialog");
						this.doDelete(message);
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

	doDelete(message: MessageObj) {
		// this.ajax
		// 	.http({
		// 		url: `product/${CLIENT_ID}/draft/${message.id}`,
		// 		method: "DELETE",
		// 		data: {
		// 			type: "text",
		// 			message_id: message.message_id,
		// 			text: message.text,
		// 		},
		// 	})
Promise.resolve()
			.then(
				(res) => {
					if (this.currentMessage) {
						this.setCurrentMessage(this.currentMessage);
					}
				},
				(res) => {
					this.$modal.show("下書きを削除出来ませんでした");
				}
			);
	}

	private created() {
		this.listLoading = false;
		eventHub.$on("setCurrentMessage", this.setCurrentMessage);
	}

	private destroyed() {
		eventHub.$off("setCurrentMessage", this.setCurrentMessage);
	}
}
</script>
<style lang="scss">
.replyHistory {
	margin-top: 55px;
	padding-top: 12px;
	&__ul {
		display: block !important;
		margin-bottom: 100px !important;
	}
	&__message {
		&.__hilight {
			background-color: #fff2c3;
			/* border: 2px solid #07AA0D; */
			padding-top: 20px;
			padding-bottom: 20px;
			/* border-radius: 5px; */
			margin: 6px -10px;
			padding-left: 10px;
			padding-right: 10px;
		}
		&.__unactive {
			opacity: 1;
		}
	}
	&__message_text {
		word-break: break-all;
	}
	&__userName {
		position: absolute;
		left: 60px;
		top: 0px;
		display: block;
		line-height: 50px;
		height: 40px;
	}
	&__icon {
		margin-top: 6px;
		display: inline-block;
		width: 40px;
		height: 40px;
		text-align: center;
		&::after {
			content: "";
		}
	}
	&__title--absolute {
		position: absolute;
		overflow: hidden;
		top: 0px;
		width: calc(100% - 16px);
		margin-left: -8px;
		z-index: 2;
		line-height: 50px;
		height: 50px;
		background-color: #fff;
		padding: 0 8px;
		box-shadow: 3px 3px 11px -1px rgba(219, 219, 219, 0.38);
	}
	&__textarea {
		color: #333;
		border: solid 1px #ccc;
		box-shadow: none;
		background-color: rgba(255, 255, 255, 0.9);
		min-width: 60%;
		min-height: 80px;
		display: block;
	}
	padding: 10px;
	&__button {
		color: #000 !important;
		// background-color:#aaa;
		// margin: auto 10px;
		// background-color:rgba(255,255,255,0.0);
		// font-size: 0.8rem;
		// box-shadow: none;
		// border:none;
	}
	&__buttonWrap {
		margin-top: 8px;
		font-size: 0.7rem;
		text-align: right;
		// background-color:#aaa;
	}
}
.replyHistory__userTolkList__tolk__image {
	height: 100px;
	width: 100px;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center center;
}
.replyHistory__userTolkList__tolk__stamp {
	display: block;
	width: 70px;
	height: 70px;
}
.material-icons.stamp {
	display: block;
	width: 70px;
	height: 70px;
	font-size: 70px;
}
.replyHistory__userTolkList__tolk__balloon {
	word-break: break-all;
	&.__imagemap {
		position: relative;
	}
	&.__image {
		background-color: #fff !important;
		text-align: right;
		background-position: center center;
		background-size: contain;
		width: 200px;
		height: 200px;
		background-repeat: no-repeat;
		cursor: pointer;
		&::after {
			content: "";
			position: absolute;
			top: 50%;
			left: -10px;
			margin-top: -10px;
			display: block;
			width: 0px;
			height: 0px;
			border: none !important;
		}
	}
}
.sub__sidebar {
	&__tolk {
		position: relative;
		margin: 6px auto;
		padding: 0;
		background-color: #fff;
		list-style-type: none;
		&__balloon {
			text-align: left;
			margin: 15px auto 6px;
			border-radius: 16px;
			// border:1px #aaa solid;
			border: none;
			padding: 6px;
			max-width: 90%;
			display: inline-block;
			padding: 12px;
			line-height: 1.2rem;
			font-size: 0.95rem;
			&.__image {
				background-color: #fff !important;
				text-align: right;
				background-position: center center;
				&::after {
					content: "";
					position: absolute;
					top: 50%;
					left: -10px;
					margin-top: -10px;
					display: block;
					width: 0px;
					height: 0px;
					border: none !important;
				}
			}
			&__date {
				position: absolute;
				top: 0px;
				left: 0;
				right: 0;
				bottom: auto;
				margin: auto;
				text-align: center;
				font-size: 10px;
			}
		}
		&.__user {
			text-align: left;
			.sub__sidebar__tolk__balloon {
				background-color: rgba(200, 200, 200, 0.5);
			}
		}
		&.__admin {
			text-align: right;
			.sub__sidebar__tolk__balloon {
				background-color: rgba(133, 226, 76, 0.5);
			}
		}
		&.__draft {
			@extend .__admin;
		}
	}
}
.replyDate {
	text-align: center;
	width: 100%;
	font-size: 0.7rem;
	color: #aaa;
}
</style>
