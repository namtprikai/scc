import { Component, Vue, Watch } from "vue-property-decorator";
import { eventHub } from "@/init/eventHub";
import Tinymce from "@/components/Tinymce/index.vue";
import InputTag from "@/components/InputTag/index.vue";
import Synonym from "@/components/Synonym/index.vue";
import { Ajax, MessageObj, Message, MessageList } from "@/utils/parts";
import {
	subsystemUrl,
	CLIENT_ID,
	script_logUrl,
} from "@consoletype/utils/configration";

import {
	TicketModule,
	ticketMapper,
	ticketLabelsGenerator,
	Ticket,
	RawTicket,
} from "@/store/modules/ticket";

import axios from "axios";
import { PublicTicket } from "@/api/publicTicket";
interface NoscriptMessageObj extends MessageObj {
	related_messages: Array<any>;
}
class NoScriptMessage extends Message {
	protected related_messages: Array<any>;
	constructor(message: any) {
		super(message);
		this.related_messages = message.related_messages;
	}
}
class NoScriptMessageList extends MessageList {
	protected currentMessage: NoScriptMessage | null = null;
	protected messages: Array<NoScriptMessage> = [];
	public replaceMessageList(messageList: Array<any> = []): void {
		this.messages = [];
		for (let i = 0; i < messageList.length; i++) {
			this.messages.push(new NoScriptMessage(messageList[i]));
		}

		this.lastUpdateTime = new Date();
	}
}
// @ts-ignore
@Component({
	components: { Tinymce, InputTag, Synonym },
})
export default class EvaluationCompParent extends Vue {
	protected ajax: Ajax = new Ajax();
	protected message: Array<any> = [];
	protected listLoading = false;
	protected currentLeafs: Array<any> = [];
	protected submitTimeoutId: any = null;
	protected startdate = this.$moment().subtract(1, "month").toDate();

	protected enddate = this.$moment().toDate();
	is_talkscriptNone = false;
	protected currentMessageId: string | null = null;
	protected created() {
		this.getMessages();
	}

	public async getMessages() {
		this.listLoading = true;
		const st = this.$moment(this.startdate)
			.subtract(1, "days")
			.format("YYYY-MM-DD");
		const en = this.$moment(this.enddate).add(1, "days").format("YYYY-MM-DD");
		const { startdate, enddate } = this;
		this.listLoading = true;
		await TicketModule.getTicket({
			st,
			en,
			startdate: this.$moment(startdate).startOf("day").toDate(),
			enddate: this.$moment(enddate).endOf("day").toDate(),
		});
		this.message = TicketModule.Ticket.filter(
			(o: any) => /none/gi.test(o.script_id) && o.is_processed == "0"
		);
		this.listLoading = false;
		// this.ajax
		// 	.http({
		// 		baseURL: `${subsystemUrl}`,
		// 		url: `product/${CLIENT_ID}/data_get`,
		// 		method: "GET",
		// 		params: {
		// 			script_id: "none",
		// 			type: "query_script_log"
		// 		}
		// 	})
		// 	.then((data: any) => {
		// 		console.log(data);
		// 		const { message } = data;
		// 		this.message = message;
		// 		this.listLoading = false;
		// 	});
	}

	setCurrentMessageById(id: string) {
		this.currentMessageId = id;
	}

	setCurrentMessage(o: any) {
		console.log(o);
	}

	get MessageList() {
		return this.message;
	}

	protected destroyed() {
		// eventHub.$off("setScript", this.setItem);
	}

	public done2(item: any) {
		console.log(item);
		item = Object.assign({}, item || {}, { is_processed: "1" });
		axios({
			url: `${subsystemUrl}/product/${CLIENT_ID}/public-ticket`,
			headers: {},
			method: "post",
			data: {
				values: item,
			},
		}).then(
			(res: any) => {
				console.log(res);
				this.getMessages();
			},
			(res) => {
				console.log(res);
			}
		);
		// axios({
		// 	baseURL: `${script_logUrl}`,
		// 	url: `query_script_log`,
		// 	headers: {
		// 		"Content-Type": "application/json"
		// 	},
		// 	method: "POST",
		// 	data: {
		// 		body: {
		// 			httpMethod: "PUT",
		// 			data: JSON.stringify({
		// 				TableName: "script_query_log",
		// 				Key: {
		// 					product_id: { S: CLIENT_ID },
		// 					timestamp: { N: String(item.timestamp) } // Hashキー
		// 				},
		// 				AttributeUpdates: {
		// 					is_processed: {
		// 						Action: "PUT",
		// 						Value: { N: "1" }
		// 					}
		// 				}
		// 			})
		// 		}
		// 	}
		// })
		// 	.then(
		// 		(res: any) => {
		// 			console.log(res);
		// 			this.getMessages();
		// 		},
		// 		res => {
		// 			console.log(res);
		// 		}
		// 	);
	}
}
