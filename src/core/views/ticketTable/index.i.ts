export interface KeyData {
	[key: string]: { name: string; value: string | Array<string>; data: any };
}
export interface ArrayKeyData {
	[key: string]: { name: string; value: Array<string> };
}
export interface StringKeyData {
	[key: string]: { name: string; value: string };
}
export interface TicketData {
	[key: string]: any; // Array<string|any> | string|number| undefined;
}
export interface EnquateTicket {
	[id: string]:
	| {
		type: 'radio';
		label: string;
		value: { value: string; label: string } | null;
		  }
	| {
		type: 'checkbox';
		label: string;
		value: Array<{ value: string; label: string }>;
		  }
	| {
		type: 'textarea';
		label: string;
		value: string;
		  };
}
export interface Condition {
	label: string;
	key: string;

	mapper?: (data: any) => string;
	checkList: Array<{ value: Array<string>; label: string; flg: boolean }>;
}
export interface TableKey {
	key: string;
	nativeKey?: string;
	label: string;
	// 二次データを生成する。データを戻り値で置き換えるので複数のキーを操作する場合注意
	valueMapper?: (key: any, ticket: any) => string | Array<string>;
	// 表示上のフォーマットを返す。
	valueGetter?: (key: any, ticket: any) => string;
	// ヴァリデーションメソッド、falseになるような値が一つでもあるチケットは正しくないチケットとしてなかったものとみなす。
	valid?: (key: any, ticket: any) => boolean;
}
export type TableKeyList = Array<TableKey>;
