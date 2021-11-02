<template>
	<div class="admin-user tab-body">
		<div>{{ adminList }}</div>
		<div v-for="admin in adminList" :key="admin.id">
			<BCardAccordion
				:title="admin.name"
				class
				:visible="false"
				:openHandler="open"
				:openHandlArg="admin"
			>
				<template slot="header">
					<div class="h3">{{ admin.name }}</div>
				</template>
				<template slot="body">
					<b-form-group label-cols="4" label="プロダクト名" :label-for="'product-name' + admin.id">
						<b-form-input
							:id="'product-name' + admin.id"
							size
							type="text"
							v-model="admin.name"
							placeholder="name"
						></b-form-input>
					</b-form-group>
					{{ admin.config }}
					<b-form-group
						label-cols="4"
						label="表示名"
						:label-for="'label-name' + admin.id"
						v-if="admin.config"
					>
						<b-form-input
							:id="'label-name' + admin.id"
							size
							type="text"
							placeholder="name"
							v-model="admin.config.label"
						></b-form-input>
					</b-form-group>

					<b-form-group label="Using options array:">
						<b-form-checkbox-group
							:id="'checkbox-' + admin.id"
							v-model="admin.editProducts"
							:options="Products"
							name="checkbox-1"
						></b-form-checkbox-group>
					</b-form-group>
					<b-button @click="editAdmin(admin)">更新</b-button>
				</template>
			</BCardAccordion>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import { ProductsModule } from "@/store/modules/products";
import { mapGetters } from "vuex";
import DashboardParent from "@/views/dashboard/index";
import PanThumb from "@/components/PanThumb/index.vue";
import { CLIENT_ID } from "../../utils/configration";
import { AndyPasswordValidator, Wait } from "@/utils/parts";

import { AdminUserModule } from "@/store/modules/adminUser";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
const PasswordValidator = require("password-validator");
import { IAdminData, IAdminDataLocal, IPartialAdminData } from "@/api/types";
type IPartialAdminDataLocal = IPartialAdminData&IAdminDataLocal;
import { Admin } from "@/api/admin";
import {diffArray} from "@sciseed/andytools";
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
	public async open(admin: IPartialAdminData) {
		console.log(admin);
		if (admin.id) {
			const { data } = await Admin.get(admin.id);
			Object.assign(admin, data);
			admin.config = Object.assign(admin.config || {}, data.config || {});
			// await this.$nextTick();
			// await Wait(200);
			this.$forceUpdate();
		}
		console.log(this.adminList);
	}
	protected roleOptions = [
		// { value: 1, text: "ゲスト" },
		{ value: 4, text: "管理者" },
		{ value: 5, text: "オーナー" },
	];
	get Products() {
		return ProductsModule.Products.map((p) => {
			return {
				text: p.name,
				value: p.id,
			};
		});
	}
	public addAdminUser() {
		AdminUserModule.addAdminUser({
			name: this.newAdminUser.name,
			email: this.newAdminUser.email,
			password: this.newAdminUser.password,
			config: { role: this.newAdminUser.role },
			is_master: 0,
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
				} catch (e) { }
			});
	}

	public roleStyle(role: number) {
		return { "background-image": `url(${this.emptyGif(role)})` };
	}

	public emptyGif(role: number) {
		return require(`@/views/dashboard/img/${role}.png`);
	}
	async getProductList() {
		return ProductsModule.productList;
	}
	private async changeProduct(admin: IPartialAdminDataLocal) {
		const editProducts = [...admin.editProducts].sort();
		const products = [...(admin.product_id || [])].sort();
		const [add,remove]=diffArray(editProducts,products)
		if(add.length>0 || remove.length>0){
			await Admin.editProducts(admin.id, add, remove);
		}
		// AdminUserModule.getAdminUserList();

	}
	public adminList: Array<IAdminDataLocal> = [];
	setAdminList(): void {
		this.adminList = AdminUserModule.AdminList.filter((admin: IAdminData) => {
			if (UserModule.is_master) {
				return true;
			}
			// return admin.role > 1;
			return true;
		}).map((admin: IAdminData) => {
			const { id, name, email, config, product_id } = admin;
			return {
				id,
				name,
				email,
				role: config?.role || 5,
				editProducts: product_id,
				product_id,
			};
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
		await Promise.all([
			AdminUserModule.getAdminUserList(),
			ProductsModule.GetProducts(),
		]);
		await this.setAdminList();
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
	public editAdmin(admin:IPartialAdminDataLocal){
		this.$modal.show("dialog", {
			title: "情報を変更しますか？",
			text: "",
			buttons: [
				{
					title: "はい",
					handler: () => {
						console.log("SETADMINUSER はい");
						const extendedConfig = admin.config
						AdminUserModule.editAdminUser({id:admin.id, config: extendedConfig });
						this.changeProduct(admin);
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
	public changeRole(admin: any) {
		this.$modal.show("dialog", {
			title: "権限を変更しますか？",
			text: "",
			buttons: [
				{
					title: "はい",
					handler: () => {
						console.log("SETADMINUSER はい");
						const extendedConfig = Object.assign(admin.config, {
							role: admin.role || 0,
						});
						AdminUserModule.editAdminUser({ config: extendedConfig });
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
