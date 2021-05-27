import { VuexModule, Module, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';
import store from '@/store';
import { Ajax } from '@/utils/parts';
import { PRODUCT_ID, subsystemUrl } from '@product/utils/configration';

import { v4 } from 'uuid';
const ajax: Ajax = new Ajax();
export interface ITalkScriptState {
	TalkScript: any;
	// TalkScriptTree:any;
}
export interface TalkScript {
	id: string;
	parent: string;
	position: number;
	text: string;
	title?: string;
	type: 'node' | 'leaf';
	status: 'published' | 'editing';
	items: { [key: string]: Array<string> };
	scenario?: string;
}
export interface Data {
	id: number | string;
	text?: string;
	type: string;
	position?: number;
	parent?: number | string;
	value?: string;
	children?: Array<Data>;
	status: 'published' | 'editing';
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
	title: string;
	data: Data;
	item?: any;
	status?: 'published' | 'editing';
	items?: { [key: string]: Array<string> };
	parent?: any;
	children?: Array<ScriptDataTree>;
}
@Module({ dynamic: true, store, name: 'talkScript' })
class TalkScriptStore extends VuexModule implements ITalkScriptState {
	private talkScript: any = [];
	@Mutation
	public INIT() {
		console.log('INIT');
	}

	// @Mutation
	// public SET_CURRENTMESSAGE(message: any) {
	// 	this.currentMessage = message;
	// }
	@Mutation
	private SET_TALKSCRIPT(talkScript: Array<any>) {
		console.log('GET_TALKSCRIPT');
		console.log(talkScript);
		this.talkScript = talkScript;
	}

	// @Action({
	// 	commit: "SET_TALKSCRIPT"
	// })
	// public resetEditiong(){
	// 	const talkScriptList = this.TalkScript;
	// 	for(const talkScript of talkScriptList){
	// 		talk
	// 	}
	// }
	@Action({
		commit: 'SET_TALKSCRIPT',
	})
	public async getTalkScript() {
		const data: any = await ajax.http({
			url: `product/${PRODUCT_ID}/talk_script`,
			method: 'get',
		});
		return data.body;
	}

	get TalkScript() {
		return this.talkScript;
	}
	get TalkScriptEdit() {
		console.log(this.talkScript);
		return parseListToEditList(this.talkScript);
	}
	get TalkScriptTree() {
		console.log(this.talkScript);
		return parseListToTree(this.talkScript);
	}

	get TalkScriptTree2() {
		return parseListToTree2(this.talkScript);
	}

	@Action
	async saveTalkscript() {

    const talkScript = cleanFixScenario(this.talkScript);

		for (let i = 0; i < talkScript.length; i++) {
			talkScript[i].id = String(talkScript[i].id);
			talkScript[i].parent = String(talkScript[i].parent);
		}

		const data: any = await ajax.http({
			url: `product/${PRODUCT_ID}/talk_script`,
			method: 'post',
			data: {
				body: talkScript,
			},
		});

    console.log(data);

		this.getTalkScript();
		return this.talkScript;
	}

	@Action({
		commit: 'SET_TALKSCRIPT',
	})
	public setTalkScript(talkScript: any) {
		return talkScript;
	}

	@Action({
		commit: 'SET_TALKSCRIPT',
	})
	public setTalkScriptTree(_talkScript: any) {
		const talkScript = JSON.parse(JSON.stringify(_talkScript));
		const res = ParseTreeToList(talkScript);
		for (let i = 0; i < res.length; i++) {
			res[i].id = String(res[i].id);
			res[i].parent = String(res[i].parent);
		}
		return res;
	}
	@Action({
		commit: 'SET_TALKSCRIPT',
	})
	public setTalkScriptEdit(_talkScript: any) {
		const talkScript = JSON.parse(JSON.stringify(_talkScript));
		const res = ParseEditListToList(talkScript);
		for (let i = 0; i < res.length; i++) {
			res[i].id = String(res[i].id);
			res[i].parent = String(res[i].parent);
		}
		return res;
	}
	public getItemSync(param: { resourceName: string; talkScriptId: string }) {}
	makeNewId(datas_: Array<ScriptDataTree>): number {
		let maxId = 0;
		const self = this;
		maxIdSerch(datas_, (data: any) => {
			maxId = data.id;
		});
		function maxIdSerch(datas_: Array<ScriptDataTree>, callback: Function) {
			for (let i = 0; i < datas_.length; i++) {
				if (datas_[i].children == null) {
					datas_[i].children = [];
				}
				if (maxId < datas_[i].data.id) {
					callback(datas_[i]);
				}

				if ((datas_[i].children || []).length > 0) {
					maxIdSerch(datas_[i].children || [], callback);
				}
			}
		}
		return ++maxId;
	}

	// varidate(sourcechildrencope: any, destchildrenScope: any): boolean {
	// 	if (destchildrenScope.$modelValue.type === 'leaf') {
	// 		return false;
	// 	}
	// 	if (sourcechildrencope.$modelValue.type === 'leaf') {
	// 		if (destchildrenScope.depth() >= 3 || destchildrenScope.depth() === 0) {
	// 			return false;
	// 		}
	// 	} else {
	// 		// console.log(sourcechildrencope.depth());
	// 		// console.log(sourcechildrencope.$$childTail.depth());
	// 		// console.log(sourcechildrencope.outOfDepth());
	// 		// console.log(destchildrenScope.depth());
	// 		if (destchildrenScope.depth() >= 2) {
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// }

	_dataSearch(id: number | string, datas_: Array<Data>, callback: Function, firstMatchOnly = false): boolean {
		for (let i = 0; i < datas_.length; i++) {
			if (datas_[i].children == null) {
				datas_[i].children = [];
			}
			const dataId = datas_[i].id;
			if (id === dataId) {
				callback(datas_[i]);
				if (firstMatchOnly) {
					return true;
				}
			} else if ((datas_[i].children || []).length > 0) {
				const res = this._dataSearch(id, datas_[i].children || [], callback);
				if (firstMatchOnly && res) {
					return true;
				}
			}
		}
		return false;
	}

	public createNewScript(
		params: {
			parentId: string;
			text: string;
			value: string;
			questions: any[];
			tags: any[];
		},
		callback: (newScript: any) => void,
	): Promise<any> {
		return new Promise((resolve, reject) => {
			const res = ScriptDataTreeSearch(
				params.parentId,
				this.talkScript,
				(matches: any) => {
					let maxPosition = -Infinity;
					for (var i in matches.children) {
						maxPosition = Math.max(maxPosition, matches.children[i].position);
					}
					const q: any[] = [];
					const t: any[] = [];
					for (var i in params.questions) {
						q.push(params.questions[i].text);
					}
					for (var i in params.tags) {
						t.push(params.tags[i].text);
					}
					const newScript: Data | any = {
						isNewScript: true,
						id: this.makeNewId(this.talkScript),
						children: <any[]>[],
						parent: params.parentId,
						position: maxPosition < 0 ? 0 : maxPosition + 1,
						questions: q,
						tags: t,
						text: params.text,
						status: 'editing',
						type: 'leaf',
						value: params.value,
						items: {},
					};
					matches.children.push(newScript);

					callback(newScript);
					resolve(newScript);
				},
				true,
			);
			reject();
		});
	}

	public parseTreeToList(datas: Array<Data>) {
		const scriptList: any = [];
		function _parse(datas: Array<Data>, callback: Function) {
			for (let i = 0; i < datas.length; i++) {
				datas[i].position = i;
				callback(datas[i]);
				if ((datas[i].children || []).length > 0) {
					_parse(datas[i].children || [], callback);
				}
			}
		}
		function parentId(id: number) {
			return (
				scriptList.find((el: any) => (el.childlen || []).indexOf(id) !== -1) || {
					id: '#',
				}
			).id;
		}
		return new Promise((success: Function, error: Function) => {
			_parse(datas, (_data: ScriptDataTree) => {
				const { data, children } = _data;
				if ('item' in data) {
					data.items = Object.assign({}, data.item, data.items);
				}
				if (data.type === 'node') {
					scriptList.push({
						id: data.id,
						text: data.text,
						scenario: data.scenario,
						items: data.items,
						type: data.type,
						status: data.status == 'published' ? 'published' : 'editing',
						position: data.position,
						childlen: (children || []).map((el: any) => el.id),
					});
				} else {
					scriptList.push({
						id: data.id,
						text: data.text,
						type: data.type,
						scenario: data.scenario,
						position: data.position,
						items: data.items,
						status: data.status == 'published' ? 'published' : 'editing',
						value: data.value,
					});
				}
			});
			setTimeout(() => {
				for (let i = 0; i < scriptList.length; i++) {
					scriptList[i].parent = parentId(scriptList[i].id);
				}
				for (let i = 0; i < scriptList.length; i++) {
					delete scriptList[i].childlen;
				}
				setTimeout(() => {
					success(scriptList);
				}, 200);
			}, 200);
		});
		// let countFlg=true;
		// let i=0;
		// function pushScriptList(datas:Array<{id:number,title:string,type:string,children?:Array<any>}>,index:number,depthIndex:number){
		// 	if(datas[index].type==="node"){
		// 		scriptList.push({
		// 			id:datas[index],
		// 			title:datas[index],
		// 			type:"node"
		// 		});
		// 	}else{
		// 		scriptList.push({
		// 			id:datas[index],
		// 			title:datas[index],
		// 			type:"leaf"
		// 		});
		// 	}
		// 	if(datas.length-1<=index){

		// 	}
		// }
	}
}

export const TalkScriptModule = getModule(TalkScriptStore);
export function ScriptDataTreeClean(datas_: Array<ScriptDataTree> | any, deep = 0): boolean {
	for (let i = 0; i < datas_.length; i++) {
		if (datas_[i].children == null) {
			datas_[i].children = [];
		}
		if (deep <= 1) {
			datas_[i].type = 'node';
			datas_[i].isLeaf = false;
			datas_[i].data.type = 'node';
		} else {
			datas_[i].type = 'leaf';
			datas_[i].isLeaf = true;
			datas_[i].data.type = 'leaf';
		}
		if (datas_[i].children && (datas_[i].children || []).length > 0) {
			ScriptDataTreeClean(datas_[i].children, deep + 1);
		}
	}
	return false;
}
export function ScriptDataTreeCrawler(datas_: Array<ScriptDataTree>, callback: Function, deep = 0): void {
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
export function ScriptDataTreeSearch(id: number | string, datas_: Array<ScriptDataTree>, callback: Function, firstMatchOnly = false, deep = 0): boolean {
	for (let i = 0; i < datas_.length; i++) {
		if (datas_[i].children == null) {
			datas_[i].children = [];
		}
		const dataId = datas_[i].data && datas_[i].data.id;
		if (id === dataId) {
			callback(datas_[i], deep, datas_);
			if (firstMatchOnly) {
				return true;
			}
		} else if ((datas_[i].children || []).length > 0) {
			const res = ScriptDataTreeSearch(id, datas_[i].children || [], callback, firstMatchOnly, deep++);
			if (firstMatchOnly && res) {
				return true;
			}
		}
	}
	return false;
}
export function ScriptDataTreeSearch2(id: number | string, datas_: Array<any>, callback: Function, firstMatchOnly = false): boolean {
	for (let i = 0; i < datas_.length; i++) {
		if (datas_[i].children == null) {
			datas_[i].children = [];
		}
		const dataId = datas_[i].id;
		if (id === dataId) {
			callback(datas_[i]);
			if (firstMatchOnly) {
				return true;
			}
		} else if ((datas_[i].children || []).length > 0) {
			const res = ScriptDataTreeSearch2(id, datas_[i].children || [], callback);
			if (firstMatchOnly && res) {
				return true;
			}
		}
	}
	return false;
}
export function getScenarioIDListByScriptTreeData(talkScriptTree: ScriptDataTree | any): Array<string> {
	let idList: Array<string> = [];
	if (talkScriptTree.data.type == 'leaf') {
		idList.push(String(talkScriptTree.data.items?.scenario_id || talkScriptTree.data.scenario));
	} else if (talkScriptTree.children && talkScriptTree.children?.length > 0) {
		for (let i = 0; i < talkScriptTree.children.length; i++) {
			idList = idList.concat(getScenarioIDListByScriptTreeData(talkScriptTree.children[i]));
		}
	}
	return idList;
}
export function ParseTreeToList(datas: Array<ScriptDataTree>) {
	const scriptList: any = [];
	function _parse(datas: Array<ScriptDataTree>, callback: Function) {
		for (let i = 0; i < datas.length; i++) {
			if (datas[i].data) {
				datas[i].data.position = i;
				callback(datas[i]);
			}

			if ((datas[i].children || []).length > 0) {
				_parse(datas[i].children || [], callback);
			}
		}
	}
	function parentId(id: number) {
		return (
			scriptList.find((el: any) => (el.childlen || []).indexOf(id) !== -1) || {
				id: '#',
			}
		).id;
	}
	_parse(datas, (_data: ScriptDataTree) => {
		const { data, children } = _data;
		if ('item' in data) {
			data.items = Object.assign({}, data.items, data.item);
		}
		data.items = Object.assign(
			{
				log_scenario: [''],
				log_faq: [''],
				log_faq_parent_category: [''],
				log_faq_child_category: [''],
				log_faq_title: [''],
			},
			data.items,
			data.item || {},
		);
		if (data.type === 'node') {
			scriptList.push({
				id: data.id,
				text: data.text,
				type: data.type,
				status: data.status,
				scenario: data.scenario,
				position: data.position,
				items: data.items || {},
				childlen: (children || []).map((el: any) => el.data.id),
			});
		} else {
			const questions = data.questions || [];
			for (let i = 0; i < questions.length; i++) {
				questions[i] = questions[i].join(',');
			}
			scriptList.push({
				id: data.id,
				text: data.text,
				type: data.type,
				scenario: data.scenario,
				position: data.position,
				value: data.value,
				status: data.status,
				items: data.items || {},
				questions: data.questions || [],
				tags: data.tags || [],
			});
		}
	});

	for (let i = 0; i < scriptList.length; i++) {
		scriptList[i].parent = parentId(scriptList[i].id);
	}
	for (let i = 0; i < scriptList.length; i++) {
		delete scriptList[i].childlen;
		delete scriptList[i].children;
	}
	return scriptList;
}
function parseListToEditList(_datas: Array<Data>): Array<ScriptDataTree> {
	const datas: Array<ScriptDataTree> = [];

	for (let i = 0; i < _datas.length; i++) {
		const item = Object.assign({ isExpanded: false, isLeaf: _datas[i].type === 'leaf' }, { title: v4(), data: _datas[i] });
		if (item.data.questions) {
			item.data.questions = item.data.questions.map((question: any) => {
				if (Array.isArray(question)) {
					return question;
				}
				return question.split(',');
			});
		}
		item.data.items = Object.assign(
			{
				log_scenario: [''],
				log_faq: [''],
				log_faq_parent_category: [''],
				log_faq_child_category: [''],
				log_faq_title: [''],
			},
			item.data.item || {},
			item.data.items,
		);
		if (item.data.parent === '#') {
			console.log(item.data.items);
		}
		datas.push(item);
	}
	let count = 0;
	// for (let i = 0; i < datas.length; i++) {
	// 	// delete datas[i].parent;
	// }

	return datas;
}
export function ParseEditListToList(datas: Array<ScriptDataTree>) {
	const scriptList: any = [];
	function _parse(datas: Array<ScriptDataTree>, callback: Function) {
		for (let i = 0; i < datas.length; i++) {
			if (datas[i].data) {
				callback(datas[i]);
			}
			if ((datas[i].children || []).length > 0) {
				_parse(datas[i].children || [], callback);
			}
		}
	}
	function parentId(id: number) {
		return (
			scriptList.find((el: any) => (el.childlen || []).indexOf(id) !== -1) || {
				id: '#',
			}
		).id;
	}
	_parse(datas, (_data: ScriptDataTree) => {
		const { data, children } = _data;
		if ('item' in data) {
			data.items = Object.assign({}, data.items, data.item);
		}
		data.items = Object.assign(
			{
				log_scenario: [''],
				log_faq: [''],
				log_faq_parent_category: [''],
				log_faq_child_category: [''],
				log_faq_title: [''],
			},
			data.items,
			data.item || {},
		);
		if (data.type === 'node') {
			scriptList.push({
				id: data.id,
				text: data.text,
				type: data.type,
				status: data.status,
				scenario: data.scenario,
				position: data.position,
				items: data.items || {},
				childlen: (children || []).map((el: any) => el.data.id),
			});
		} else {
			const questions = data.questions || [];
			for (let i = 0; i < questions.length; i++) {
				questions[i] = questions[i].join(',');
			}
			scriptList.push({
				id: data.id,
				text: data.text,
				type: data.type,
				scenario: data.scenario,
				position: data.position,
				value: data.value,
				status: data.status,
				items: data.items || {},
				questions: data.questions || [],
				tags: data.tags || [],
			});
		}
	});

	for (let i = 0; i < scriptList.length; i++) {
		scriptList[i].parent = parentId(scriptList[i].id);
	}
	for (let i = 0; i < scriptList.length; i++) {
		delete scriptList[i].childlen;
		delete scriptList[i].children;
	}
	return scriptList;
}
function parseListToTree(_datas: Array<Data>): Array<ScriptDataTree> {
	const datas: Array<ScriptDataTree> = [];

	for (let i = 0; i < _datas.length; i++) {
		const item = Object.assign({ isExpanded: false, isLeaf: _datas[i].type === 'leaf' }, { title: v4(), data: _datas[i] });
		if (item.data.questions) {
			item.data.questions = item.data.questions.map((question: any) => {
				if (Array.isArray(question)) {
					return question;
				}
				return question.split(',');
			});
		}
		item.data.items = Object.assign(
			{
				log_scenario: [''],
				log_faq: [''],
				log_faq_parent_category: [''],
				log_faq_child_category: [''],
				log_faq_title: [''],
			},
			item.data.item || {},
			item.data.items,
		);
		if (item.data.parent === '#') {
			console.log(item.data.items);
		}
		datas.push(item);
	}
	let count = 0;
	while (count < datas.length) {
		if (datas[count].data.parent !== undefined) {
			const parent = datas[count].data.parent || 0;
			ScriptDataTreeSearch(parent, datas, (res: ScriptDataTree) => {
				(res.children || []).push(Object.assign({}, datas[count]));
				datas.splice(count--, 1);
			});
		}

		count++;
	}
	for (let i = 0; i < datas.length; i++) {
		if (datas[i].children) {
			datas[i].children = (datas[i].children || []).sort((a: any, b: any) => {
				if (a.data.position < b.data.position) {
					return -1;
				} else if (a.data.position == b.data.position) {
					return 0;
				} else {
					return 1;
				}
			});
		}

		delete datas[i].parent;
	}

	return datas.sort((a: any, b: any) => {
    if (a.data.position < b.data.position) {
      return -1;
    } else if (a.data.position == b.data.position) {
      return 0;
    } else {
      return 1;
    }
  });
}
function parseListToTree2(_datas: Array<Data>): Array<ScriptDataTree> {
	const datas: Array<any> = [];

	for (let i = 0; i < _datas.length; i++) {
		const item = Object.assign({}, _datas[i]);
		if (item.questions) {
			item.questions = item.questions.map((question: any) => question.split(','));
		}
		item.items = Object.assign(
			{
				log_scenario: [''],
				log_faq: [''],
				log_faq_parent_category: [''],
				log_faq_child_category: [''],
				log_faq_title: [''],
			},
			item.items,
			item.item || {},
		);
		datas.push(item);
	}
	let count = 0;
	while (count < datas.length) {
		if (datas[count].parent !== undefined) {
			const parent = datas[count].parent || 0;
			console.log(parent);
			ScriptDataTreeSearch2(parent, datas, (res: ScriptDataTree) => {
				(res.children || []).push(Object.assign({}, datas[count]));
				datas.splice(count--, 1);
			});
		}

		count++;
	}
	for (let i = 0; i < datas.length; i++) {
		if (datas[i].children) {
			datas[i].children = (datas[i].children || []).sort((a: any, b: any) => {
				if (a.data?.position < b.data.position) {
					return -1;
				} else if (a.data?.position === b.data?.position) {
					return 0;
				} else {
					return 1;
				}
			});
		}

		delete datas[i].parent;
	}

	return datas.sort((a: any, b: any) => {
    if (a.data?.position < b.data?.position) {
      return -1;
    } else if (a.data?.position == b.data?.position) {
      return 0;
    } else {
      return 1;
    }
  });;
}
function isArray(obj: any) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}
function cleanFixScenario(scriptList: Array<Data>) {
	for (const script of scriptList) {
		try {
			if ('items' in script) {
				for (const itemName in script.items) {
					const items = script.items;
					if (isArray(items[itemName])) {
						items[itemName] = items[itemName].filter((o: any) => o != null && o != '');
						if (items[itemName].length == 0) {
							delete items[itemName];
							continue;
						}
					} else if (items[itemName] == null || items[itemName] === '') {
						delete items[itemName];
						continue;
					}
				}
			}
		} catch (e) {
			console.log(e);
		}
	}
	return scriptList;
}
