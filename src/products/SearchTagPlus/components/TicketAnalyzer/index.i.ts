type Dictionary<T> = (key: string) => T;

export interface BarData {
	name: string;
	value: number;
}

export interface GraphData {
	graph: 'bar' | 'pareto' | 'pie';
	data: BarData[];
	title: string;
	unitText: string;
	width?: string;
	height?: string;
	xLabelAll?: 'true' | 'false';
}

export interface IVueGoodTableColumn {
	label: string;
	field: string;
	width?: string;
	valid?: Function;
	formatFn?: Function;
	sortFn?: Function;
	thClass?: string;
	tdClass?: string | Function;
	[key: string]: any;
}
