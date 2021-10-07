<template>
	<div class="admin-user tab-body">
		<el-table
			v-loading="listLoading"
			:data="AdminList"
			element-loading-text="Loading"
			border
			fit
			highlight-current-row
		>
			<el-table-column align="center" label="ユーザー名">
				<template slot-scope="scope">{{ scope.row.name }}</template>
			</el-table-column>
			<el-table-column align="center" label="メールアドレス">
				<template slot-scope="scope">{{ scope.row.email }}</template>
			</el-table-column>
			<el-table-column align="center">
				<span slot="header">
					権限
					<b-icon id="kengen" icon="info-circle" font-scale="1"></b-icon>
					<b-popover :target="`kengen`" :placement="'left'" triggers="hover focus">
						<template slot:contents>
							名称と権限は以下の通りです。
							<br />オーナー <br />・アカウントの発行・削除ができます。
							<br />・FAQ設定メニューが使用できます。
							<br />・管理画面からFAQの検索ができます（※sAI Searchのみ） <br />●管理者
							<br />・FAQ設定メニューが使用できます。
							<br />・管理画面からFAQの検索ができます（※sAI Searchのみ）
						</template>
					</b-popover>
				</span>
				<template slot slot-scope="scope">
					<b-form-select
						v-on:change="changeRole(scope.row)"
						v-model="scope.row.role"
						:options="roleOptions"
						size="sm"
						class="mt-3"
						:disabled="!isValid(scope.row.id)"
					></b-form-select>
				</template>
			</el-table-column>
			<el-table-column align="center" label="バッジ">
				<span slot="header">
					バッジ
					<b-icon id="badge" icon="info-circle" font-scale="1"></b-icon>
					<b-popover :target="`badge`" :placement="'left'" triggers="hover focus">
						<template slot:contents>
							権限が上がると、バッジが豪華になります。
							<br />
						</template>
					</b-popover>
				</span>
				<template slot-scope="scope">
					<div
						:class="{
							'role--1': scope.row.role == 1,
							'role--2': scope.row.role == 2,
							'role--3': scope.row.role == 3,
							'role--4': scope.row.role == 4,
							role: true,
						}"
						:style="roleStyle(scope.row.role)"
					></div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
					<b-button
						v-on:click="deleateAdmin(scope.row)"
						:disabled="!isValid(scope.row.id)"
						>削除</b-button
					>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import { mapGetters } from "vuex";
import DashboardParent from "@/views/dashboard/index";
import PanThumb from "@/components/PanThumb/index.vue";
import { CLIENT_ID } from "../../utils/configration";
import { AndyPasswordValidator } from "@/utils/parts";

import { AdminUserModule } from "@/store/modules/adminUser";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
const PasswordValidator = require("password-validator");
import { IAdminData } from "@/api/types";
import {Admin} from "@/api/admin";
// @ts-ignore
@Component({
	components: {},
})
export default class AdminUser extends Vue {
	private listLoading = true;
	passwordValidator = new AndyPasswordValidator(PasswordValidator);
	private newAdminUser = {
		name: "",
		email: "",
		role: 4,
		password: "",
	};

	protected roleOptions = [
		// { value: 1, text: "ゲスト" },
		{ value: 4, text: "管理者" },
		{ value: 5, text: "オーナー" },
	];

	public addAdminUser() {
		AdminUserModule.addAdminUser({
					name: this.newAdminUser.name,
					email: this.newAdminUser.email,
					password: this.newAdminUser.password,
					config:{role:[this.newAdminUser.role]},
					is_master:0
				})
			.then((data) => {
				this.$modal.show("dialog", {
					title: "成功",
					text: "アカウントの追加に成功しました",
					buttons: [
						{
							title: "OK",
							handler: () => {
								this.$modal.hide("dialog");
							},
						},
					],
				});
			})
			.catch((error) => {
				try {
					if (error.response.data.message == "Already exists.") {
						this.$modal.show("dialog", {
							title: "失敗",
							text: "すでに登録されています",
							buttons: [
								{
									title: "OK",
									handler: () => {
										this.$modal.hide("dialog");
									},
								},
							],
						});
					}
				} catch (e) {}
			});
	}

