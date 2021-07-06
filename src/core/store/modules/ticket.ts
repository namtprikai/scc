import Cookies from "js-cookie";
import {
	VuexModule,
	Module,
	Mutation,
	Action,
	getModule,
} from "vuex-module-decorators";
import store from "@/store";
import { Ajax } from "@/utils/parts";
import { CLIENT_ID, subsystemUrl } from "@consoletype/utils/configration";
import moment from "moment";
import { v4 } from "uuid";
import { start } from "repl";
import { UserModule } from "@/store/modules/user";
import AdminUser from "@/views/adminUser/index.vue";
import { AdminUserModule } from "@/store/modules/adminUser";
const ajax: Ajax = new Ajax();
export interface IScenarioState {
	Ticket: any;
	// TalkScriptTree:any;
}
export interface ScenarioFlow {
	step: string;
	condition?: { value: string };
	next: Array<ScenarioFlow>;
}

export interface RawTicket {
	loginuser?: string;
	product_id: string;
	partitionKey: string;
	rangeKey: number;
	mode?: string;
	start_date?: number;
	end_date?: number;
	status?: string;
	log_faq?: string[];
	log_faq_title?: string[];
	log_faq_parent_category?: string[];
	log_faq_child_category?: string[];
	query?: string;
	step_id?: string;
	results?: string[]; // リコメンド結果
	assignee?: string;
	assignee_id?: string;
	log_scenario?: string[]; // 分岐項目
	enquete?: {
		id: string;
		label: string;
		value: string;
	}[];
	feedback?: string;
}

export interface Ticket {
	product_id: string;
	partitionKey: string;
	rangeKey: number;
	mode?: string;
	start_date?: number;
	end_date?: number;
	start_date_string?: string;
	end_date_string?: string;
	duration?: string;
	duration_time?: number;
	year?: string;
	month?: string;
	day?: string;
	day_of_week?: string;
	status?: string;
	parent_category?: string;
	child_category?: string;
	faq_link?: string;
	faq_title?: string;
	query?: string;
	step_id?: string;
	results: string;
	assignee_id?: string;
	assignee?: string;
	loginuser?: string;
	scenario: string;
	enquete1?: string;
	enquete2?: string;
	enquete3?: string;
	feedback?: string;
}

export const ticketLabels = {
	mode: "応答モード",
	client_user_id: "ユーザーID",
	displayname: "ユーザー名",
	assignee: "対応者",

	start_date_string: "開始日時",
	end_date_string: "完了日時",
	duration: "対応時間",
	year: "年",
	month: "月",
	day: "日",
	day_of_week: "曜日",
	status: "ステータス",
	parent_category: "親カテゴリ",
	child_category: "子カテゴリ",
	faq_link: "FAQ 番号",
	faq_title: "FAQ タイトル",
	query: "ユーザー入力文字",
	results: "レコメンド結果",
	scenario: "シナリオログ",
	enquete1: "アンケート1",
	enquete2: "アンケート2",
	enquete3: "アンケート3",
	feedback: "フィードバック",
};
export interface FaqTicket {
	loginuser?: string;
	product_id: string;
	currentFaqId: string;
	currentScript: string;
	endTime: string;
	kaiketsu: string;
	partitionKey: string;
	origin: string | undefined;
	query: string;
	rangeKey: number;
	assignee_id?: string;
	scriptStack: string[];
	startTime: string;
	endTimeString: string | undefined;
	startTimeString: string | undefined;
	duration?: string;
	duration_time?: number;
	feedback: string;
	year?: string;
	month?: string;
	day?: string;
	day_of_week?: string;
}

export const FaqTicketLabels: any = {
	// mode: "応答モード",
	assignee: "対応者",
	assignee_id: "対応者",
	loginuser: "対応者",
	startTimeString: "開始日時",
	endTimeString: "完了日時",
	duration: "対応時間",
	year: "年",
	month: "月",
	day: "日",
	origin: "流入経路",
	day_of_week: "曜日",
	kaiketsu: "ステータス",
	query: "ユーザー入力文字",
	currentFaqId: "FAQID",
	currentScript: "レコメンド結果",
	log_scenario: "シナリオログ",
	log_faq: "FAQ番号",
	log_faq_title: "FAQタイトル",
	log_faq_parent_category: "親カテゴリ",
	log_faq_child_category: "子カテゴリ",
	feedback: "メモ",
};
export interface FaqRawTicket {
	assignee_id?: string;
	assignee?: string;
	loginuser?: string;
	product_id: string;
	currentFaqId: string;
	currentScript: string;
	endTime: string;
	kaiketsu: string;
	partitionKey: string;
	origin: string | undefined;
	query: string;
	rangeKey: number;
	scriptStack: string[];
	log_faq_title: string[];
	log_faq: string[];
	log_scenario: string[];
	log_faq_parent_category: string[];
	log_faq_child_category: string[];
	startTime: string;
}
const ignoreLabels = [
	"currentScript",
	"currentFaqId",
	"results",
	"partitionKey",
	"rangeKey",
	"product_id",
	"start_date",
	"end_date",
	"duration_time",
	"ticket",
	"asignee_id",
	"client_user_id",
	"clientUserId",
];

