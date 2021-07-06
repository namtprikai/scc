import { Component, Vue, Watch } from "vue-property-decorator";
import Pie from "@/components/Charts/Pie.vue";
import Bar from "@/components/Charts/Bar.vue";
import Pareto from "@/components/Charts/Pareto.vue";
import _ from "lodash";
import moment, { duration } from "moment";

import { TicketModule, ticketMapper, Ticket, FaqTicket } from "@/store/modules/ticket";
import { AdminUserModule } from "@/store/modules/adminUser";

// @ts-ignore
@Component({
	components: { PieChart: Pie, BarChart: Bar, ParetoChart: Pareto },
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: "success",
				draft: "gray",
				deleted: "danger",
			};
			return statusMap[status];
		},
		dateJa(time: string) {
			return new Date(parseInt(time, 10));
		},
	},
})
export default class TicketSearchParent extends Vue {
	protected tickets: Array<Ticket | FaqTicket> = [];
	protected hourlyTicketCounts: any[] = [];
	protected dailyTicketCounts: any[] = [];
	protected weeklyTicketCounts: any[] = [];
	protected monthlyTicketCounts: any[] = [];
	protected statusCounts: any[] = [];
	protected enquete1Counts: any[] = [];
	protected enquete2Counts: any[] = [];
	protected faqCounts: any[] = [];
	protected modeCounts: any[] = [];
	protected durationCounts: any[] = [];
	protected parentCategoryCounts: any[] = [];
	protected childCategoryCounts: any[] = [];
	protected operatorCounts: any[] = [];

	get AdminList() {
		return AdminUserModule.AdminList;
	}

