import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import Pie from "@/components/Charts/Pie.vue";
import Bar from "@/components/Charts/Bar.vue";
import Pareto from "@/components/Charts/Pareto.vue";
import _ from "lodash";
import { moment } from '@/init/moment';
import { duration } from "moment";
import { Saiko } from "@/utils/saiko/index";
// import { TicketModule, ticketMapper, Ticket, FaqTicket } from "@/store/modules/ticket";
import TicketCompParent, {
	Ticket,
	TicketData,
	TicketGroup,
	Condition,
	KeyData,
} from "@/views/ticketTable";
import { AdminUserModule } from "@/store/modules/adminUser";
export interface GrafhConf {
	size: string;
	titleText: string;
	valueUnit: string;
	xLabelAll: boolean;
	chartType: "bar" | "pie" | "pareto";
	data: Array<{ name: string; value: number }>;
	mapper: (tickets: Array<any>) => Array<{ name: string; value: number }>;
}

export const EnquateMapperRadio = (tickets: Array<KeyData>, key: string) => {
	if (!tickets || tickets.length <= 0) {
		return [];
	}
	const checkList:Array<string|Array<string>> = [];
	for (const ticket of tickets) {
		if (
			ticket[key] &&
			ticket[key].value &&
			ticket[key].value !== TicketGroup.noneSt
		) {
			checkList.push(ticket[key].value);
		}
	}
	const group = _.chain(checkList)
		.filter((t) => !!t)
		.groupBy((t: string | string[]) => t);
	return group
		.keys()
		.map((k) => ({
			name: k,
			value: group.get(k).size().value(),
		}))
		.value();
};
export const EnquateMapperCheck = (tickets: Array<KeyData>, key: string) => {
	if (!tickets || tickets.length <= 0) {
		return [];
	}
	const checkList = [];
	for (const ticket of tickets) {
		if (ticket[key] && Array.isArray(ticket[key].value)) {
			for (const v of ticket[key].value) {
				if (v && v !== TicketGroup.noneSt) {
					checkList.push(v);
				}
			}
		}
	}
	const group = _.chain(checkList)
		.filter((t) => !!t)
		.groupBy((t: string) => t);
	return group
		.keys()
		.map((k) => ({
			name: k,
			value: group.get(k).size().value(),
		}))
		.value();
};
export const EnquateTicketText = (tickets: Array<KeyData>, key: string) => {
	const emotionMapper: { [key: string]: string } = {
		happy: "喜び",
		sad: "悲しみ",
		disgust: "不快",
		angry: "怒り",
		fear: "恐怖",
		surprise: "驚き",
	};
	if (!tickets || tickets.length <= 0) {
		return [];
	}
	const group = _.chain(tickets)
		.filter((t) => t[key] && t[key].value !== TicketGroup.noneSt)
		.groupBy((t: KeyData) => {
			const TValue = t[key].value;
			if (typeof TValue === "string") {
				const kanjo = Saiko.mindSync(TValue);
				if (kanjo !== null) {
					const kanjoString = Saiko.KanjoStringto(kanjo, 40);
					if (kanjoString && kanjoString in emotionMapper) {
						return emotionMapper[kanjoString];
					} else {
						return "該当なし";
					}
				}
			}

			return "該当なし";
		});
	return group
		.keys()
		.map((k) => ({
			name: k,
			value: group.get(k).size().value(),
		}))
		.value();
};
export const EnquateMapper = (
	tickets: Array<KeyData>,
	key: string,
	enquateKey: string
) => {
	if (!tickets || tickets.length <= 0) {
		return [];
	}
	const checkList = [];
	for (const ticket of tickets) {
		if (key in ticket) {
			const data: any = ticket[key].data;
			if (data && enquateKey in data) {
				const eData = data[enquateKey];
				if (eData.type === "checkbox") {
					return EnquateMapperCheck(tickets, key);
				} else if (eData.type === "radio") {
					return EnquateMapperRadio(tickets, key);
				} else if (eData.type === "textarea") {
					return EnquateTicketText(tickets, key);
				}
			}
		}
	}

	return [];
};

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
	@Prop()
	protected tickets: Array<KeyData> | undefined;

	@Watch("tickets")
	public dataMaintain(tickets: Array<KeyData>) {
		if (Array.isArray(tickets)) {
			for (const grafhConf of this.grafhList) {
				grafhConf.data = grafhConf.mapper(tickets);
			}
		}
	}

	public async mounted() {
		if (this.AdminList == null) {
			await AdminUserModule.getAdminUserList();
		}
		if (Array.isArray(this.tickets)) {
			this.dataMaintain(this.tickets);
		}
	}

	protected grafhList: Array<GrafhConf> = [
		{
			size: "50%",
			titleText: "時間帯別チケット件数",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "bar",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}
				const groupByHour = _.chain(tickets)
					.filter((t: any) => t.start_time)
					.groupBy((t: KeyData) => {
						if (typeof t.start_time.value === "string") {
							const startTime = parseInt(t.start_time.value, 10);
							console.log(moment(startTime).format("H"));
							return moment(startTime).format("H");
						}
					});
				console.log(groupByHour.get(14).value());
				return _.times(24).map((h) => ({
					name: `${h}時`,
					value: groupByHour.get(h).size().value(),
				}));
			},
		},
		{
			size: "50%",
			titleText: "日別チケット件数",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "bar",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}
				let maxDate = 0;
				let minDate = new Date().getTime();
				for (const ticket of tickets) {
					if (
						!ticket.start_time ||
						!String(ticket.start_time.value).match(/^\d+$/) ||
						typeof ticket.start_time.value !== "string"
					) {
						continue;
					}
					maxDate = Math.max(maxDate, parseInt(ticket.start_time.value, 10));
					minDate = Math.min(minDate, parseInt(ticket.start_time.value, 10));
				}
				if (maxDate === 0) {
					return [];
				}
				const startDate = moment(minDate);
				const endDate = moment(maxDate);
				const format = startDate.isSame(endDate, "year") ? "MM/DD" : "YYYY/MM/DD";
				const groupByDate = _.chain(tickets)
					.filter((t: any) => t.start_time)
					.groupBy((t: KeyData) => {
						if (typeof t.start_time.value === "string") {
							return moment(parseInt(t.start_time.value, 10)).format(format);
						}
					});
				const ticketCountsFromStartToEnd = _.times(
					endDate.diff(startDate, "days") + 1
				).map((diff) => {
					const date: string = startDate.clone().add(diff, "days").format(format);
					return {
						name: date,
						value: groupByDate.get(date).size().value(),
					};
				});
				console.log(ticketCountsFromStartToEnd);
				return ticketCountsFromStartToEnd;
			},
		},
		{
			size: "50%",
			titleText: "曜日別チケット件数",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "bar",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}

				const groupByWeekday = _.chain(tickets)
					.filter((t: any) => t.start_time)
					.groupBy((t: KeyData) => {
						if (typeof t.start_time.value === "string") {
							return moment(parseInt(t.start_time.value, 10)).format("dddd");
						}
					});
				return moment.weekdays().map((h) => ({
					name: h,
					value: groupByWeekday.get(h).size().value(),
				}));
			},
		},
		{
			size: "50%",
			titleText: "月別チケット件数",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "bar",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}

				const groupByMonth = _.chain(tickets)
					.filter((t: any) => t.start_time)
					.groupBy((t: KeyData) => {
						if (typeof t.start_time.value === "string") {
							return moment(parseInt(t.start_time.value, 10)).format("MMMM");
						}
					});
				return moment.months().map((h) => ({
					name: h,
					value: groupByMonth.get(h).size().value(),
				}));
			},
		},
		{
			size: "100%",
			titleText: "ステータス",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}

				const groupByStatus = _.chain(tickets)
					.filter((t) => {
						try {
							return t.status && t.status.value !== TicketGroup.noneSt;
						} catch (e) {
							console.log(e);
						}
						return false;
					})
					.groupBy((t: KeyData) => t.status.value);
				return groupByStatus
					.keys()
					.map((k) => ({
						name: k,
						value: groupByStatus.get(k).size().value(),
					}))
					.value();
			},
		},
		{
			size: "100%",
			titleText: "回答済み",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}

				const groupByFeedback = _.chain(tickets)
					.filter((t) => !!t.feedback)
					.groupBy((t) => t.feedback.value);
				return groupByFeedback
					.keys()
					.map((k) => ({
						name: k,
						value: groupByFeedback.get(k).size().value(),
					}))
					.value();
			},
		},
		{
			size: "50%",
			titleText: "アンケート１回答結果",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}
				const group = _.chain(tickets)
					.filter((t) => !!t.enquete1)
					.groupBy((t: KeyData) => t.enquete1.value);
				return group
					.keys()
					.map((k) => ({
						name: k,
						value: group.get(k).size().value(),
					}))
					.value();
			},
		},
		{
			size: "50%",
			titleText: "アンケート２回答結果",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}
				const group = _.chain(tickets)
					.filter((t) => !!t.enquete2)
					.groupBy((t: KeyData) => t.enquete2.value);
				return group
					.keys()
					.map((k) => ({
						name: k,
						value: group.get(k).size().value(),
					}))
					.value();
			},
		},
		{
			size: "100%",
			titleText: "FAQ別グラフ",
			valueUnit: "件",
			xLabelAll: true,
			chartType: "pareto",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}
				const group = _.chain(tickets)
					.filter(
						(t) => t.log_faq_title && t.log_faq_title.value !== TicketGroup.noneSt
					)
					.groupBy((t: KeyData) => t.log_faq_title.value);
				return group
					.keys()
					.map((k) => ({
						name: k,
						value: group.get(k).size().value(),
					}))
					.sortBy((g) => -g.value)
					.value();
			},
		},
		{
			size: "100%",
			titleText: "対応者担当別グラフ",
			valueUnit: "件",
			xLabelAll: true,
			chartType: "bar",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}

				const assigneeMap = this.AdminList.reduce(
					(dic: any, admin: any) => ({ ...dic, [admin.id]: admin.name }),
					{}
				);
				const group = _.chain(tickets)
					.filter((t) => t.assignee_id && t.assignee_id.value !== TicketGroup.noneSt)
					.groupBy((t: KeyData) => t.assignee_id.value);
				return Object.keys(assigneeMap).map((k) => ({
					name: assigneeMap[k],
					value: group.get(k).size().value(),
				}));
			},
		},
		{
			size: "50%",
			titleText: "手段別対応件数",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "bar",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}
				const group = _.chain(tickets)
					.filter((t) => t.mode && t.mode.value !== TicketGroup.noneSt)
					.groupBy((t: KeyData) => t.mode.value);
				return group
					.keys()
					.map((k) => ({
						name: k,
						value: group.get(k).size().value(),
					}))
					.value();
			},
		},
		{
			size: "100%",
			titleText: "親カテゴリ別件数",
			valueUnit: "件",
			xLabelAll: true,
			chartType: "bar",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}

				const group = _.chain(tickets)
					.filter(
						(t) =>
							t.log_faq_parent_category &&
							t.log_faq_parent_category.value !== TicketGroup.noneSt
					)
					.groupBy((t: KeyData) => t.log_faq_parent_category.value);
				return group
					.keys()
					.map((k) => ({
						name: k,
						value: group.get(k).size().value(),
					}))
					.value();
			},
		},
		{
			size: "100%",
			titleText: "子カテゴリ別件数",
			valueUnit: "件",
			xLabelAll: true,
			chartType: "bar",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				if (!tickets || tickets.length <= 0) {
					return [];
				}
				const group = _.chain(tickets)
					.filter(
						(t) =>
							t.log_faq_child_category &&
							t.log_faq_child_category.value !== TicketGroup.noneSt
					)
					.groupBy((t: KeyData) => t.log_faq_child_category.value);
				return group
					.keys()
					.map((k) => ({
						name: k,
						value: group.get(k).size().value(),
					}))
					.value();
			},
		},
	];

	get AdminList() {
		return AdminUserModule.AdminList;
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

		const assigneeMap = this.AdminList.reduce(
			(dic: any, admin: any) => ({ ...dic, [admin.id]: admin.name }),
			{}
		);
		const group = _.chain(tickets)
			.filter((t) => t.assignee_id)
			.groupBy((t: KeyData) => t.assignee_id);
		return Object.keys(assigneeMap).map((k) => ({
			name: assigneeMap[k],
			value: group.get(k).size().value(),
		}));
	}

	protected listLoading = false;
}
