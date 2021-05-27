import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import ScenarioParent from '@/views/talkscript/index';
// import SlVueTree from "sl-vue-tree";
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import ScenarioTemp from '@/components/ScenarioTemp/index.vue';
import { Scenario, ScenarioModule } from '@/store/modules/scenario';
import { TicketModule, ticketMapper, ticketLabelsGenerator, Ticket, RawTicket, FaqTicket } from '@/store/modules/ticket';
import { AdminUserModule } from '@/store/modules/adminUser';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
export default class TicketSearchCompParent extends Vue {
	protected listLoading = false;
	protected startdate = this.$moment()
		.subtract(1, 'month')
		.toDate();

	protected enddate = this.$moment().toDate();
	protected searchStatuses = [
		{ value: 'open', text: '離脱' },
		{ value: 'escalated', text: '直通' },
		{ value: 'resolved', text: '解決' },
		{ value: 'unresolved', text: '未解決' },
		{ value: 'scriptNotFound', text: '未収録' },
		{ value: 'searchFailed', text: '検索失敗' },
		{ value: 're-search', text: '再検索' },
		{ value: 'unsupported', text: '未対応' },
		{ value: 'quit', text: '未完了' },
	];

	protected searchModes = [
		{ value: 'bot', text: 'BOT' },
		{ value: 'operator', text: '有人' },
	];

	get searchUsers() {
		return this.AdminList.map(({ id, name }: any) => ({
			text: name,
			value: id,
		}));
	}

	protected selectedStatuses: any[] = [];
	protected selectedModes: any[] = [];
	protected selectedUsers: any[] = [];
	get AdminList() {
		return AdminUserModule.AdminList;
	}

	created() {
		AdminUserModule.getAdminUserList();
	}

	protected async selectAllUsers() {
		this.selectedUsers = this.searchUsers.map(({ value }: any) => value);
	}

	protected selectAllStatus() {
		this.selectedStatuses = this.searchStatuses.map(({ value }: any) => value);
	}

	protected selectAllModes() {
		this.selectedModes = this.searchModes.map(({ value }: any) => value);
	}

	protected unselectAllUsers() {
		this.selectedUsers = [];
	}

	protected unselectAllStatus() {
		this.selectedStatuses = [];
	}

	protected unselectAllModes() {
		this.selectedModes = [];
	}

	protected ticketFilter(tickets: RawTicket[]): RawTicket[] {
		let filteredTickets = tickets;
		if (this.selectedStatuses.length > 0) {
			filteredTickets = filteredTickets.filter(t => this.selectedStatuses.includes(t.status));
		}
		if (this.selectedModes.length > 0) {
			filteredTickets = filteredTickets.filter(t => this.selectedModes.includes(t.mode));
		}
		if (this.selectedUsers.length > 0) {
			filteredTickets = filteredTickets.filter(t => this.selectedUsers.includes(t.assignee_id));
		}
		return filteredTickets;
	}

	protected assigneeMapper(tickets: any): any {
		const assigneeMap = this.AdminList.reduce((dic: any, admin: any) => ({ ...dic, [admin.id]: admin.name }), {});
		return tickets.map(({ assignee_id, loginuser, ...others }: any) => ({
			assignee: assignee_id && assigneeMap[assignee_id] && loginuser && assigneeMap[loginuser],
			...others,
		}));
	}

	protected async search() {
		this.Ticket = [];
		const st = this.$moment(this.startdate)
			.subtract(1, 'days')
			.format('YYYY-MM-DD');
		const en = this.$moment(this.enddate)
			.add(1, 'days')
			.format('YYYY-MM-DD');
		const { startdate, enddate } = this;
		this.listLoading = true;
		// await TicketModule.getTicket({
		// 	st, en,
		// 	startdate: this.$moment(startdate)
		// 		.startOf("day")
		// 		.toDate(),
		// 	enddate: this.$moment(enddate)
		// 		.endOf("day")
		// 		.toDate()
		// });
		// this.Ticket = this.assigneeMapper(ticketMapper(this.ticketFilter(TicketModule.Ticket)));
		console.log(this.Ticket);
		let _stDate = startdate;
		while (
			this.$moment(_stDate).unix() <
			this.$moment(enddate)
				.add(2, 'days')
				.unix()
		) {
			const _st = this.$moment(_stDate)
				.subtract(1, 'days')
				.format('YYYY-MM-DD');
			const _en = this.$moment(_stDate).format('YYYY-MM-DD');
			console.log(`${_st}  ${_en}`);
			await TicketModule.getTicket({
				st: _st,
				en: _en,
				startdate: this.$moment(startdate)
					.startOf('day')
					.toDate(),
				enddate: this.$moment(enddate)
					.endOf('day')
					.toDate(),
			});
			this.Ticket = [...this.Ticket, ...this.assigneeMapper(ticketMapper(this.ticketFilter(TicketModule.Ticket)))];
			_stDate = this.$moment(_stDate)
				.add(1, 'days')
				.toDate();
		}

		this.listLoading = false;
	}

	protected async mounted() {
		await AdminUserModule.getAdminUserList();
	}

	protected Ticket: Array<Ticket | FaqTicket> = [];

	get ticketLabels() {
		return ticketLabelsGenerator(this.Ticket);
	}

	public async csv() {
		await this.search();
		let csvSt = '';
		if (this.Ticket) {
			csvSt +=
				Object.values(this.ticketLabels)
					.map(v => `"${v}"`)
					.join(',') + '\n';

			for (const ticket of this.Ticket) {
				csvSt +=
					Object.keys(this.ticketLabels)
						.map(k => {
							const t = ticket as any;
							return `"${t[k] || ''}"`;
						})
						.join(',') + '\n';
			}
		}
		const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
		const element = document.createElement('a');
		let blob = new Blob([bom, csvSt], { type: 'text/csv' });
		// if(code=="SJIS"){

		blob = new Blob([bom, csvSt], {
			type: 'text/csv;charset=shift_jis',
		});

		// }
		const url = URL.createObjectURL(blob);
		element.href = url;
		element.setAttribute('download', 'data.csv');
		// element.setAttribute('target', '_blank');
		document.body.appendChild(element); // Append the element to work in firefox
		element.click();
	}
}
