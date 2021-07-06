<template>
	<div class="app-container">
		<!-- <b-list-group>
			<b-list-group-item
				v-for="item in list"
				v-on:click="setCurrentMessage(item,$event)"
				:key="item.id"
			>{{ item.text }}</b-list-group-item>
		</b-list-group>-->
		<b-row>
			<b-col center class="text-right" lg="12">
				<b-button v-on:click="fetchData()">更新</b-button>
			</b-col>
		</b-row>
		<el-table
			v-loading="listLoading"
			:data="MessageList"
			element-loading-text="Loading"
			border
			fit
			highlight-current-row
			@row-click="setCurrentMessage"
			:row-class-name="tableRowClassName"
		>
			<el-table-column align="center" label="ユーザー名" width="95">
				<template slot-scope="scope">{{ scope.row.user.displayname }}</template>
			</el-table-column>
			<el-table-column label="メッセージ">
				<template slot-scope="scope">{{ scope.row.text }}</template>
			</el-table-column>
			<el-table-column align="center" prop="created_at" label="日時" width="160">
				<template slot-scope="scope">
					<i class="el-icon-time" />
					<span>{{ scope.row.created_date | moment("MM/DD HH:mm") }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="created_at" label width="auto">
				<template slot-scope="scope">
					<b-button v-if="scope.row.is_replied" variant="primary">対応完了</b-button>
					<p v-else-if="isOthersTaiouchu(scope.row)">
						({{ getAdminName(scope.row.user) }})
					</p>
					<b-button v-else-if="isMyTaiouchu(scope.row)" pill variant="secondary"
						>対応中</b-button
					>

					<b-button
						v-else-if="
							isResponce({
								is_replied: scope.row.is_replied,
								is_read: scope.row.is_read,
								is_processed: scope.row.is_processed,
							})
						"
						variant="outline-primary"
						v-on:click="setResponse(scope.row)"
						>返信する</b-button
					>
					<b-button
						v-if="
							isShitagaki({
								is_replied: scope.row.is_replied,
								is_read: scope.row.is_read,
								is_processed: scope.row.is_processed,
							})
						"
						variant="outline-secondary"
						>下書き</b-button
					>
					<b-button
						v-if="isHikitugu(scope.row.user, scope.row.id)"
						v-on:click="hikitsugi(scope.row, scope.row.user)"
						>引き継ぐ</b-button
					>
					<!-- <b-button
						v-if="isReplied(scope.row)"
						pill
						variant="secondary"
					>対応完了</b-button>-->
					<div
						class="messageList__balloon__delbutton"
						v-on:click="deleteMessage(scope.row.id)"
					>
						X
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts">
import { getList } from "@/api/table";
import { MessageList } from "@/api/messageList";
import { Component, Vue } from "vue-property-decorator";
import { MessageListModule } from "@/store/modules/messageList";
import { UserModule } from "@/store/modules/user";
import { eventHub } from "@/init/eventHub";
import { Ajax, MessageObj } from "@/utils/parts";
import { CLIENT_ID } from "./../../utils/configration";
import { Message, MessageBox } from "element-ui";
import { AdminUserModule } from "@/store/modules/adminUser";
import MessageListCompParent from "@/views/messageList/index";
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
export default class MessageListComp extends MessageListCompParent {}
</script>
<style lang="scss">
.new-row {
	background-color: #ffe1c4 !important;
}
</style>
<style lang="scss" scoped>
.new-row {
	background: #d9ffc4 !important;
}
.messageList {
	&__balloon {
		&__delbutton {
			position: absolute;
			right: 0px;
			top: 0px;
			width: 18px;
			height: 18px;
			border-radius: 50%;
			background-color: #ddd;
			border: 1px solid #aaa;
			text-align: center;
			line-height: 18px;
			cursor: pointer;
		}
	}
}
</style>
