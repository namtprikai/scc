import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';
import { MessageList } from '@/api/messageList';
import { eventHub } from '@/init/eventHub';
import { AdminUserModule } from '@/store/modules/adminUser';

// @ts-ignore
@Component({})
export default class MessageSearch extends Vue {
	public loading = true;
	public q = '';
	public st = moment()
		.subtract(1, 'month')
		.toDate();

	public en = moment().toDate();
	public adminId = 'all';
	public messages: any[] = [];
	public timeFormatText = 'YYYY/MM/DD HH:mm:ss';

	get options() {
		return [{ value: 'all', text: 'すべて' }, { value: 'user', text: 'ユーザー' }, ...this.AdminList.map(({ id, name }: any) => ({ text: name, value: id }))];
	}

	get AdminList() {
		return AdminUserModule.AdminList;
	}

	protected findAdmin(adminId: string) {
		return this.AdminList.find(({ id }: any) => id === adminId);
	}

	private setCurrentMessage(message: any, e: Event) {
		eventHub.$emit('setCurrentMessage', message, true);
	}

	public async download() {
		const dataList: any = this.messages.map(message => {
			const admin = this.findAdmin(message.assignee_id);
			let adminName = '-';
			if (admin) {
				adminName = admin.name;
			}
			return [message.user.displayname || '-', this.getLocalString(message.created_date, this.timeFormatText) || '-', adminName || '-', message.text || '-'];
		});
		console.log(dataList);
		const data: any = dataList
			.map((ar: any) => {
				const r = ar.map((a: any) => `"${String(a).replace(/"/g, "'")}"`);
				return r.join(',');
			})
			.join('\n');
		console.log(data);
		const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
		const blob = new Blob([bom, data], { type: 'text/csv' });
		const url = (window.URL || window.webkitURL).createObjectURL(blob);
		const link = document.createElement('a');
		link.download = 'messageList.csv';
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	protected getLocalString(gmtText: string, formatText = ''): string {
		if (!gmtText) {
			return '-';
		}
		return moment(gmtText)
			.local()
			.format(formatText);
	}

	public async search() {
		let owner: 'all' | 'admin' | 'user' = 'admin';
		if (this.adminId !== 'user' && this.adminId !== 'all') {
			owner = 'admin';
		} else {
			owner = this.adminId;
		}
		this.loading = true;
		const messages = await MessageList.searchMessageList({
			q: this.q,
			limit: 300,
			owner,
			st: moment(this.st).format('YYYY-MM-DD'),
			en: moment(this.en)
				.add(1, 'day')
				.format('YYYY-MM-DD'),
			page: 1,
		});
		if (this.adminId === 'all' || this.adminId === 'user') {
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
			const assignee_name = admin ? admin.name : 'なし';
			return { ...m, assignee_name };
		});
		this.loading = false;
	}

	public async created() {
		await AdminUserModule.getAdminUserList();
		this.loading = false;
	}
}
