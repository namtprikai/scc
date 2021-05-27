export interface IModalMessageValue {
	title: string;
	text: string;
	buttons: { title: string }[];
}
export const ModalMessages: { [key: string]: IModalMessageValue } = {
	uploadFailed: {
		title: 'アップロード失敗',
		text: 'アップロードが失敗しました',
		buttons: [{ title: '閉じる' }],
	},
	fileSizeOver: {
		title: 'エラー',
		text: 'サイズは5MB以下にしてください',
		buttons: [{ title: '閉じる' }],
	},
};
