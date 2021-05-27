import { v4 } from 'uuid';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import { FileModule } from '@/store/modules/file';
import { PRODUCT_ID } from '@product/utils/configration';
// import { debug } from 'util';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import clipboard from 'clipboard';
import { UserModule } from '@/store/modules/user';
function wait(time: number) {
	return new Promise((r: Function) => {
		setTimeout(() => {
			r();
		}, time);
	});
}
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
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
export default class FileuploadCompParent extends Vue {
	protected clipBoard = new clipboard('.clipcopy');
	protected uploadFileList: any = null;
	protected confirmOpened = false;
	protected isUpload = false;
	public filterText = '';
	message = '';
	protected fileNameList: any = [];
	get Title() {
		console.log(this.$router.currentRoute);
		return this.$router.currentRoute.meta.title;
	}

	getTag(fileName: string) {
		return `<a href="https://file.ai-x-supporter.com/${PRODUCT_ID}/${fileName}" target="_blank" style="width:100%;max-width:100%;height:auto;display:block;"><img style="width:90%;max-width:90%;height:auto;" src="https://file.ai-x-supporter.com/${PRODUCT_ID}/${fileName}" /></a>`;
	}

	public created() {
		this.search();
	}

	public reload() {
		this.search();
	}

	public async search() {
		const parent = '';
		const type = 'list';
		await FileModule.getFile({ parent, type });
		this.$forceUpdate();
	}

	public async deleate(fileName: string) {
		const parent = '';
		const type = 'list';
		const message = '';
		this.$modal.show('dialog', {
			title: '削除してよろしいですか？',
			text: '',
			buttons: [
				{
					title: 'はい',
					handler: async () => {
						try {
							await FileModule.deleateFile({ parent, fileName });

							this.modal('結果', '削除が成功しました。');
						} catch (error) {
							this.modal('失敗', '削除が失敗しました。');
						}
						this.$modal.hide('dialog');
					},
				},
				{
					title: 'いいえ',
				},
			],
		});
		this.$forceUpdate();
	}

	public filenameValidate(fileName: string): boolean {
		if (!fileName.match(/[/\\\<\>\|\"\s\?\:\*\!]/g)) {
			return true;
		}
		return false;
	}

	public async upload() {
		if (this.uploadFileList.find((f: File) => !this.filenameValidate(f.name))) {
			this.$bvToast.toast('ファイル名に使用してはいけない文字が含まれています。', {
				toaster: 'b-toaster-top-center',
			});
			return;
		}
		this.isUpload = true;
		this.message = 'アップロード中です';
		const getReadFile = (file: File) =>
			new Promise(r => {
				const reader: any = new FileReader();
				reader.onload = () => {
					r(reader.result);
				};
				reader.readAsDataURL(file);
			});
		for (let i = 0; i < this.uploadFileList.length; i++) {
			const uploadFile = this.uploadFileList[i];
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

	imagemodal(imageUrl: string, fileName: string) {
		this.modal(
			fileName,
			`
		<div style="background-image:url(${imageUrl});width:400px;height:400px;background-size:contain;background-repeat:no-repeat;background-position:center center;">
					</div>
		`,
		);
	}

	public modal(title: string, message: string) {
		this.$modal.show('dialog', {
			title,
			text: message,
			buttons: [
				{
					title: 'OK',
				},
			],
		});
	}

	public selectedFile(files: any) {
		if (files) {
			for (let i = 0; i < files.length; i++) {
				if (files[i].size > 5242880) {
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
			}
			this.uploadFileList = files;
			this.fileNameList = [];
			for (let i = 0; i < this.uploadFileList.length; i++) {
				this.fileNameList.push(this.uploadFileList[i].name);
			}
			this.$forceUpdate();
		}
	}

  get FileList() {
		return FileModule.FileList.filter((file: { Key: string }) => {
			const otherThumbReg = new RegExp('^[0-9]+_thumb.gif$|^[0-9]+_theme.gif$');
			const thumbReg = new RegExp(`^${UserModule.id}_thumb.gif$|^${UserModule.id}_theme.gif$`);
			if (otherThumbReg.test(file.Key) && !thumbReg.test(file.Key)) {
				return false;
			}
			return true;
		}).filter((file: { Key: string }) => {
			if (this.filterText == '') {
				return true;
			}
			return new RegExp(this.filterText, 'g').test(file.Key);
    });
  }
	public ok() {
		this.confirmOpened = false;
		this.upload();
	}

	public cancel() {
		this.confirmOpened = false;
	}
}
