<template>
	<div class="account-info tab-body">
		<b-container>
			<b-row class="mb-3">
				<b-col cols="2">アカウント名</b-col>
				<b-col cols="10">
					<div class="account-info_nameedit">
						<div v-if="!isNameEdit" class="account-info_nameedit__name">
							{{ UserName }}
						</div>
						<b-form-input
							v-else
							placeholder="アカウント名"
							@keyup.enter="isNameEdit = !isNameEdit"
							v-model="_UserName"
							class="account-info_nameedit__input"
						/>
						<div
							class="ml-2 account-info_nameedit__edit"
							@click="isNameEdit = !isNameEdit"
						>
							<b-icon-pencil variant="secondary" />
						</div>
					</div>
				</b-col>
			</b-row>
			<b-row class="mb-3 account-info_profile">
				<b-col cols="2">
					プロフィール画像
					<b-icon id="kengen" icon="info-circle" font-scale="1"></b-icon>
					<b-popover :target="`kengen`" :placement="'left'" triggers="hover focus">
						<template slot:contents>画像はgif形式のみに対応しています</template>
					</b-popover>
				</b-col>
				<b-col cols="10">
					<div
						class="account-info_profile__view"
						:style="{ backgroundImage: 'url(' + UserThumbnailUrl + ')' }"
					>
						<b-button
							variant="info"
							size="sm"
							class="account-info_profile__button"
							@click="openInputFileDialog('inputUserThumbRef')"
						>
							<b-icon-image />
						</b-button>
						<input
							type="file"
							accept="image/gif"
							ref="inputUserThumbRef"
							v-show="false"
							@change="selectedUserThumbFile"
						/>
						<b-overlay :show="isThumbUpload" no-wrap></b-overlay>
					</div>
				</b-col>
			</b-row>
			<b-row class="mb-3 account-info_topimage">
				<b-col cols="2">
					TOP画像
					<b-icon id="kengen2" icon="info-circle" font-scale="1"></b-icon>
					<b-popover :target="`kengen2`" :placement="'left'" triggers="hover focus">
						<template slot:contents>画像はgif形式のみに対応しています</template>
					</b-popover>
				</b-col>
				<b-col cols="10">
					<div
						class="account-info_topimage__view"
						:style="{ backgroundImage: 'url(' + UserBackgroudImageUrl + ')' }"
					>
						<b-button
							variant="info"
							size="sm"
							class="account-info_topimage__button"
							@click="openInputFileDialog('inputUserBackgroundImageRef')"
						>
							<b-icon-image />
						</b-button>
						<input
							type="file"
							accept="image/gif"
							ref="inputUserBackgroundImageRef"
							v-show="false"
							@change="selectedUserBackgroundImageFile"
						/>
						<b-overlay :show="isBackgroundUpload" no-wrap></b-overlay>
					</div>
				</b-col>
			</b-row>
			<b-row class="mb-3">
				<b-col cols="2">メールアドレス</b-col>
				<b-col cols="10">{{ UserEMail }}</b-col>
			</b-row>
			<b-row class="mb-3">
				<b-col cols="2">権限</b-col>
				<b-col cols="10">{{ UserRole }}</b-col>
			</b-row>
		</b-container>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { s3, PRODUCT_ID } from '../../utils/configration';
import { IAdminUser, AdminUserModule } from '@/store/modules/adminUser';
import { FileModule } from '@/store/modules/file';
import { ModalMessages } from './modalmessages';

// @ts-ignore
@Component({ name: 'AccountInfo' })
export default class AccountInfo extends Vue {
	protected roleText: { [key: number]: string } = {
		1: '-',
		2: '-',
		3: '-',
		4: '管理者',
		5: 'オーナー',
	};
	private get UserName(): string {
		return UserModule.name;
	}

	private get UserId(): string {
		return UserModule.id;
	}

	private isNameEdit: boolean = false;
	private _UserName: string = '';
	@Watch('isNameEdit')
	private async updateIsNameEdit() {
		if (!this.isNameEdit) {
			const user: IAdminUser = {
				id: UserModule.id,
				name: this._UserName,
				product_id: UserModule.product_id,
				role: UserModule.role,
				email: UserModule.email,
			};
			await AdminUserModule.setAdminUser(user);
			await UserModule.GetInfo();
		}
		this._UserName = this.UserName;
	}

