<template>
	<div>
		<b-row>
			<b-col lg="12" class="pb-2">
				<el-table
					v-loading="loadFlg"
					:data="Messages"
					element-loading-text="Loading"
					border
					fit
					highlight-current-row
					@row-click="setCurrentMessage"
				>
					<el-table-column align="center" label="メッセージ">
						<template slot-scope="scope">{{ scope.row.message.text }}</template>
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
import { UserModule } from "@/store/modules/user";
// @ts-ignore
@Component({
	components: {},
})
export default class FeedBackUser extends Vue {
	messages: Array<Message> = [];
	show = false;
	is_talkscriptNone = false;
	currentMessage: Message | null = null;
	getMessages() {
		this.show = false;
		// this.ajax
		// 	.http({
		// 		url: `product/${CLIENT_ID}/message_feedback`,
		// 		method: "GET",
		// 	})
Promise.resolve()
			.then(
				(res: any) => {
					this.messages = res.data.filter((feedback: any) => {
						try {
							if (UserModule.name.indexOf("サイシード") != -1) {
								return true;
							} else {
								JSON.parse(feedback.message.user.attribute || "{}").memo !==
									"テストユーザー";
							}
						} catch (e) {
							console.log(e);
						}
						return true;
					});
					this.show = true;
				},
				(res) => {}
			);
	}

	get Messages() {
		return this.messages;
	}

	setCurrentMessage(message: Message) {
		console.log(message);
		this.currentMessage = message;
		eventHub.$emit("clickfeedbackAdminMessage", message);
		eventHub.$emit("setHilightMessage", message);
	}
}
</script>
<style type="scss" lang="scss" scoped></style>
