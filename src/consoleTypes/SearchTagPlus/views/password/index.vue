<template>
	<div class>
		<TabHeader>
			<b-button
				variant="primary"
				size="sm"
				class="px-5"
				v-on:click="changepw()"
				:disabled="!isChangePassword"
				>更新</b-button
			>
		</TabHeader>
		<div class="d-flex flex-column justify-content-center tab-body">
			<div class="container section">
				<b-form-group
					label-cols="4"
					label="現在のパスワード"
					label-for="password-input-1"
				>
					<b-form-input
						id="password-input-1"
						size
						type="password"
						v-model="oldpw"
						placeholder="現在のパスワード"
					></b-form-input>
				</b-form-group>
				<b-form-group
					label-for="password-input-2"
					label-cols="4"
					:invalid-feedback="invalidFeedbackPassword"
					:valid-feedback="validFeedbackPassword"
					:state="statePassword"
				>
					<template slot="label"
						>新しいパスワード
						<b-icon id="pwinfo" icon="info-circle" font-scale="1"></b-icon>
						<b-popover :target="`pwinfo`" :placement="'left'" triggers="hover focus">
							<template slot:content>
								パスワードは以下の条件を満たす必要があります。
								<br />&lt;必須&gt; <br />・8文字以上
								<br />&lt;以下のうち3つを満たすことが必須&gt; <br />・大文字を含む
								<br />・小文字を含む <br />・特殊文字を含む <br />・数字を含む
								<br />
							</template>
						</b-popover>
					</template>
					<b-form-input
						id="password-input-2"
						size
						type="password"
						v-model="newpw"
						placeholder="新しいパスワード"
					></b-form-input>
				</b-form-group>

				<b-form-group
					label-cols="4"
					label="新しいパスワード（確認用）"
					:invalid-feedback="invalidMatchPassWordMessage"
					:valid-feedback="validMatchPassWordMessage"
					:state="matchPassword"
					label-for="password-input-3"
				>
					<b-form-input
						id="password-input-3"
						size
						type="password"
						v-model="newpw2"
						placeholder="新しいパスワード（確認用）"
						:state="matchPassword"
					></b-form-input>
				</b-form-group>

				<!-- <div
					class="d-flex justify-content-center"
					v-for="(text,index) in getValidMessageList(newpw)"
					:key="index"
				>
					<div class="text-danger">{{text}}</div>
				</div>-->
				<!-- <div class="d-flex justify-content-center mt-5">
					<b-button pill class="px-5" v-on:click="changepw()" :disabled="!isChangePassword">更新</b-button>
				</div>-->
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import { mapGetters } from "vuex";
import DashboardParent from "@/views/dashboard/index";
import PanThumb from "@/components/PanThumb/index.vue";
import { CLIENT_ID } from "../../utils/configration";
import { Ajax, AndyPasswordValidator } from "@/utils/parts";
import { valid } from "mockjs";
import { Admin } from "@/api/admin";
// tslint:disable-next-line:no-var-requires
const PasswordValidator = require("password-validator");
// const passwordValidator = new PasswordValidator();
// passwordValidator.has().uppercase();
// passwordValidator.has().lowercase();

// @ts-ignore
@Component({
	components: {},
})
export default class Password extends Vue {
	private oldpw = "";
	private newpw = "";
	private newpw2 = "";
	private isEdit = false;
	private isSendmail = false;
	passwordValidator = new AndyPasswordValidator(PasswordValidator);
	@Watch("newpw")
	public pwEditing() {
		this.isEdit = true;
	}

	@Watch("newpw2")
	public validationMatch() {}

	getValidMessageList(text: string) {
		if (this.isEdit === false) {
			return [];
		}
		if (this.newpw !== "" && this.oldpw === this.newpw) {
			return ["今のパスワードと同じパスワードは設定できません"].concat(
				this.passwordValidator.getValidMessageList(text)
			);
		}
		return this.passwordValidator.getValidMessageList(text);
	}

	get matchPassword(): boolean | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.newpw === this.newpw2 && this.newpw != "" && this.statePassword;
	}

	get validMatchPassWordMessage() {
		if (this.matchPassword) {
			return "OK";
		}
	}

	get invalidMatchPassWordMessage() {
		if (this.invalidFeedbackPassword) {
			return this.invalidFeedbackPassword;
		}
		if (!this.matchPassword) {
			return "パスワードが一致しません";
		}
	}

	get statePassword(): boolean | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.passwordValidator.valid(this.newpw);
		// &&
		// 			this.passwordValidator.valid(this.newpw2)
	}

	get validFeedbackPassword(): string | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.statePassword === true ? "OK" : null;
	}

	get invalidFeedbackPassword(): string | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.passwordValidator.getValidMessage(this.newpw);
	}

	get isChangePassword(): boolean | null {
		return this.statePassword && this.matchPassword && this.oldpw !== this.newpw;
	}

	public changepw() {
		if (!this.isChangePassword) {
			return;
		}
		Admin.changePw(UserModule.id,{
					old_password: this.oldpw,
					new_password: this.newpw,
			})
			.then(
				(res: any) => {
					this.isSendmail = true;
					this.$modal.show("dialog", {
						title: "成功",
						text: "パスワードの変更に成功しました。",
						buttons: [
							{
								title: "OK",
							},
						],
					});
				},
				(res: any) => {
					this.$modal.show("dialog", {
						title: "エラー",
						text: "パスワードの変更に失敗しました。",
						buttons: [
							{
								title: "OK",
							},
						],
					});
				}
			);
	}
}
</script>

<style lang="scss" scoped>
.dashboard {
	&-container {
		margin: 30px;
	}
	&-text {
		font-size: 30px;
		line-height: 46px;
	}
}
.dashboard-editor-container {
	min-height: 100vh;
	padding: 50px 60px 0px;
}
.container > div:nth-child(n + 2) {
	margin-top: 16px;
}
</style>
