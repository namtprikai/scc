<template src="@/components/TicketSearch/template.html"></template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Pie from "@/components/Charts/Pie.vue";
import Bar from "@/components/Charts/Bar.vue";
import Pareto from "@/components/Charts/Pareto.vue";
import _ from "lodash";
import moment, { duration } from "moment";
import TicketSearchParent, {
	GrafhConf,
	EnquateMapperRadio,
	EnquateMapperCheck,
	EnquateMapper,
} from "@/components/TicketSearch";
import TicketCompParent, {
	Ticket,
	TicketData,
	TicketGroup,
	Condition,
	KeyData,
} from "@/views/ticketTable";
import { Saiko } from "@/utils/saiko/index";
import { AdminUserModule } from "@/store/modules/adminUser";
// import {
// 	TicketModule,
// 	FaqTicketMapper,
// 	FaqTicket
// } from "@/store/modules/ticket";
const emotionMapper: { [key: string]: string } = {
	happy: "喜び",
	sad: "悲しみ",
	disgust: "不快",
	angry: "怒り",
	fear: "恐怖",
	surprise: "驚き",
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
			return new Date(parseInt(time));
		},
	},
})
export default class TicketSearch extends TicketSearchParent {
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
					.filter((t) => t.start_time && !Array.isArray(t.start_time.value))
					.groupBy((t: KeyData) => {
						if (!Array.isArray(t.start_time.value)) {
							const startTime = parseInt(t.start_time.value, 10);
							return moment(startTime).format("H");
						}
					});
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
						Array.isArray(ticket.start_time.value)
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
					.filter((t) => t.start_time && !Array.isArray(t.start_time.value))
					.groupBy((t: KeyData) => {
						if (!Array.isArray(t.start_time.value)) {
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
					.filter((t) => t.start_time && !Array.isArray(t.start_time.value))
					.groupBy((t: KeyData) => {
						if (!Array.isArray(t.start_time.value)) {
							return moment(parseInt(t.start_time.value, 10)).format("dddd");
						}
						return TicketGroup.noneSt;
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
						if (!Array.isArray(t.start_time.value)) {
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
					.map((k) => {
						return {
							name: k,
							value: groupByStatus.get(k).size().value(),
						};
					})
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
			size: "100%",
			titleText: "アンケート１回答結果",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				return EnquateMapper(tickets, "enquete_resolved_1", "1");
			},
		},
		{
			size: "100%",
			titleText: "アンケート２回答結果",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				return EnquateMapper(tickets, "enquete_resolved_2", "2");
			},
		},
		{
			size: "100%",
			titleText: "アンケート3自由記入欄感情分析",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				return EnquateMapper(tickets, "enquete_resolved_3", "3");
			},
		},
		{
			size: "100%",
			titleText: "目安箱1回答結果",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				return EnquateMapper(tickets, "enquete_unresolved_1", "1");
			},
		},
		{
			size: "100%",
			titleText: "目安箱２自由記入欄感情分析",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				return EnquateMapper(tickets, "enquete_unresolved_2", "2");
			},
		},
		// "enquete_unresolved_sciseed_service"
		{
			size: "100%",
			titleText: "目安箱3回答結果",
			valueUnit: "件",
			xLabelAll: false,
			chartType: "pie",
			data: [],
			mapper: (tickets: Array<KeyData>) => {
				return EnquateMapper(tickets, "enquete_unresolved_3", "3");
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
		// {
		// 	size: '100%',
		// 	titleText: '対応者担当別グラフ',
		// 	valueUnit: '件',
		// 	xLabelAll: true,
		// 	chartType: 'bar',
		// 	data: [],
		// 	mapper: (tickets: Array<KeyData>) => {
		// 		if (!tickets || tickets.length <= 0) {
		// 			return [];
		// 		}
		// 		const assigneeMap = AdminUserModule.AdminList.reduce((dic: any, admin: any) => ({ ...dic, [admin.id]: admin.name }), {});
		// 		const group = _.chain(tickets)
		// 			.filter(t => t.assignee_id && t.assignee_id.value !== TicketGroup.noneSt)
		// 			.groupBy((t: KeyData) => t.assignee_id.value);
		// 		return Object.keys(assigneeMap).map(k => ({
		// 			name: assigneeMap[k],
		// 			value: group
		// 				.get(k)
		// 				.size()
		// 				.value(),
		// 		}));
		// 	},
		// },
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

	protected updateParentCategoryCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const group = _.chain(tickets)
			.filter((t) => t.log_faq_parent_category)
			.groupBy((t) => t.log_faq_parent_category);
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
			.filter((t) => t.log_faq_child_category)
			.groupBy((t) => t.log_faq_child_category);
		return group
			.keys()
			.map((k) => ({
				name: k,
				value: group.get(k).size().value(),
			}))
			.value();
	}

	protected updateStatusCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const groupByStatus = _.chain(tickets)
			.filter((t) => !!t.kaiketsu)
			.groupBy((t) => t.kaiketsu);
		return groupByStatus
			.keys()
			.map((k) => ({
				name: k,
				value: groupByStatus.get(k).size().value(),
			}))
			.value();
	}

	protected updateFaqCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const group = _.chain(tickets)
			.filter((t) => t.log_faq_title)
			.groupBy((t) => t.log_faq_title);

		return group
			.keys()
			.map((k) => ({
				name: k,
				value: group.get(k).size().value(),
			}))
			.sortBy((g) => -g.value)
			.value();
	}
}
</script>
<style
	type="sass"
	lang="scss"
	scoped
	src="@/components/TicketSearch/style.scss"
></style>
