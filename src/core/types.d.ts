export interface Condition {
	label: string;
	name?:string;
	mapper?: (data: any) => string;
	//入れ子セットの内側はand 外はor 入れ子でない場合or
	checkList: Array<{ value: Set<{key:string,value?:string,is?:boolean}>|Set<Set<{key:string,value?:string,is?:boolean}>>; label: string; flg: boolean,role?:Set<number> }>;
}
export interface TableKey {
	key: string;
	nativeKey?: string;
	label: string;
	target?:Set<"csv"|"view">;
	displayType?: "text"|"select"|"textarea"|"custom"|"enquete";
	discription?: string;
	sortFn?: Function;
	// 二次データを生成する。データを戻り値で置き換えるので複数のキーを操作する場合注意
	valueMapper?: (key: any, ticket: any) => string | Array<string>;
	// 表示上のフォーマットを返す。
	valueGetter?: (key: any, ticket: any) => string|Array<{key:string,value:string}>;

	// csv独自の表示形式があればこのメソッドを使う
	csvValueGetter?: (key: any, ticket: any) => string;
	// ヴァリデーションメソッド、falseになるような値が一つでもあるチケットは正しくないチケットとしてなかったものとみなす。
	valid?: (key: any, ticket: any) => boolean;
}
export type TableKeyList = Array<TableKey>;
export interface ITableTicketColumn {
	label: string;
	field: string;
	width?: string;
	valid?: Function;
	formatFn?: Function;
	sortFn?: Function;
	[key: string]: any;
};
