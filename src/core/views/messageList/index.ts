import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { Component, Vue } from 'vue-property-decorator';
import { MessageListModule } from '@/store/modules/messageList';
import { UserModule } from '@/store/modules/user';
import { eventHub } from '@/init/eventHub';
import { Ajax, MessageObj } from '@/utils/parts';
import { CLIENT_ID } from '@consoletype/utils/configration';
import { Message, MessageBox } from 'element-ui';
import { AdminUserModule } from '@/store/modules/adminUser';

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
export default class MessageListCompParent extends Vue {
	protected listLoading = true;
	protected ajax: Ajax = new Ajax();
	protected listQuery = {};
	protected created() {
		this.fetchData();
	}

	get MessageList() {
		return MessageListModule.messageList;
	}

	tableRowClassName({ row, rowIndex }: any) {
		if (new Date().getTime() - new Date(row.created_date).getTime() < 1000 * 90) {
			return 'new-row';
		}
		return '';
	}

	isReplied(message: any) {
		// if (this.isBot(message)) {
		// 	return false;
		// }
		if (message.is_replied) {
			return true;
		}
		return false;
	}

	public isShitagaki(o: { is_replied: boolean; is_processed: boolean }) {
		return !o.is_replied && o.is_processed;
	}

	public isMyTaiouchu(message: MessageObj): boolean {
		if (!message.user || !message.user.assignee || message.user.assignee.length == 0) {
			return false;
		}
		const { admin_user_id } = message.user.assignee[0];
		const isMe = admin_user_id == UserModule.id;
		return !!isMe && this.isTaiouchu(message);
	}

	public isOthersTaiouchu(message: MessageObj): boolean {
		if (!message.user || !message.user.assignee || message.user.assignee.length == 0) {
			return false;
		}
		const { admin_user_id } = message.user.assignee[0];
		const isMe = admin_user_id == UserModule.id;
		return !isMe && this.isTaiouchu(message);
	}

	public isTaiouchu(o: { is_replied: boolean; is_read: boolean; is_processed: boolean }): boolean {
		return !o.is_replied && o.is_read && !o.is_processed;
	}

	public isResponce(o: { is_replied: boolean; is_read: boolean; is_processed: boolean }): boolean {
		return !o.is_replied && !o.is_read && !o.is_processed;
	}

	protected setCurrentMessage(message: any, e?: Event) {
		eventHub.$emit('setCurrentMessage', message, this.isHikitugu(message.user, message.id));
	}

	hikituguFlg: any = null;
	protected isHikitugu(user: any, messageId: number) {
		if (this.hikituguFlg !== null && this.hikituguFlg === messageId) {
			return false;
		}
		if (UserModule.Role.size>0) {
			try {
				const { admin_user_id } = user.assignee[0];
				if (admin_user_id === UserModule.id) {
					return false;
				}
			} catch (e) {
				console.log(e);
				return false;
			}
			return true;
		}

		return false;
	}

	public deleteMessage(messageId: string) {
		this.$modal.show('dialog', {
			title: 'メッセージを非表示にしますか？',
			buttons: [
				{
					title: 'OK',
					handler: () => {
						this.$modal.hide('dialog');
						this.doDelete(messageId);
					},
				},
				{
					title: 'CANCEL',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
	}

	doDelete(messageId: any) {
		this.ajax.http({
			url: `product/${CLIENT_ID}/message/${messageId}/suspend/`,
			method: 'PATCH',
			data: {},
		});
	}

	hikitsugi(message: MessageObj, admin: any) {
		const adminname = this.getAdminName(admin);
		this.$modal.show('dialog', {
			title: `${adminname}さんが対応中です。引き継ぎますか？`,
			buttons: [
				{
					title: 'OK',
					handler: () => {
						this.$modal.hide('dialog');
						this.dohikitsugi(message);
					},
				},
				{
					title: 'CANCEL',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
	}

	protected async dohikitsugi(message: MessageObj) {
		await MessageList.updateMessage(message.id, {
			is_read: false,
			assignee_id: UserModule.id,
		});
		await this.setResponse(message);
	}

	getAdminName(user: any) {
		try {
			console.log(user);
			const { admin_user_id } = user.assignee[0];
			console.log(AdminUserModule.AdminList);
			const adminUser = AdminUserModule.AdminList.filter((o: any) => o.id == admin_user_id)[0];
			if (adminUser) {
				return adminUser.name + ' ';
			}
		} catch (e) {
			console.info(e);
		}
		return '';
	}

	public async setResponse(message: MessageObj) {
		await this.ajax
			.http({
				url: `product/${CLIENT_ID}/message/${message.id}/read`,
				method: 'PATCH',
			})
			.then(
				(res: any) => {
					if (res.code === 409) {
						MessageBox.confirm('409エラー', '既に他のユーザーが対応中です', {
							confirmButtonText: '既に他のユーザーが対応中です',
							cancelButtonText: '取消',
							type: 'warning',
						});
					} else {
						MessageList.updateMessage(message.id, {
							assignee_id: UserModule.id,
						});
					}
				},
				res => {},
			);
		// await MessageList.updateMessage(message.id, { description: "123" });
		await MessageListModule.getMessageList();
		message.is_read = true;
		this.setCurrentMessage(message);
	}

	protected async fetchData() {
		this.listLoading = true;
		await MessageListModule.getMessageList();
		this.listLoading = false;
		await AdminUserModule.getAdminUserList();
		// MessageList.getMessageList().then((response: any) => {
		// 	console.log(response.data);
		// 	this.list = response.data;
		// 	// MessageListModule.setMessageList(response.data);
		// 	this.listLoading = false;
		// });
		// // getList(this.listQuery).then((response: any) => {
		// 	this.list = response.data.items;
		// 	this.listLoading = false;
		// });
	}
}
