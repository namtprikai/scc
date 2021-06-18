<template>
	<div>
		<p>
			<!-- <input type="file" id="file" @input="selectedFile" accept=".jpg, .png, .gif, .mp4, .jpeg" /> -->

			<b-form-file @input="selectedFile" accept=".jpg, .png, .gif, .mp4, .jpeg" placeholder="" class="mb-4 fileupload__formFile" browse-text="ファイルを選択してください" multiple></b-form-file>
			<span class="fileUpload__caption">※ファイルサイズの上限は5MBです</span>
			<label id="output"></label>
			<b-button v-on:click="confirmOpened = true" v-bind:disabled="uploadFileList == null" style="margin-right: 10px">アップロード</b-button>
		</p>
		<wrap-message v-if="isUpload" :message="message" />
		<transition name="modal" v-if="confirmOpened">
			<div class="modal-mask">
				<div class="modal-wrapper">
					<div class="modal-container">
						<div class="modal-header">
							<h3>アップロード</h3>
						</div>
						<div class="modal-body">
							<p>次のファイルをアップロードします。</p>
							<table class="file-table" align="center">
								<tr>
									<th>ローカルファイル名</th>
									<th>リモートファイル名</th>
								</tr>
								<tr v-for="(uploadFile, i) in UploadFileList" :key="i">
									<td>{{ uploadFile.name }}</td>
									<td>
										<input type="text" v-model="fileNameList[i]" :placeholder="fileNameList[i].name" />
									</td>
								</tr>
							</table>

							<br />
							<br />
							<p class="appendix">
								※アップロード先でファイル名を変更する場合は、リモートファイル名に変更後の名前を入力してください。
								<br />(未入力の場合や、スペースのみ入力されている場合は、ローカルファイル名が使用されます)
							</p>
							<p class="appendix">
								※日本語、英数字(a～z,A～Z,0～9)、および、各種記号が利用できます。
								<br />(記号は「", ?, :, |, &lt;, >, *, \, スペース」以外のもの)
							</p>
							<p>よろしいですか？</p>
						</div>
						<div class="modal-footer">
							<b-button @click="cancel()">Cancel</b-button>
							<b-button @click="ok()">OK</b-button>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import { FileModule } from '@/store/modules/file';
import { CLIENT_ID } from '../../utils/configration';
// import { debug } from 'util';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import clipboard from 'clipboard';
import FileuploadCompParent from '@/views/fileupload/index';
import WrapMessage from '@/components/WrapMessage/index.vue';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	components: { WrapMessage },
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: 'success',
				draft: 'gray',
				deleted: 'danger',
			};
			return statusMap[status];
		},
	},
})
export default class FileuploadComp extends FileuploadCompParent {
	public inputFile(file: any) {
		if (file) {
			if (file.size > 5242880) {
				this.$modal.show('dialog', {
					title: 'エラー',
					text: 'サイズは5MB以下にしてください',
					buttons: [
						{
							title: '閉じる',
						},
					],
				});
				return;
			}
			if (this.uploadFileList == null) {
				this.uploadFileList = [];
			}
			this.uploadFileList.push(file);
			this.fileNameList = [];
			for (let i = 0; i < this.uploadFileList.length; i++) {
				this.fileNameList.push(this.uploadFileList[i].name);
			}
			this.$forceUpdate();
		}
	}

	public get UploadFileList() {
		return this.uploadFileList || [];
	}

	public async upload() {
		if (this.uploadFileList.find((f: File) => !this.filenameValidate(f.name))) {
			this.$bvToast.toast('ファイル名に使用してはいけない文字が含まれています。', {
				toaster: 'b-toaster-top-center',
				variant: 'danger',
			});
			return;
		}
		this.isUpload = true;
		this.message = 'アップロード中です';
		const getReadFile = (file: File) => {
			return new Promise(r => {
				const reader: any = new FileReader();
				reader.onload = () => {
					r(reader.result);
				};
				reader.readAsDataURL(file);
			});
		};
		for (let i = 0; i < this.UploadFileList.length; i++) {
			const uploadFile = this.UploadFileList[i];
			const readFile = await getReadFile(uploadFile);
			const file: string | ArrayBuffer = readFile as string;
			const files = file.split(',');
			const base64Str = files[files.length - 1];
			const fileName = this.fileNameList[i] == '' ? uploadFile.name : this.fileNameList[i];
			console.log(fileName);
			const message = '';
			try {
				this.$modal.hide('dialog');
				this.message = `アップロード中です
				 ${i}/${this.uploadFileList.length}`;
				await FileModule.postFile({
					parent: '',
					fileName,
					base64Str,
					type: 'list',
				});
			} catch (error) {
				this.modal('失敗', 'アップロードが失敗しました。');
			}
		}
		await FileModule.getFile({ parent: '', type: 'list' });
		this.isUpload = false;
		this.modal('結果', 'アップロードが成功しました。');
		this.message = '';
	}
}
</script>
<style type="sass" lang="scss" src="@/views/fileupload/style.scss"></style>
<style type="sass" lang="scss" scoped src="@/views/fileupload/scopedstyle.scss"></style>
<style type="sass" lang="scss">
$height: 150px;

.modal-wrapper {
	margin-left: 200px;
	padding-left: 200px;
	position: relative;
}
.modal-container {
	width: 600px !important;
	margin: 0px auto;
	padding: 20px 30px;
	background-color: #fff;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
	font-family: Helvetica, Arial, sans-serif;
}
</style>
