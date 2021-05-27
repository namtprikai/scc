import {TicketData,TableKey} from "@/views/ticketTable/index.i";

export interface TagSet {
	label?: string;
	text: string;
	id: string;
}

interface HistoryAction {
	type: string;
	value: string;
}

export interface TagTicketData extends TicketData {
	assignee_id?: string;
	assignee?: string;
	start_time?: string;
	end_time?: string;
	origin: 'console' | 'window';
	tag_active_set?: Array<TagSet>;
	tag_used_set?: Array<TagSet>;
	history_query?: Array<string>
	history_action_faq_channel?: Array<HistoryAction>;
	status?: 'open' | 'quit' | 'searchNoScript' | 'answering' | 'answered';
	status_feedback?: 'open' | 'done';
	query?: string;
	feedback?: 'resolved' | 'unresolved';
	user_id?: string;
	partitionKey: string;
	rangeKey: number;
	user_agent: string;
}
interface TagTableKey extends TableKey {
	key: string;
	nativeKey?: string;
	label: string;
	// 二次データを生成する。データを戻り値で置き換えるので複数のキーを操作する場合注意
	valueMapper?: (key: any, ticket: TagTicketData) => string | Array<string>;
	// 表示上のフォーマットを返す。
	valueGetter?: (key: any, ticket: TagTicketData) => string;
	// ヴァリデーションメソッド、falseになるような値が一つでもあるチケットは正しくないチケットとしてなかったものとみなす。
	valid?: (key: any, ticket: TagTicketData) => boolean;
}
export type TableKeyList = Array<TagTableKey>;
// export interface TagTableKeyList extends TableKeyList{}

