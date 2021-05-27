export interface ITalkScriptState {
	TalkScript: any;
	// TalkScriptTree:any;
}
export interface RootTalkScript {
	id: string;
	type: 'root';
	position: number;
}
export interface TalkScript {
	id: string;
	parent: string;
	position: number;
	text: string;
	type: 'node' | 'leaf';
	status: 'published' | 'editing';
	value?: string;
	title: string;
	questions?: Array<string>;
	items: { [key: string]: Array<string> | string };
	scenario?: string;
}
export function ScriptDataTreeCrawler(datas_: Array<any>, callback: Function, deep = 0): void {
	for (let i = 0; i < datas_.length; i++) {
		if (datas_[i].children == null) {
			datas_[i].children = [];
		}
		callback(datas_[i], deep, datas_);
		if ((datas_[i].children || []).length > 0) {
			ScriptDataTreeCrawler(datas_[i].children || [], callback, deep++);
		}
	}
}
export interface Data {
	id: number | string;
	text?: string;
	type: string;
	position?: number;
	parent?: number | string;
	value?: string;
	children?: Array<Data>;
	status?: 'published' | 'editing';
	questions?: Array<any>;
	scenario?: string;
	feedback?: Array<string>;
	tags?: Array<any>;
	item?: any;
	items?: { [key: string]: Array<string> | string | any };
}
export interface ScriptDataTree {
	isLeaf: boolean;
	isExpanded: boolean;
	isEdited?: boolean;
	isEditing?: boolean;
	isActive?: boolean;
	title: string;
	data: Data;
	item?: any;
	status?: 'published' | 'editing';
	items?: { [key: string]: Array<string> | string };
	parent?: any;
	children?: Array<ScriptDataTree>;
}
