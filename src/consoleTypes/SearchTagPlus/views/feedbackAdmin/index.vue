<template>
	<div>
		<b-row>
			<b-form-select v-model="date" class="mb-3">
				<option value="1">1日前</option>
				<option value="3">3日前</option>
				<option value="7">7日前</option>
			</b-form-select>
		</b-row>
		<b-row>
			<b-col lg="12" class="pb-2">
				<el-table
					v-loading="loadFlg"
					:data="FeedbackList"
					element-loading-text="Loading"
					border
					fit
					highlight-current-row
					@row-click="setFeedback"
				>
					<el-table-column align="center" label="名前">
						<template slot-scope="scope">{{ scope.row.assignee_id }}</template>
					</el-table-column>
					<el-table-column align="center" label="メッセージ">
						<template slot-scope="scope">{{ scope.row.text }}</template>
					</el-table-column>
					<el-table-column align="center" label="ユーザー名">
						<template slot-scope="scope">{{ scope.row.displayname }}</template>
					</el-table-column>
				</el-table>
			</b-col>
		</b-row>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { eventHub } from "@/init/eventHub";
import {
	apiUrl,
	scriptUrl,
	CLIENT_ID,
	subsystemUrl,
} from "./../../utils/configration";
import { Message } from "@/utils/parts";
@Component({
	components: {},
})
export default class FeedbackAdmin extends Vue {
	currentMessage: Message | null = null;
	loadFlg = false;
	show = false;
	messages: Array<Message> = [];
	adminmessages: Array<Message> = [];
	date = "1";
	protected startdate = this.$moment().subtract(1, "month").toDate();

	created() {
		this.getAdminMessages();
	}

	getAdminMessages() {
		this.adminmessages = [];
		this.show = false;
		const yesterdayDate = new Date(
			new Date().getTime() - 1000 * 60 * 60 * 24 * parseInt(this.date)
		);
		const toDoubleDigits = (_num: number) => {
			let num = String(_num);
			num += "";
			if (num.length === 1) {
				num = "0" + num;
			}
			return num;
		};
		// let utcDate=new Date(Date.UTC(nowDate.getFullYear(),nowDate.getMonth()+1,nowDate.getDay()));
Promise.resolve()
		// AjaxService.getInstance()
		// 	.http({
		// 		url: `product/${CLIENT_ID}/search_message`,
		// 		method: "GET",
		// 		params: {
		// 			mode: "and",
		// 			q: "",
		// 			owner: "admin",
		// 			st: `${yesterdayDate.getUTCFullYear()}-${toDoubleDigits(
		// 				yesterdayDate.getUTCMonth() + 1
		// 			)}-${toDoubleDigits(yesterdayDate.getUTCDate())}`,
		// 		},
		// 	})
			.then(
				(res: any) => {
					console.log(res);
					try {
						this.adminmessages = res.filter(
							(el: any) =>
								el.message_feedback_id === null &&
								el.assignee_id !== null &&
								el.type == "text" &&
								el.text != ""
						);
						// .filter((message: Message | any) => {
						// 	if (UserModule.name.indexOf("サイシード") != -1) {
						// 		return true;
						// 	}
						// 	try {
						// 		return (
						// 			JSON.parse(message.user.attribute || "{}").memo !=
						// 			"テストユーザー"
						// 		);
						// 	} catch (e) {}
						// 	return true;
						// });
					} catch (e) {
						console.log(e);
					}
					this.show = true;
				},
				(res) => {}
			);
	}

	getMessages() {
		// AjaxService.getInstance()
		// 	.http({
		// 		url: `product/${CLIENT_ID}/message_feedback`,
		// 		method: "GET",
		// 	})
Promise.resolve()
			.then(
				(res: any) => {
					this.messages = res;
				},
				(res) => {}
			);
	}

	get FeedbackList() {
		return this.adminmessages;
	}

	setFeedback(message: Message) {
		console.log(message);
		this.currentMessage = message;
		eventHub.$emit("setCurrentMessage", message);
		eventHub.$emit("clickfeedbackAdminMessage", message);
		eventHub.$emit("setHilightMessage", message);
	}
}
</script>
<style type="scss" lang="scss" scoped></style>
