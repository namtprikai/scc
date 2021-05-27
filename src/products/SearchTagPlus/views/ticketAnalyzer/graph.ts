import { BarData } from '../../components/TicketAnalyzer/index.i';
import moment from 'moment';
import _ from 'lodash';

moment.locale('ja', {
	weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
	weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
	months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
});

// 時間帯別チケット件数
function getHourlyTicketCounts(tickets: any[]): BarData[] {
	if (!tickets || tickets.length <= 0) {
		return [];
	}
	const groupByHour = _.chain(tickets)
		.filter(t => t.start_date)
		.groupBy(t => {
			if (!Array.isArray(t.start_date)) {
				const st = parseInt(t.start_date, 10);
				return moment(st).format('H');
			}
		});
	return _.times(24).map(h => ({
		name: `${h}時`,
		value: groupByHour
			.get(h)
			.size()
			.value(),
	}));
}

// 日別チケット件数
function getDailyTicketCounts(tickets: any[], startdate: Date, enddate: Date) {
	if (!tickets || tickets.length <= 0) {
		return [];
	}

	const startDate = moment(startdate);
	const endDate = moment(enddate);
	const format = startDate.isSame(endDate, 'year') ? 'M/D' : 'YYYY/M/D';

	const groupByDate = _.chain(tickets)
		.filter(t => t.start_date || parseInt(t.startTime))
		.groupBy(t => moment(t.start_date || parseInt(t.startTime)).format(format));
	const ticketCountsFromStartToEnd = _.times(endDate.diff(startDate, 'days') + 1).map(diff => {
		const date: string = startDate
			.clone()
			.add(diff, 'days')
			.format(format);
		return {
			name: date,
			value: groupByDate
				.get(date)
				.size()
				.value(),
		};
	});
	return ticketCountsFromStartToEnd;
}

// 曜日別チケット件数
function getWeeklyTicketCounts(tickets: any[]) {
	if (!tickets || tickets.length <= 0) {
		return [];
	}

	const groupByWeekday = _.chain(tickets)
		.filter(t => t.start_date || parseInt(t.startTime))
		.groupBy(t => moment(t.start_date || parseInt(t.startTime)).format('dddd'));
	return moment.weekdays().map(h => ({
		name: h,
		value: groupByWeekday
			.get(h)
			.size()
			.value(),
	}));
}

// 月別チケット件数
function getMonthlyTicketCounts(tickets: any[]) {
	if (!tickets || tickets.length <= 0) {
		return [];
	}

	const groupByMonth = _.chain(tickets)
		.filter(t => t.start_date || parseInt(t.startTime))
		.groupBy(t => moment(t.start_date || parseInt(t.startTime)).format('MMMM'));
	return moment.months().map(h => ({
		name: h,
		value: groupByMonth
			.get(h)
			.size()
			.value(),
	}));
}

// チケットステータス
function getStatusCounts(tickets: any[], labels: { [key: string]: string } = {}) {
	if (!tickets || tickets.length <= 0) {
		return [];
	}

	const groupByStatus = _.chain(tickets)
		.filter(t => !!t.status)
		.groupBy(t => t.status);
	return groupByStatus
		.keys()
		.map(k => ({
			name: labels[k] ?? k,
			value: groupByStatus
				.get(k)
				.size()
				.value(),
		}))
		.value();
}

// 解決ステータス
function getFeedbackCounts(tickets: any[], labels: { [key: string]: string } = {}) {
	const groupByStatus = _.chain(tickets)
		.filter(t => t.status && t.status === 'answered')
		.groupBy(t => t.feedback);
	return groupByStatus
		.keys()
		.map(k => ({
			name: labels[k] ?? k,
			value: groupByStatus
				.get(k)
				.size()
				.value(),
		}))
		.value();
}

function getFaqCounts(tickets: any[]) {
	if (!tickets || tickets.length <= 0) {
		return [];
	}

	const group = _.chain(tickets)
		.filter(t => t.log_faq_title)
		.groupBy(t => t.log_faq_title);

	const result = group
		.keys()
		.map(k => ({
			name: k,
			value: group
				.get(k)
				.size()
				.value(),
		}))
		.sortBy(g => -g.value)
		.value();
	return result;
}

function getParentCategoryCounts(tickets: any[]) {
	if (!tickets || tickets.length <= 0) {
		return [];
	}

	const group = _.chain(tickets)
		.filter(t => t.log_faq_parent_category)
		.groupBy(t => t.log_faq_parent_category);
	return group
		.keys()
		.map(k => ({
			name: k,
			value: group
				.get(k)
				.size()
				.value(),
		}))
		.value();
}

function getChildCategoryCounts(tickets: any[]) {
	if (!tickets || tickets.length <= 0) {
		return [];
	}

	const group = _.chain(tickets)
		.filter(t => t.log_faq_child_category)
		.groupBy(t => t.log_faq_child_category);
	return group
		.keys()
		.map(k => ({
			name: k,
			value: group
				.get(k)
				.size()
				.value(),
		}))
		.value();
}

export default {
	getHourlyTicketCounts,
	getDailyTicketCounts,
	getWeeklyTicketCounts,
	getMonthlyTicketCounts,
	getStatusCounts,
	getFeedbackCounts,
	getFaqCounts,
	getParentCategoryCounts,
	getChildCategoryCounts,
};