	protected updateStatusCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const groupByStatus = _.chain(tickets)
			.filter((t) => !!t.status)
			.groupBy((t) => t.status);
		return groupByStatus
			.keys()
			.map((k) => ({
				name: k,
				value: groupByStatus.get(k).size().value(),
			}))
			.value();
	}

	protected updateHourlyTicketCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}
		console.log(_.chain(tickets));
		const groupByHour = _.chain(tickets)
			.filter((t) => t.start_date || parseInt(t.startTime))
			.groupBy((t) => {
				console.log(moment(t.start_date || parseInt(t.startTime)).format("H"));
				return moment(t.start_date || parseInt(t.startTime)).format("H");
			});
		return _.times(24).map((h) => ({
			name: `${h}時`,
			value: groupByHour.get(h).size().value(),
		}));
	}

	protected updateDailyTicketCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const startDate = moment(this.startdate);
		const endDate = moment(this.enddate);
		const format = startDate.isSame(endDate, "year") ? "MM/DD" : "YYYY/MM/DD";

		const groupByDate = _.chain(tickets)
			.filter((t) => t.start_date || parseInt(t.startTime))
			.groupBy((t) => moment(t.start_date || parseInt(t.startTime)).format(format));
		const ticketCountsFromStartToEnd = _.times(endDate.diff(startDate, "days") + 1).map((diff) => {
			const date: string = startDate.clone().add(diff, "days").format(format);
			return {
				name: date,
				value: groupByDate.get(date).size().value(),
			};
		});
		console.log(ticketCountsFromStartToEnd);
		return ticketCountsFromStartToEnd;
	}

	protected updateWeeklyTicketCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const groupByWeekday = _.chain(tickets)
			.filter((t) => t.start_date || parseInt(t.startTime))
			.groupBy((t) => moment(t.start_date || parseInt(t.startTime)).format("dddd"));
		return moment.weekdays().map((h) => ({
			name: h,
			value: groupByWeekday.get(h).size().value(),
		}));
	}

	protected updateMonthlyTicketCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const groupByMonth = _.chain(tickets)
			.filter((t) => t.start_date || parseInt(t.startTime))
			.groupBy((t) => moment(t.start_date || parseInt(t.startTime)).format("MMMM"));
		return moment.months().map((h) => ({
			name: h,
			value: groupByMonth.get(h).size().value(),
		}));
	}

	protected updateEnquete1Counts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const group = _.chain(tickets)
			.filter((t) => !!t.enquete1)
			.groupBy((t) => t.enquete1);
		return group
			.keys()
			.map((k) => ({
				name: k,
				value: group.get(k).size().value(),
			}))
			.value();
	}

	protected updateEnquete2Counts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const group = _.chain(tickets)
			.filter((t) => !!t.enquete2)
			.groupBy((t) => t.enquete2);
		return group
			.keys()
			.map((k) => ({
				name: k,
				value: group.get(k).size().value(),
			}))
			.value();
	}

	protected updateFaqCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const group = _.chain(tickets)
			.filter((t) => t.faq_title)
			.groupBy((t) => t.faq_title);

		return group
			.keys()
			.map((k) => ({
				name: k,
				value: group.get(k).size().value(),
			}))
			.sortBy((g) => -g.value)
			.value();
	}

	protected updateModeCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const group = _.chain(tickets)
			.filter((t) => t.mode)
			.groupBy((t) => t.mode);
		return group
			.keys()
			.map((k) => ({
				name: k,
				value: group.get(k).size().value(),
			}))
			.value();
	}

	protected updateParentCategoryCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const group = _.chain(tickets)
			.filter((t) => t.parent_category)
			.groupBy((t) => t.parent_category);
		return group
			.keys()
			.map((k) => ({
				name: k,
				value: group.get(k).size().value(),
			}))
			.value();
	}

	protected updateChildCategoryCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const group = _.chain(tickets)
			.filter((t) => t.child_category)
			.groupBy((t) => t.child_category);
		return group
			.keys()
			.map((k) => ({
				name: k,
				value: group.get(k).size().value(),
			}))
			.value();
	}

	protected updateDurationCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const labels: any = ["~1分", "1分~5分", "5分~10分", "10分~"];
		const group = _.chain(tickets)
			.filter((t) => t.duration_time)
			.groupBy(({ duration_time }) => {
				if (duration_time <= 60) {
					return 0;
				} else if (duration_time <= 300) {
					return 1;
				} else if (duration_time <= 600) {
					return 2;
				} else {
					return 3;
				}
			});
		return group
			.keys()
			.sort()
			.map((k) => ({
				name: labels[k],
				value: group.get(k).size().value(),
			}))
			.value();
	}

	protected updateOperatorCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const assigneeMap = this.AdminList.reduce((dic: any, admin: any) => ({ ...dic, [admin.id]: admin.name }), {});
		const group = _.chain(tickets)
			.filter((t) => t.assignee_id)
			.groupBy((t) => t.assignee_id);
		return Object.keys(assigneeMap).map((k) => ({
			name: assigneeMap[k],
			value: group.get(k).size().value(),
		}));
	}

	protected listLoading = false;
	protected startdate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1);

	protected enddate = new Date();

	protected async search() {
		const { startdate, enddate } = this;
		const st = moment(startdate).subtract(1, "days").format("YYYY-MM-DD");
		const en = moment(enddate).add(1, "days").format("YYYY-MM-DD");
		this.tickets = [];
		this.listLoading = true;
		let _stDate = startdate;
		while (moment(_stDate).unix() < moment(enddate).add(2, "days").unix()) {
			const _st = moment(_stDate).subtract(1, "days").format("YYYY-MM-DD");
			const _en = moment(_stDate).format("YYYY-MM-DD");
			await TicketModule.getTicket({
				st: _st,
				en: _en,
				startdate: moment(startdate).startOf("day").toDate(),
				enddate: moment(enddate).endOf("day").toDate(),
			});
			this.tickets = [...this.tickets, ...ticketMapper(TicketModule.Ticket)];
			_stDate = moment(_stDate).add(1, "days").toDate();
		}

		this.listLoading = false;

		this.hourlyTicketCounts = this.updateHourlyTicketCounts(this.tickets);
		this.dailyTicketCounts = this.updateDailyTicketCounts(this.tickets);
		this.statusCounts = this.updateStatusCounts(this.tickets);
		this.weeklyTicketCounts = this.updateWeeklyTicketCounts(this.tickets);
		this.monthlyTicketCounts = this.updateMonthlyTicketCounts(this.tickets);
		this.enquete1Counts = this.updateEnquete1Counts(this.tickets);
		this.enquete2Counts = this.updateEnquete2Counts(this.tickets);
		this.faqCounts = this.updateFaqCounts(this.tickets);
		this.modeCounts = this.updateModeCounts(this.tickets);
		this.durationCounts = this.updateDurationCounts(this.tickets);
		this.parentCategoryCounts = this.updateParentCategoryCounts(this.tickets);
		this.childCategoryCounts = this.updateChildCategoryCounts(this.tickets);
		this.operatorCounts = this.updateOperatorCounts(this.tickets);
	}

	protected async mounted() {
		await AdminUserModule.getAdminUserList();
	}
}
