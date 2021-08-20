<template>
	<b-container>
		<b-form>
			<b-form-row class="mt-2">
				<b-col sm="6" class="mb-2">
					<el-date-picker placeholder="From" class="w-100" v-model="st" />
				</b-col>
				<b-col sm="6" class="mb-2">
					<el-date-picker placeholder="To" class="w-100" v-model="en" />
				</b-col>
			</b-form-row>
			<b-form-row class="mb-2">
				<b-col>
					<b-form-input v-model="q" placeholder="フリーワード検索" />
				</b-col>
			</b-form-row>
			<b-form-row class="mb-2">
				<b-col>
					<b-form-group label="送信者">
						<b-form-select v-model="adminId" v-bind:options="options" />
					</b-form-group>
				</b-col>
			</b-form-row>
			<b-form-row class="mb-2">
				<b-col class="text-center">
					<b-button
						class="w-100"
						variant="outline-primary"
						v-bind:disable="loading"
						v-on:click="search"
						>検索</b-button
					>
				</b-col>
			</b-form-row>
		</b-form>
		<div>
			<b-button v-on:click="download()">CSVダウンロード</b-button>
		</div>
		<el-table
			v-loading="loading"
			v-bind:data="messages"
			element-loading-text="検索中"
			border
			fit
			highlight-current-row
			v-on:row-click="setCurrentMessage"
		>
			<el-table-column label="ユーザー名">
				<template slot-scope="scope">{{ scope.row.user.displayname }}</template>
			</el-table-column>
			<el-table-column label="日時">
				<template slot-scope="scope">{{ scope.row.created_date }}</template>
			</el-table-column>
			<el-table-column label="対応者">
				<template slot-scope="scope">{{ scope.row.assignee_name }}</template>
			</el-table-column>
			<el-table-column label="メッセージ">
				<template slot-scope="scope">{{ scope.row.text }}</template>
			</el-table-column>
		</el-table>
	</b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { moment } from '@/init/moment';
import { MessageList } from "@/api/messageList";
import { eventHub } from "@/init/eventHub";
import { AdminUserModule } from "@/store/modules/adminUser";

// @ts-ignore
@Component({})
export default class MessageSearch extends Vue {
	private loading = true;
	private q = "";
	private st = moment().subtract(1, "month").toDate();

	private en = moment().toDate();
	private adminId = "all";
	private messages: any[] = [];

	get options() {
		return [
			{ value: "all", text: "すべて" },
			{ value: "user", text: "ユーザー" },
			...this.AdminList.map(({ id, name }: any) => ({ text: name, value: id })),
		];
	}

	get AdminList() {
		return AdminUserModule.AdminList;
	}

	private findAdmin(adminId: string) {
		return this.AdminList.find(({ id }: any) => id === adminId);
	}

	private setCurrentMessage(message: any, e: Event) {
		eventHub.$emit("setCurrentMessage", message, true);
	}

	public async download() {
		const dataList: any = this.messages.map((message) => {
			const admin = this.findAdmin(message.assignee_id);
			let adminName = "-";
			if (admin) {
				adminName = admin.name;
			}
			return [
				message.user.displayname || "-",
				message.created_date || "-",
				adminName || "-",
				message.text || "-",
			];
		});
		console.log(dataList);
		const data: any = dataList
			.map((ar: any) => {
				const r = ar.map((a: any) => `"${String(a).replace(/"/g, "'")}"`);
				return r.join(",");
			})
			.join("\n");
		console.log(data);
		const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
		const blob = new Blob([bom, data], { type: "text/csv" });
		const url = (window.URL || window.webkitURL).createObjectURL(blob);
		const link = document.createElement("a");
		link.download = "messageList.csv";
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	public async search() {
		let owner: "all" | "admin" | "user" = "admin";
		if (this.adminId !== "user" && this.adminId !== "all") {
			owner = "admin";
		} else {
			owner = this.adminId;
		}
		this.loading = true;
		const messages = await MessageList.searchMessageList({
			q: encodeURI(this.q),
			limit: 300,
			owner,
			st: moment(this.st).format("YYYY-MM-DD"),
			en: moment(this.en).add(1, "day").format("YYYY-MM-DD"),
			page: 1,
		});
		if (this.adminId === "all" || this.adminId === "user") {
			this.messages = messages;
		} else {
			this.messages = messages.filter(({ is_admin, assignee_id }: any) => {
				if (is_admin && assignee_id === this.adminId) {
					return true;
				}
				return false;
			});
		}
		this.messages = messages.map((m: any) => {
			const admin = this.findAdmin(m.assignee_id);
			// tslint:disable-next-line:variable-name
			const assignee_name = admin ? admin.name : "なし";
			return { ...m, assignee_name };
		});
		this.loading = false;
	}

	public async created() {
		await AdminUserModule.getAdminUserList();
		this.loading = false;
	}
}
</script>