	private get UserThumbFileName(): string {
		return `${this.UserId}_thumb.gif`;
	}

	private get UserBackgroudImageFileName(): string {
		return `${this.UserId}_theme.gif`;
	}

	private get UserThumbnailUrl(): string {
		return `${s3}/${PRODUCT_ID}/${this.UserThumbFileName}?${
			this.isThumbUpload
		}${new Date().getTime()}`;
	}
	private get UserBackgroudImageUrl(): string {
		return `${s3}/${PRODUCT_ID}/${this.UserBackgroudImageFileName}?${
			this.isBackgroundUpload
		}${new Date().getTime()}`;
	}

	private get UserEMail(): string {
		return UserModule.email;
	}

	private get UserRole(): string {
		return this.roleText[UserModule.role];
	}

	private openInputFileDialog(ref: string): void {
		const elm = (<any>this.$refs)[ref];
		if (elm) elm.click();
	}
	private isThumbUpload: boolean = false;
	private async selectedUserThumbFile(e: Event): Promise<void> {
		e.preventDefault();
		this.isThumbUpload = true;
		const file = this.getInputFile(e);
		await this.uploadProfileImage(file, this.UserThumbFileName);
		this.isThumbUpload = false;
	}
	private isBackgroundUpload: boolean = false;
	private async selectedUserBackgroundImageFile(e: Event): Promise<void> {
		e.preventDefault();
		this.isBackgroundUpload = true;
		const file = this.getInputFile(e);
		await this.uploadProfileImage(file, this.UserBackgroudImageFileName);
		this.isBackgroundUpload = false;
	}

	private async uploadProfileImage(
		file: File | undefined,
		fileName: string,
		fileType: string = 'image/gif',
	) {
		if (file && fileType.split(',').includes(file.type)) {
			if (file.size > 5242880) {
				this.showMessageModal('fileSizeOver');
				return;
			}
			const result = await this.uploadFile(file, fileName);
			if (result) {
				// this.$router.go(0);
			} else {
				this.showMessageModal('uploadFailed');
			}
		}
	}

	private showMessageModal(messageKey: string) {
		let data = ModalMessages[messageKey] as any;
		if (Object.keys(data).length > 0) this.$modal.show(data);
	}

	private getInputFile(e: Event, n: number = 0): File | undefined {
		const files = (<HTMLInputElement>e.target).files;
		if (files?.length) {
			const file = files[n];
			return file;
		}
		return undefined;
	}

	private readFileToBase64(file: File) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				if (reader.result) {
					try {
						const list = (<string>reader.result).split(',');
						resolve(list[list.length - 1]);
					} catch (error) {
						reject(undefined);
					}
				}
			};
			reader.readAsDataURL(file);
		});
	}

	private async uploadFile(file: File, fileName: string): Promise<boolean> {
		const base64Str = (await this.readFileToBase64(file)) as string;
		if (base64Str) {
			try {
				await FileModule.postFile({
					parent: '',
					fileName,
					base64Str,
					type: 'list',
				});
				return true;
			} catch {}
		}
		return false;
	}
}
</script>
<style lang="scss" scoped>
.account-info {
	&_nameedit {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		&__name {
			max-width: 250px;
		}
		&__input {
			max-width: 250px;
		}
		&__edit {
			transition: transform 100ms ease-in-one;
			&:hover {
				transform: scale(1.1);
			}
		}
	}
	&_profile {
		min-height: 100px;
		&__view {
			position: relative;
			width: 100px;
			height: 100px;
			background-repeat: no-repeat;
			background-position: center center;
			background-size: cover;
			border-radius: 50%;
		}
		&__img {
		}
		&__button {
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}
	&_topimage {
		min-height: 300px;
		&__view {
			position: relative;
			width: 600px;
			height: 300px;
			background-repeat: no-repeat;
			background-position: center center;
			background-size: contain;
		}
		&__img {
		}
		&__button {
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}
}
</style>
