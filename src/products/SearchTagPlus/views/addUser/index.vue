<template>
	<div class>
		<TabHeader>
			<b-button variant="primary" size="sm" v-on:click="addAdminUser" :disabled="!isAddUser">追加</b-button>
		</TabHeader>

		<div class="tab-body">
			<div class="section">
				<b-form-group label-cols="4" label="ユーザー名" label-for="adduser-input-1" :invalid-feedback="invalidFeedbackName" :valid-feedback="validFeedbackName" :state="stateName">
					<b-form-input id="adduser-input-1" v-model="name" placeholder="ユーザー名"></b-form-input>
				</b-form-group>
			</div>
			<div class="section">
				<b-form-group label-cols="4" label="メールアドレス" label-for="adduser-input-2" :invalid-feedback="invalidFeedbackMail" :valid-feedback="validFeedbackMail" :state="stateMail">
					<b-form-input id="adduser-input-2" type="email" v-model="email" placeholder="メールアドレス"></b-form-input>
				</b-form-group>
			</div>
			<div class="section">
				<b-form-group label-cols="4" label="権限" label-for="adduser-input-3">
					<b-form-select id="adduser-input-3" v-model="role" :options="roleOptions"></b-form-select>
				</b-form-group>
			</div>
			<div class="section">
				<b-form-group label-cols="4" label="パスワード" label-for="adduser-input-4" :invalid-feedback="invalidFeedbackPassword" :valid-feedback="validFeedbackPassword" :state="statePassword">
					<b-form-input id="adduser-input-4" type="password" v-model="pw1" placeholder="パスワード" :state="Valid"></b-form-input>
				</b-form-group>
			</div>
			<div class="section">
				<b-form-group
					label-cols="4"
					label="パスワード(確認用)"
					label-for="adduser-input-5"
					:invalid-feedback="!matchPassword ? 'パスワードが一致しません' : ''"
					:valid-feedback="matchPassword ? 'OK' : ''"
					:state="matchPassword"
				>
					<b-form-input id="adduser-input-5" type="password" v-model="pw2" placeholder="パスワード(確認用)" :state="Valid"></b-form-input>
				</b-form-group>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Ajax, AndyPasswordValidator } from '@/utils/parts';
import { Type } from '@/components/Charts';

import { CLIENT_ID } from '../../utils/configration';
const PasswordValidator = require('password-validator');

// @ts-ignore
@Component({ name: 'AddUser' })
export default class AddUser extends Vue {
	private isEdit = false;

	private name = '';
	private email = '';
	private pw1 = '';
	private pw2 = '';
	private role = 4;
	private roleOptions = [
		{ value: 4, text: '管理者' },
		{ value: 5, text: 'オーナー' },
	];

	passwordValidator = new AndyPasswordValidator(PasswordValidator);
	private ajax: Ajax = new Ajax();

	@Watch('pw1')
	public pwEditing() {
		this.isEdit = true;
	}

	@Watch('pw2')
	public validationMatch() {}

	getValidMessageList(text: string) {
		if (this.isEdit === false) {
			return [];
		}

		return this.passwordValidator.getValidMessageList(text);
	}

	public addAdminUser(): void {
		if (!this.isAddUser) {
			return;
		}
		this.ajax
			.http({
				url: `product/${CLIENT_ID}/admin_user/`,
				method: 'POST',
				data: {
					name: this.name,
					email: this.email,
					password: this.pw1,
					role: this.role,
				},
			})
			.then(data => {
				this.$modal.show('dialog', {
					title: '成功',
					text: 'アカウントの追加に成功しました',
					buttons: [
						{
							title: 'OK',
							handler: () => {
								this.$modal.hide('dialog');
							},
						},
					],
				});
			})
			.catch(error => {
				try {
					if (error.response.data.message == 'Already exists.') {
						this.$modal.show('dialog', {
							title: '失敗',
							text: 'すでに登録されています',
							buttons: [
								{
									title: 'OK',
									handler: () => {
										this.$modal.hide('dialog');
									},
								},
							],
						});
					}
				} catch (e) {}
			});
	}

	get matchPassword(): boolean | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.pw1 === this.pw2;
	}

	get statePassword(): boolean | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.passwordValidator.valid(this.pw1) && this.passwordValidator.valid(this.pw2);
	}

	get validFeedbackPassword(): string | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.statePassword === true ? 'OK' : '';
	}

	get invalidFeedbackPassword() {
		return this.passwordValidator.getValidMessage(this.pw1);
	}

	get stateMail(): boolean | null {
		if (this.isEdit === false) {
			return null;
		}
		if (/.+@.+\..+/.test(this.email)) {
			return true;
		}
		return false;
	}

	get validFeedbackMail(): string | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.stateMail === true ? 'OK' : '';
	}

	get invalidFeedbackMail(): string | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.stateMail === true ? '' : '正しいメールアドレスを入力してください';
	}

	get stateName(): boolean | null {
		if (this.isEdit === false) {
			return null;
		}
		if (this.name === '') {
			return false;
		}
		return true;
	}

	get invalidFeedbackName(): string | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.stateName ? '' : 'ユーザー名を入力してください';
	}

	get validFeedbackName(): string | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.stateName ? 'OK' : '';
	}

	get isAddUser(): boolean | null {
		if (this.isEdit === false) {
			return null;
		}
		return this.stateName && this.stateMail && this.statePassword && this.matchPassword;
	}
}
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
	min-height: 100vh;
	padding: 50px 60px 0px;
}
.container > div:nth-child(n + 2) {
	margin-top: 16px;
}
</style>