	public roleStyle(role: number) {
		return { "background-image": `url(${this.emptyGif(role)})` };
	}

	public emptyGif(role: number) {
		return require(`@/views/dashboard/img/${role}.png`);
	}

	get AdminList() {
		return AdminUserModule.AdminList.filter((admin: IAdminData) => {
			if (UserModule.is_master) {
				return true;
			}
			// return admin.role > 1;
			return true;
		}).map((admin: IAdminData) => {
			const { id, name, email, config } = admin;
			return { id, name, email, role: config.role || 0 };
		});
	}

	get stateName() {
		if (this.newAdminUser.name.length === 0) {
			return false;
		}
		return true;
	}

	get validFeedbackName() {
		return this.stateName === true ? "Thanks" : "";
	}

	get invalidFeedbackName() {
		if (this.newAdminUser.name.length === 0) {
			return "名前を入力してください";
		}
		return "";
	}

	get statePassword() {
		return this.passwordValidator.valid(this.newAdminUser.password);
	}

	get validFeedbackPassword() {
		return this.statePassword === true ? "使用可能なパスワードです" : "";
	}

	get invalidFeedbackPassword() {
		return this.passwordValidator.getValidMessage(this.newAdminUser.password);
	}

	get stateMail() {
		if (/.+@.+\..+/.test(this.newAdminUser.email)) {
			return true;
		}
		return false;
	}

	get validFeedbackMail() {
		return this.stateMail === true ? "Thanks" : "";
	}

	get invalidFeedbackMail() {
		return this.stateMail === true
			? ""
			: "正しいメールアドレスを入力してください";
	}

	public async created() {
		await AdminUserModule.getAdminUserList();
		this.listLoading = false;
	}

	public deleateAdmin(admin: IAdminData) {
		this.$modal.show("dialog", {
			title: "アカウントを削除しますか？",
			text: "",
			buttons: [
				{
					title: "はい",
					handler: () => {
						// admin.role = 0;
						AdminUserModule.deleteAdminUser(admin.id);
						this.$modal.hide("dialog");
					},
				},
				{
					title: "いいえ",
					handler: () => {
						this.$modal.hide("dialog");
					},
				},
			],
		});
	}

	public changeRole(admin: IAdminData) {
		this.$modal.show("dialog", {
			title: "権限を変更しますか？",
			text: "",
			buttons: [
				{
					title: "はい",
					handler: () => {
						console.log("SETADMINUSER はい");
						AdminUserModule.editAdminUser(admin);
						this.$modal.hide("dialog");
					},
				},
				{
					title: "いいえ",
					handler: () => {
						AdminUserModule.getAdminUserList();
						this.$modal.hide("dialog");
					},
				},
			],
		});
	}

	private isValid(id: number): boolean {
		if (UserModule.is_master) {
			return true;
		}
		return UserModule.id !== id;
	}
}
</script>

<style lang="scss" scoped>
.role {
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center center;
	width: 150px;
	height: 150px;
	border-radius: 5%;
	margin: 10px auto;
	box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}
.dashboard {
	&-container {
		margin: 30px;
	}
	&-text {
		font-size: 30px;
		line-height: 46px;
	}
}
.emptyGif {
	display: block;
	width: 45%;
	margin: 0 auto;
}
.dashboard-editor-container {
	background-color: #e3e3e3;
	min-height: 100vh;
	padding: 50px 60px 0px;
	.pan-info-roles {
		font-size: 12px;
		font-weight: 700;
		color: #333;
		display: block;
	}
	.info-container {
		position: relative;
		margin-left: 190px;
		height: 150px;
		line-height: 200px;
		.display_name {
			font-size: 48px;
			line-height: 48px;
			color: #212121;
			position: absolute;
			top: 25px;
		}
	}
}
</style>
