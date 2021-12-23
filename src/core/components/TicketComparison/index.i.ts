
export interface IVueGoodTableColumn {
	label: string;
	field: string;
	width?: string;
	valid?: Function;
	formatFn?: Function;
	sortFn: Function;
	thClass?: string;
	tdClass?: string | Function;
	[key: string]: any;
}