export const ticketLabelsGenerator = (
	rs: Array<Ticket | FaqTicket>
): object => {
	const ls: Set<string> = new Set();
	rs.forEach((r) => {
		Object.keys(r).forEach((k) => ls.add(k));
	});

	let labels: object = {};
	Array.from(ls).forEach((l: string) => {
		if (!Object.keys(ticketLabels).includes(l) && !ignoreLabels.includes(l)) {
			labels = { ...labels, [l]: l };
		}
	});
	return { ...ticketLabels, ...labels };
};
export const FaqTicketMapper = (rs: FaqRawTicket[]): FaqTicket[] => {
	const getLast = (array?: any[]): any | undefined =>
		array && array.length > 0 && array[array.length - 1];
	const statusMapper = (s?: string): string | undefined => {
		const label: any = {
			ok: "解決",
			ng: "未解決",
			now: "検索中",
			out: "離脱",
		};
		return s && label[s];
	};
	const originMapper = (s?: string): string | undefined => {
		const label: any = { window: "ウインドウ", console: "管理画面" };
		return s && label[s];
	};

	const converter = ({
		assignee,
		assignee_id,
		loginuser,
		product_id,
		currentFaqId,
		currentScript,
		endTime,
		kaiketsu,
		partitionKey,
		query,
		origin,
		rangeKey,
		scriptStack,
		startTime,
		feedback,
		...others
	}: FaqRawTicket | any): FaqTicket => {
		let startTimeString;
		let endTimeString;
		let duration;
		let duration_time;
		let year;
		let month;
		let day;
		let day_of_week;
		if (startTime && endTime) {
			const me = moment.unix(parseInt(endTime, 10) / 1000);
			const ms = moment.unix(parseInt(startTime, 10) / 1000);
			startTimeString = ms.format("YYYY年MM月DD日 HH:mm:ss") || "-";
			endTimeString = me.format("YYYY年MM月DD日 HH:mm:ss") || "-";
			duration_time = me.diff(ms, "seconds") || 0;
			const diffHours = me.diff(ms, "hours") || 0;
			const diffMinute = me.diff(ms, "minutes") - 60 * diffHours || 0;
			const diffSecond =
				me.diff(ms, "seconds") - 3600 * diffHours - 60 * diffMinute || 0;
			duration = `${diffHours ? diffHours + "時間" : ""}${
				diffMinute ? diffMinute + "分" : ""
			}${diffSecond ? diffSecond + "秒" : "0秒"}`;
			year = ms.format("YYYY") || "-";
			month = ms.format("MM") || "-";
			day = ms.format("DD") || "-";
			day_of_week = ms.format("ddd") || "-";
		}
		const _others: any = others;
		for (const otherKey in _others) {
			const other: any = _others[otherKey];
			if (Array.isArray(other)) {
				others[otherKey] = other.join(",");
			}
		}

		console.log(others);
		return {
			...others,
			startTime,
			assignee,
			assignee_id,
			loginuser,
			currentFaqId,
			kaiketsu: statusMapper(kaiketsu) || "-",
			product_id,
			scriptStack,
			currentScript,
			endTime,
			query,
			partitionKey,
			rangeKey,
			origin: originMapper(origin),
			duration,
			duration_time,
			year,
			month,
			day,
			feedback,
			day_of_week,
			startTimeString,
			endTimeString,
		};
	};

	return rs.map(converter);
};
export const ticketMapper = (rs: RawTicket[]): Ticket[] => {
	const getLast = (array?: any[]): any | undefined =>
		array && array.length > 0 && array[array.length - 1];
	const getIfExist = <T>(
		dict: { [k: string]: T },
		key?: string,
		defaultValue?: T
	): T | undefined => {
		if (key && dict[key]) {
			return dict[key];
		}
		return defaultValue;
	};

	const statusMapper = (s?: string): string | undefined => {
		const label: any = {
			open: "離脱",
			resolved: "解決",
			unresolved: "未解決",
			answered: "回答済み",
			searchFailed: "検索失敗",
			scriptNotFound: "未収録",
			quit: "未完了",
			escalated: "直通",
			"re-search": "再検索",
			unsupported: "未対応",
		};
		return s && label[s];
	};
	const modeMapper = (s?: string): string | undefined => {
		const label: any = { bot: "BOT", operator: "有人" };
		return s && label[s];
	};
	const feedbackMapper = (isNeeded: boolean, s?: string): string | undefined => {
		if (isNeeded) {
			return getIfExist({ resolved: "解決", unresolved: "未解決" }, s, "なし");
		}
	};

	const converter = ({
		assignee,
		assignee_id,
		loginuser,
		start_date,
		end_date,
		status,
		mode,
		results,
		log_faq,
		log_faq_title,
		log_faq_child_category,
		log_faq_parent_category,
		log_scenario,
		enquete,
		feedback,
		...others
	}: RawTicket): Ticket => {
		const enqueteObj: {
			enquete1?: string;
			enquete2?: string;
			enquete3?: string;
		} = new Array(3)
			.fill("")
			.map((_, i) => i)
			.reduce((obj, i) => {
				const v = (enquete && enquete[i]) || { value: "" };
				return { ...obj, ["enquete" + (i + 1)]: v.value };
			}, {});
		let startDateString;
		let endDateString;
		let duration;
		let duration_time;
		let year;
		let month;
		let day;
		let day_of_week;
		if (start_date) {
			const ms = moment.unix(start_date / 1000);
			startDateString = ms.format("YYYY年MM月DD日 HH:mm:ss");
			year = ms.format("YYYY");
			month = ms.format("MM");
			day = ms.format("DD");
			day_of_week = ms.format("ddd");

			if (end_date) {
				const me = moment.unix(end_date / 1000);
				duration_time = me.diff(ms, "seconds");
				endDateString = me.format("YYYY年MM月DD日 HH:mm:ss");
				const diffHours = me.diff(ms, "hours");
				const diffMinute = me.diff(ms, "minutes") - 60 * diffHours;
				const diffSecond =
					me.diff(ms, "seconds") - 3600 * diffHours - 60 * diffMinute;
				duration = `${diffHours ? diffHours + "時間" : ""}${
					diffMinute ? diffMinute + "分" : ""
				}${diffSecond ? diffSecond + "秒" : ""}`;
			}
		}

		return {
			...enqueteObj,
			...others,
			start_date,
			assignee,
			end_date,
			status: statusMapper(status),
			mode: modeMapper(mode),
			start_date_string: startDateString,
			end_date_string: endDateString,
			duration,
			duration_time,
			year,
			month,
			day,
			day_of_week,
			results: results ? results.join(",") : "",
			parent_category: getLast(log_faq_parent_category),
			child_category: getLast(log_faq_child_category),
			faq_link: getLast(log_faq),
			faq_title: getLast(log_faq_title),
			scenario: getLast(log_scenario),
			feedback: feedbackMapper(status === "answered", feedback),
		};
	};
	return rs.map(converter);
};

@Module({ dynamic: true, store, name: "ticket" })
class TicketStore extends VuexModule implements IScenarioState {
	private ticket: any = [];
	get Ticket() {
		return this.ticket;
	}

	@Mutation
	private SET_TICKET(ticket: Array<any>) {
		this.ticket = ticket;
	}

	@Action({
		commit: "SET_TICKET",
	})
	public async getTicket(ob: {
		st: string;
		en: string;
		startdate: Date;
		enddate: Date;
	}) {
		const { st, en, startdate, enddate } = ob;
		const data: any = await ajax.http({
			baseURL: subsystemUrl,
			url: `product/${CLIENT_ID}/data_get`,
			method: "get",
			params: { type: "ticket", en, st },
		});
		return (data.message || []).filter((data: any) => {
			if (parseInt(data.start_date || data.startTime) < startdate.getTime()) {
				return false;
			}
			if (parseInt(data.start_date || data.startTime) > enddate.getTime()) {
				return false;
			}
			return true;
		});
	}
}

export const TicketModule = getModule(TicketStore);
