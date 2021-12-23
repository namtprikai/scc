import { v4 } from 'uuid';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';

import { CLIENT_ID, subsystemUrl } from '@consoletype/utils/configration';
import { Ajax, Wait } from '@/utils/parts';
import type { KeyData,  TicketData, EnquateTicket  } from './index.i';
import { AdminUserModule } from '@/store/modules/adminUser';
import csvPtringify from 'csv-stringify';
import { TicketComparison } from "@/components/TicketComparison";
import TicketComparisonComp from "@/components/TicketComparison/index.vue";
import jszip from "jszip";
import {TableKeyList,Condition,ITableTicketColumn} from '@/types';
export { Condition, TicketData, KeyData, EnquateTicket };
function typeOf(obj:any) {
	return toString.call(obj).slice(8, -1).toLowerCase();
}
export class TicketGroup {
	public static readonly noneSt = '';
	private ticketList: Array<Ticket> = [];
	public tableData: Array<any> = [];
	public keyData: Array<KeyData> = [];
	private tableType: "goodTable" | null = null;
	private tdClassFunc: (row: { [key: string]: any }, arg2: string) => string = () => "";
	constructor(private tableKeyList: TableKeyList, type?: "goodTable") {
		if (type != undefined) {
			this.tableType = type;
		}
	}
	get TicketList() {
		return this.ticketList;
	}
	get AllTableKeyList() {
		return this.tableKeyList;
	}
	get TableKeyList() {
		// if(this.tableType==="goodTable"){

		// }
		return this.tableKeyList.filter(t => t.target === undefined ? true : t.target?.has("view"));;
	}
	get CSVTableKeyList() {
		return this.tableKeyList.filter(t => t.target === undefined ? true : t.target?.has("csv"));
	}
	set TdClassFunc(func: (row: { [key: string]: any }, arg2: string) => string) {
		this.tdClassFunc = func;
	}
	get Columns(): Array<ITableTicketColumn> {
		return this.TableKeyList.map((o, i) => {
			return Object.assign({ label: o.label, field: o.key, key: o.key, index: `${i}`, type: o.displayType, tdClass: this.tdClassFunc }, o.sortFn ? { sortFn: o.sortFn, sortable: true } : {});
		});
	}
	public setTicketList(ticketDataList: Array<TicketData>, filter: (ticket: Ticket) => boolean) {
		this.ticketList = [];
		for (const ticketData of ticketDataList) {
			const ticket = new Ticket(ticketData, this.tableKeyList);
			if (filter(ticket)) {
				this.ticketList.push(ticket);
			}
		}
	}
	public getTicket(_rangeKey: number) {
		return this.ticketList.find(t => {
			const { rangeKey } = t.ID;
			if (_rangeKey === rangeKey) {
				return true;
			}
			return false;
		});
	}
	public setKeyData() {
		this.keyData = this.getTicketList()
			.filter(t => {
				const data = t.getNativeData();
				return this.AllTableKeyList.every(tableKeyObj => {
					if (tableKeyObj.valid) {
						return tableKeyObj.valid(data[tableKeyObj.key], data);
					}
					return true;
				});
			})
			.map(t => {
				const data = t.getNativeData();
				const ret: KeyData = {};
				let nativeData: any = null;
				for (let i = 0; i < this.AllTableKeyList.length; i++) {
					const tableKeyObj = this.AllTableKeyList[i];
					let dataText: any = TicketGroup.noneSt;
					if (tableKeyObj.valueMapper) {
						dataText = tableKeyObj.valueMapper(data[tableKeyObj.key], data) || TicketGroup.noneSt;
					} else if (tableKeyObj.key in data) {
						dataText = data[tableKeyObj.key] || TicketGroup.noneSt;
					}
					// if (Array.isArray(dataText)) {
					// 	dataText = dataText.join(',');
					// }
					if (tableKeyObj.nativeKey) {
						nativeData = data[tableKeyObj.nativeKey];
						if (nativeData) {
							ret[tableKeyObj.key] = Object.assign({}, ret[tableKeyObj.key] || {}, {
								name: tableKeyObj.label,
								value: dataText,
								data: nativeData,
							});
						}
					}
					ret[tableKeyObj.key] = Object.assign({}, ret[tableKeyObj.key] || {}, {
						name: tableKeyObj.label,
						value: dataText,
					});

					// if(ret[tableKeyObj.key]["data"]){
					// 	if("1" in ret[tableKeyObj.key]["data"])
					// }
				}
				return ret;
			});
	}
	get CSVTableDate() {
		const ticketList = this.getTicketList()
			.filter(t => {
				const data = t.getNativeData();
				return this.CSVTableKeyList.every(tableKeyObj => {
					if (tableKeyObj.valid) {
						return tableKeyObj.valid(data[tableKeyObj.key], data);
					}
					return true;
				});
			})
			.sort((a, b) => {
				if (a.data.start_time < b.data.start_time) {
					return -1;
				} else if ((a.data.start_time > b.data.start_time)) {
					return 1;
				}
				return 0;
			})
			.map(t => {
				const data = t.getNativeData();

				// const ret: {[key:string]:string} = {
				// 	rangeKey:data.rangeKey,
				// 	partitionKey: data.partitionKey,
				// 	isChange: ""
				// };

				const ret: Array<string> = [];
				const nativeData: any = null;
				const tableKeyList = this.CSVTableKeyList;
				for (let i = 0; i < tableKeyList.length; i++) {
					const tableKeyObj = tableKeyList[i];

					let dataText: any = TicketGroup.noneSt;

					if (tableKeyObj.valueMapper) {
						dataText = tableKeyObj.valueMapper(data[tableKeyObj.key], data) || TicketGroup.noneSt;
					} else if (tableKeyObj.key in data) {
						dataText = data[tableKeyObj.key] || TicketGroup.noneSt;
					}

					if (tableKeyObj.csvValueGetter) {
						dataText = tableKeyObj.csvValueGetter(dataText, data);
					} else if (tableKeyObj.valueGetter) {
						dataText = tableKeyObj.valueGetter(dataText, data);
					}
					// if (Array.isArray(dataText)) {
					// 	dataText = dataText.join(',');
					// }
					ret.push(dataText);
				}
				return ret;
			})
			;
		const tableKey = this.CSVTableKeyList;
		const tableArray: Array<Array<string>> = [];
		tableArray.push(tableKey.map(t => t.label));
		for (const ticket of ticketList) {

			// tableArray.push(tableKey.map(t=>ticket[t.key]||''));

			tableArray.push(ticket);

		}
		return tableArray;
	}
	private setGoodTableData() {
		this.tableData = this.getTicketList()
			.filter(t => {
				const data = t.getNativeData();
				return this.TableKeyList.every(tableKeyObj => {
					if (tableKeyObj.valid) {
						return tableKeyObj.valid(data[tableKeyObj.key], data);
					}
					return true;
				});
			})
			.map(t => {
				const data = t.getNativeData();
				const ret: { [key: string]: string } = {
					rangeKey: data.rangeKey,
					partitionKey: data.partitionKey,
					isChange: ""
				};
				const nativeData: any = null;
				const tableKeyList = this.TableKeyList;
				for (let i = 0; i < tableKeyList.length; i++) {
					const tableKeyObj = tableKeyList[i];
					let dataText: any = TicketGroup.noneSt;
					if (tableKeyObj.valueMapper) {
						dataText = tableKeyObj.valueMapper(data[tableKeyObj.key], data) || TicketGroup.noneSt;
					} else if (tableKeyObj.key in data) {
						dataText = data[tableKeyObj.key] || TicketGroup.noneSt;
					}
					if (tableKeyObj.valueGetter) {
						dataText = tableKeyObj.valueGetter(dataText, data);
					}
					// if (Array.isArray(dataText)) {
					// 	dataText = dataText.join(',');
					// }
					ret[i] = dataText;
				}
				return ret;
			});
	}
	get GoodTableData() {
		return this.getTicketList()
			.filter(t => {
				const data = t.getNativeData();
				return this.TableKeyList.every(tableKeyObj => {
					if (tableKeyObj.valid) {
						return tableKeyObj.valid(data[tableKeyObj.key], data);
					}
					return true;
				});
			})
			.map(t => {
				const data = t.getNativeData();
				const ret: { [key: string]: string } = {
					rangeKey: data.rangeKey,
					partitionKey: data.partitionKey,
					isChange: ""
				};
				const nativeData: any = null;
				const tableKeyList = this.TableKeyList;
				for (let i = 0; i < tableKeyList.length; i++) {
					const tableKeyObj = tableKeyList[i];
					let dataText: any = TicketGroup.noneSt;
					if (tableKeyObj.valueMapper) {
						dataText = tableKeyObj.valueMapper(data[tableKeyObj.key], data) || TicketGroup.noneSt;
					} else if (tableKeyObj.key in data) {
						dataText = data[tableKeyObj.key] || TicketGroup.noneSt;
					}
					if (tableKeyObj.valueGetter) {
						dataText = tableKeyObj.valueGetter(dataText, data);
					}
					// if (Array.isArray(dataText)) {
					// 	dataText = dataText.join(',');
					// }
					ret[i] = dataText;
				}
				return ret;
			});
	}
	public setTableData() {
		this.setGoodTableData();
	}
	private setNomalTableData() {
		this.tableData = this.getTicketList()
			.filter(t => {
				const data = t.getNativeData();
				return this.TableKeyList.every(tableKeyObj => {
					if (tableKeyObj.valid) {
						return tableKeyObj.valid(data[tableKeyObj.key], data);
					}
					return true;
				});
			})
			.map(t => {
				const data = t.getNativeData();
				const ret: Array<any> = [];
				const nativeData: any = null;
				const tableKeyList = this.TableKeyList;
				for (let i = 0; i < tableKeyList.length; i++) {
					const tableKeyObj = tableKeyList[i];
					let dataText: any = TicketGroup.noneSt;
					if (tableKeyObj.valueMapper) {
						dataText = tableKeyObj.valueMapper(data[tableKeyObj.key], data) || TicketGroup.noneSt;
					} else if (tableKeyObj.key in data) {
						dataText = data[tableKeyObj.key] || TicketGroup.noneSt;
					}
					if (tableKeyObj.valueGetter) {
						dataText = tableKeyObj.valueGetter(dataText, data);
					}
					// if (Array.isArray(dataText)) {
					// 	dataText = dataText.join(',');
					// }
					ret.push(dataText);
				}
				return ret;
			});
	}

	// public getLabel(key: string) {
	// 	for (const table of this.tableKeyList) {
	// 		if (key === table.key) {
	// 			return table.label;
	// 		}
	// 	}
	// 	return '-';
	// }
	public getTicketList() {
		return this.ticketList;
	}
}
export class Ticket {
	private rangeKey: number = 0;
	private partitionKey: string = "";
	public data: TicketData = {};
	private mappingData: TicketData = {};
	public isChange: boolean = false;
	public getNativeData() {
		return this.data;
	}

	constructor(data: TicketData, private tableKeyList: TableKeyList) {
		Object.assign(this.data, this.FixTicket(data));
		this.partitionKey = data.partitionKey;
		this.rangeKey = data.rangeKey;
		this.mapping();
	}
	public resetMap() {
		for (const [key, value] of Object.entries(this.mappingData)) {
			delete this.mappingData[key];
		}
	}
	public mapping() {
		Object.assign(this.mappingData, this.data);
		for (const keyObj of this.tableKeyList) {
			if (keyObj.valueMapper) {
				this.mappingData[keyObj.key] = keyObj.valueMapper(this.mappingData[keyObj.key], this.mappingData);
			}
		}
	}
	get ID() {
		return { rangeKey: this.rangeKey, partitionKey: this.partitionKey }
	}

	public getData(): { [key: string]: any } {
		const ret: { [key: string]: any } = Object.assign({}, this.mappingData);
		for (const keyObj of this.tableKeyList) {
			if (keyObj.valueGetter) {
				ret[keyObj.key] = keyObj.valueGetter(this.mappingData[keyObj.key], this.mappingData);
			} else {
			}
		}
		return ret;
	}
	get Data(): { [key: string]: any } {
		return this.getData();
	}
	// public setTicketLabelMapper(ticketLabelMapper: { [key: string]: string }) {
	// 	this.ticketLabelMapper = ticketLabelMapper;
	// }
	private FixTicket(ticket: TicketData) {
		const safeList = ['partitionKey', 'rangeKey'];
		for (const key in ticket) {
			if (safeList.indexOf(key) !== -1) {
				continue;
			}
			if (key.match(/([A-Z])/g) === undefined) {
				continue;
			}
			const fixKey = key
				.replace(/([A-Z])/g, a => `_${a.toLowerCase()}`)
				.replace(/^_/, '')
				.replace('end_date', 'end_time')
				.replace('start_date', 'start_time');
			const tempValue = ticket[key];
			delete ticket[key];
			ticket[fixKey] = tempValue;
		}
		return ticket;
	}
}
async function csvStringByArray(csvArray: Array<Array<string>>): Promise<string> {
	return await new Promise(r => {
		csvPtringify(csvArray, { quoted: true }, (err, records) => {
			r(records || '');
		});
	});
}
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
@Component({ components: { TicketComparisonComp } })
export default class TicketCompParent extends Vue {
	protected noneString = '';
	public isSearch = false;
	public isSearching = false;
	protected tableKeyList: TableKeyList = [
		{
			key: 'assignee',
			label: '対応者',
			valueMapper: (value: string, ticket: TicketData) => value,
		},
	];
	public comparison: boolean = false;

	public tableList1: Array<TicketComparison.Table> = [];
	public tableList2: Array<TicketComparison.Table> = [];
	public tableList3: Array<TicketComparison.Table> = [];
	protected activeName = 'grafh';
	protected ajax: Ajax = new Ajax();
	protected conditionList: Array<Condition> = [
		{
			label: 'ステータス',

			checkList: [
				{ value: new Set([{ key: 'status', value: 'open' }]), label: '離脱', flg: true },
				{ value: new Set([{ key: 'status', value: 'escalated' }]), label: '直通', flg: true },
				// { value: new Set([{ key: 'status', value: 'resolved' }]), label: '解決', flg: true },
				// { value: new Set([{ key: 'status', value: 'unresolved' }]), label: '未解決', flg: true },
				{ value: new Set([{ key: 'status', value: 'searchNoScript' }]), label: '未収録', flg: true },
				{ value: new Set([{ key: 'status', value: 'searchFailed' }]), label: '検索失敗', flg: true },
				{ value: new Set([{ key: 'status', value: 're-search' }]), label: '再検索', flg: true },
				{ value: new Set([{ key: 'status', value: 'unsupported' }]), label: '未対応', flg: true },
				{ value: new Set([{ key: 'status', value: 'quit' }]), label: '未完了', flg: true },
			],
		},
	];

	public selectAllStatus(condition: Condition) {
		for (const check of condition.checkList) {
			check.flg = true;
		}
	}

	public unselectAllStatus(condition: Condition) {
		for (const check of condition.checkList) {
			check.flg = false;
		}
	}
	get ComparisonTicketList() {
		if (this.comparison) {
			return this.ticketGroupC.TicketList;
		}
		return null;
	}
	public ticketGroup = new TicketGroup(this.tableKeyList);
	public ticketGroupC = new TicketGroup(this.tableKeyList);
	protected listLoading = false;
	protected startdateC: Date = this.$moment()
		.subtract(2, 'month')
		.toDate();

	protected enddateC: Date = this.$moment()
		.subtract(1, 'month')
		.toDate();
	protected startdate: Date = this.$moment()
		.subtract(1, 'month')
		.toDate();

	protected enddate: Date = this.$moment().toDate();
	public created() {
		AdminUserModule.getAdminUserList();
	}

	public async search() {
		this.isSearching = true;
		this.isSearch = true;
		await this.getTicket();
		this.isSearching = false;
	}

	public defaultSearchFilter(ticket: Ticket, isComp = false): boolean {
		const data = ticket.getNativeData();
		const start = String(data.start_date || data.start_time || data.rangeKey);
		const startdate = isComp ? this.startdateC : this.startdate;
		const enddate = isComp ? this.enddateC : this.enddate;
		if (typeof start === 'string' && parseInt(start, 10) < startdate.getTime()) {
			return false;
		}
		const EndDate = this.$moment(enddate)
			.add(1, 'day')
			.toDate();
		if (typeof start === 'string' && parseInt(start, 10) > EndDate.getTime()) {
			return false;
		}
		for (const condition of this.conditionList) {
			if (condition.checkList.every(c => c.flg === false)) {
				// 項目自体がない場合でもすべてチェックしていないなら出す。
				continue;
			}

			for (const check of condition.checkList) {
				if (
					check.flg === false &&
					[...check.value].every(_v => {
						const vSet:Set<{key:string,value?:string,is?:boolean}> = new Set()
						if('key' in _v){
							vSet.add(_v)
						}else{
							for(const __v of _v){
								vSet.add(__v)
							}
						}
						//or部分の判定
						for(const v of vSet){
							const ticketItem = condition.mapper ? condition.mapper(data) : data[v.key];
							const isNone = v.is === false;
							if (!v.hasOwnProperty('value')) {
								if(isNone !== data.hasOwnProperty(v.key)){
									return true;
								}
							} else {

								if (Array.isArray(ticketItem)) {
									if(isNone !== (ticketItem.indexOf(v.value) !== -1)){
										return true;
									}
								}
								if(isNone !== (ticketItem === v.value)){
									return true;
								}
							}
						}
					})
				) {
					return false;
				}
			}

			if (
				condition.checkList.every(
					c =>
						![...c.value].every(_v => {
							const vSet:Set<{key:string,value?:string,is?:boolean}> = new Set()
							if('key' in _v){
								vSet.add(_v)
							}else{
								for(const __v of _v){
									vSet.add(__v)
								}
							}
							//or部分の判定
							for(const v of vSet){
								const ticketItem = condition.mapper ? condition.mapper(data) : data[v.key];
								const isNone = v.is === false;
								if (!v.hasOwnProperty('value')) {
									if(isNone !== data.hasOwnProperty(v.key)){
										return true;
									}
								} else {
									if (Array.isArray(ticketItem)) {
										if(ticketItem.indexOf(v.value) !== -1){
											return true;
										}
									}
									if(ticketItem === v.value){
										return true;
									}
								}
							}
						}),
				)
			) {
				// 項目にチェックが有る場合、項目にない場合は
				// if (condition.checkList.every(c => c.flg === false)) {
				// 	// 項目がない場合でもすべてチェックしていないなら出す。
				// 	continue;
				// }
				return false;
			}
		}



		return true;
	}

	public optionSearchFilter(ticket: Ticket, isComp = false): boolean {
		return true;
	}

	public async csv(filename?: string) {
		const csvDataList: Array<{ fileName: string; data: string }> = [];
		// const tableKeyList = this.ticketGroup.CSVTableKeyList;//.filter(t=>!t.displayType||t.displayType==='text');
		const faqTable = new TicketComparison.Table(this.getTitleTableConfList('log_faq_title')[0], this.tableHeaderList, this.ticketGroup.TicketList);
		const parentTable = new TicketComparison.Table(this.getTitleTableConfList('log_faq_parent_category')[0], this.tableHeaderList, this.ticketGroup.TicketList);
		const childTable = new TicketComparison.Table(this.getTitleTableConfList('log_faq_child_category')[0], this.tableHeaderList, this.ticketGroup.TicketList);
		const tableDataList = [
			{ data: this.ticketGroup.CSVTableDate, fileName: "01_rawdata" },
			{ data: parentTable.CSVTableDate, fileName: "02_parent_category" },
			{ data: childTable.CSVTableDate, fileName: "03_child_category" },
			{ data: faqTable.CSVTableDate, fileName: "04_question" },
			{ data: this.tableList2.map(t => t.CSVTableDate).reduce((a, b) => a.concat(b)), fileName: "05_status" },
			{ data: this.tableList3.map(t => t.CSVTableDate).reduce((a, b) => a.concat(b)), fileName: "06_feedback" },
		];
		for (const { data, fileName } of tableDataList) {
			const csvSt = await csvStringByArray(data);
			csvDataList.push({ data: csvSt, fileName });
		}
		const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
		// zip圧縮 + Download
		const zip = new jszip();
		const currDate = new Date();
		const dateWithOffset = new Date(currDate.getTime() - currDate.getTimezoneOffset() * 60000);
		for (const csvData of csvDataList) {
			const blob = new Blob([bom, csvData.data], { type: 'text/csv' });
			zip.file(`${csvData.fileName}.csv`, blob, { date: dateWithOffset });
		}
		zip.generateAsync({ type: "blob" }).then((content) => {
			this.saveAs(content, `利用履歴_${this.$moment().format("YYMMDD_HHmm")}.zip`);
		});
	}
	private saveAs(content: any, fileName: string) {
		const elm = document.createElement("a");
		const url = URL.createObjectURL(content);
		elm.href = url;
		elm.setAttribute("download", fileName);
		document.body.appendChild(elm);
		elm.click();
	}
	public async getTicket() {
		const startDate = this.comparison?this.startdate < this.startdateC ? this.startdate : this.startdateC:this.startdate;
		const endDate = this.comparison?this.enddate > this.enddateC ? this.enddate : this.enddateC:this.enddate;
		const startDateMoment = this.$moment(startDate); // .subtract(1, 'months');
		const st = startDateMoment.format('YYYY-MM');
		const endDateMoment = this.$moment(endDate).add(1, 'month');
		const en = endDateMoment.format('YYYY-MM');
		const filter = (ticket: Ticket): boolean => {
			const defaultFlg = this.defaultSearchFilter(ticket);
			const optionFlg = this.optionSearchFilter(ticket);
			if (!defaultFlg) {
				return false;
			}
			if (!optionFlg) {
				return false;
			}
			return true;
		};
		const cfilter = (ticket: Ticket): boolean => {
			const defaultFlg = this.defaultSearchFilter(ticket, true);
			const optionFlg = this.optionSearchFilter(ticket, true);
			if (!defaultFlg) {
				return false;
			}
			if (!optionFlg) {
				return false;
			}
			return true;
		};
		const data: any = await this.ajax.http({
			baseURL: subsystemUrl,
			url: `product/${CLIENT_ID}/data_get`,
			method: 'get',
			params: { type: 'ticket', en, st },
		});
		if (Array.isArray(data.message)) {
			this.ticketGroup.setTicketList(data.message, filter);
			this.ticketGroup.setTableData();
			this.ticketGroup.setKeyData();
			// this.ticketList=ticketGroup.getTicketList();
		}
		if (Array.isArray(data.message)) {
			this.ticketGroupC.setTicketList(data.message, cfilter);
			this.ticketGroupC.setTableData();
			this.ticketGroupC.setKeyData();
			// this.ticketList=ticketGroup.getTicketList();
		}
	}
	@Prop({ default: "" })
	private discription?: string;

	syukeiShow: boolean = true;
	currentTarget: string = 'log_faq_title';
	@Watch('currentTarget')
	public async changeTarget() {
		this.syukeiShow = false;
		await Wait(200);
		this.syukeiShow = true;
	}
	targetoptions = [
		{
			value: 'log_faq_title',
			text: "FAQ"
		},
		{
			value: 'log_faq_parent_category',
			text: "親カテゴリ"
		},
		{
			value: 'log_faq_child_category',
			text: "子カテゴリ"
		}
	];
	tableHeaderList2: Array<TicketComparison.TableHeader> = [
		{
			title: "フィードバック結果",
			key: "status",
			getData: (row) => {
				return row.label;
			}
		},
		{
			title: "件数",
			key: "size",
			getData: (row) => {
				return row.tickets()?.length || 0;
			}
		},
		{
			title: "全体を占める割合",
			key: "parcentAll",
			getData: (row, ticket) => {
				const entity = "%";
				let parcent = 0;
				if (ticket == undefined) {
					return `${parcent}${entity}`;
				}
				parcent = Math.round(((row.tickets()?.length || 0) / ticket.length) * 100);
				return `${parcent}${entity}`;
			}
		},
		{
			title: "増減率",
			key: "parcentRelative",
			getData: (row) => {
				const entity = "%";
				let parcent = 0;
				if (!row.comparisonTickets()?.length) {
					return `-`;
				}
				parcent = Math.round((((row.tickets()?.length || 0) - (row.comparisonTickets()?.length || 0)) / (row.comparisonTickets()?.length || 1)) * 100);
				return `${parcent}${entity}`;
			}
		},
	];
	tableHeaderList: Array<TicketComparison.TableHeader> = [
		{
			title: "タイトル",
			key: "status",
			getData: (row) => {
				return row.label;
			}
		},
		{
			title: "閲覧件数",
			key: "size",
			type: "number",
			thClass: "ticketTable__firestHeader",
			formatFn: (value: any) => {
				let sub = '';
				if (value.com == null) {

				}
				else if (value.com > 0) {
					sub = `<span class="sub sub--plus">(+${value.com || ''})</span>`;
				} else if (value.com < 0) {
					sub = `<span class="sub sub--minus">(${value.com || ''})</span>`;
				}
				return `${value.ticket}${sub}`;
			},
			sortFn: (row1, row2) => {
				return row1.ticket - row2.ticket;
			},
			getData: (row) => {

				return { ticket: row.tickets()?.length || 0, com: row.comparisonTickets() ? (row.tickets()?.length || 0) - (row.comparisonTickets()?.length || 0) : null };
			}
		},
		{
			title: "全体に占める割合",
			key: "parcentAll",
			type: "number",
			thClass: "ticketTable__firestHeader",
			formatFn: (value) => {
				return `${value}%`;
			},
			getData: (row, tickets) => {
				let parcent = 0;
				if (tickets == undefined) {
					return parcent;
				}
				parcent = Math.round(((row.tickets()?.length || 0) / tickets.length) * 100);
				return parcent;
			}
		},
		{
			title: "増減率",
			key: "parcentRelative",
			thClass: "ticketTable__firestHeader",
			formatFn: (value) => {
				if (value === '-') {
					return value;
				}
				return `${value}%`;
			},
			getData: (row) => {
				let parcent = 0;
				if (!row.comparisonTickets()?.length) {
					return `-`;
				}
				parcent = Math.round((((row.tickets()?.length || 0) - (row.comparisonTickets()?.length || 0)) / (row.comparisonTickets()?.length || 1)) * 100);
				return parcent;
			}
		},
		{
			title: "解決数",
			key: "donesize",
			type: "number",
			thClass: "ticketTable__secondHeader",
			formatFn: (value: any) => {
				let sub = '';
				if (value.com == null) {

				}
				else if (value.com > 0) {
					sub = `<span class="sub sub--plus">(+${value.com || ''})</span>`;
				} else if (value.com < 0) {
					sub = `<span class="sub sub--minus">(${value.com || ''})</span>`;
				}
				return `${value.ticket}${sub}`;
			},
			getData: (row) => {
				const tickets = row.tickets()?.filter(t => t.getNativeData().feedback === "resolved");
				const comparisonTickets = row.comparisonTickets()?.filter(t => t.getNativeData().feedback === "resolved");
				return { ticket: tickets.length || 0, com: comparisonTickets ? (tickets?.length || 0) - (comparisonTickets?.length || 0) : null };
			}
		},
		{
			title: "解決率",
			key: "parcentDone",
			type: "text",
			thClass: "ticketTable__secondHeader",
			formatFn: (value) => {
				if (value === '-') {
					return value;
				}
				return `${value}%`;
			},
			getData: (row) => {
				const doneTickets = row.tickets()?.filter(t => t.getNativeData().feedback === "resolved");
				const tickets = row.tickets();
				return `${tickets?.length ? Math.round((doneTickets.length / tickets.length) * 100) : '-'}`;
			}
		},
		{
			title: "増減率",
			key: "parcentSizeDone",
			type: "text",
			thClass: "ticketTable__secondHeader",
			formatFn: (value) => {
				if (value === '-') {
					return value;
				}
				return `${value}%`;
			},
			getData: (row) => {
				const doneTickets = row.tickets()?.filter(t => t.getNativeData().feedback === "resolved");
				const comparisonDoneTickets = row.comparisonTickets()?.filter(t => t.getNativeData().feedback === "resolved");
				const tickets = row.tickets();
				const comparisonTickets = row.comparisonTickets();
				if (comparisonTickets == null || comparisonDoneTickets == null || comparisonDoneTickets.length <= 0 || tickets.length <= 0) {
					return '-';
				}
				return `${tickets?.length ? Math.round(((doneTickets.length / tickets.length) - (comparisonDoneTickets.length / comparisonTickets.length)) * 100) : '-'}`;
			}
		},
		{
			title: "未解決数",
			key: "unDonesize",
			type: "number",
			thClass: "ticketTable__thardHeader",
			formatFn: (value: any) => {
				let sub = '';
				if (value.com == null) {

				}
				else if (value.com > 0) {
					sub = `<span class="sub sub--plus">(+${value.com || ''})</span>`;
				} else if (value.com < 0) {
					sub = `<span class="sub sub--minus">(${value.com || ''})</span>`;
				}
				return `${value.ticket}${sub}`;
			},
			getData: (row) => {
				const tickets = row.tickets()?.filter(t => t.getNativeData().feedback === "unresolved");
				const comparisonTickets = row.comparisonTickets()?.filter(t => t.getNativeData().feedback === "unresolved");
				return { ticket: tickets.length || 0, com: comparisonTickets ? (tickets?.length || 0) - (comparisonTickets?.length || 0) : null };
			}
		},
		{
			title: "未解決率",
			key: "parcentUnDone",
			type: "text",
			thClass: "ticketTable__thardHeader",
			formatFn: (value) => {
				if (value === '-') {
					return value;
				}
				return `${value}%`;
			},
			getData: (row) => {
				const doneTickets = row.tickets()?.filter(t => t.getNativeData().feedback === "unresolved");
				const tickets = row.tickets();
				return `${tickets?.length ? Math.round((doneTickets.length / tickets.length) * 100) : '-'}`;
			}
		},
		{
			title: "増減率",
			key: "parcentSizeUnDone",
			type: "text",
			thClass: "ticketTable__thardHeader",
			formatFn: (value) => {
				if (value === '-') {
					return value;
				}
				return `${value}%`;
			},
			getData: (row) => {
				const doneTickets = row.tickets()?.filter(t => t.getNativeData().feedback === "unresolved");
				const comparisonDoneTickets = row.comparisonTickets()?.filter(t => t.getNativeData().feedback === "unresolved");
				const tickets = row.tickets();
				const comparisonTickets = row.comparisonTickets();
				if (comparisonTickets == null || comparisonDoneTickets == null || comparisonDoneTickets.length <= 0 || tickets.length <= 0) {
					return '-';
				}
				return `${tickets?.length ? Math.round(((doneTickets.length / tickets.length) - (comparisonDoneTickets.length / comparisonTickets.length)) * 100) : '-'}`;
			}
		},
	];
	getTitleTableConfList(currentTarget: string): Array<Array<TicketComparison.TableRowConfData>> {
		const obj: { [key: string]: TicketComparison.TableRowConfData } = {};
		for (const ticket of this.ticketGroup.TicketList) {
			const nativeData = ticket.getNativeData();
			const title = nativeData[currentTarget];
			if (Array.isArray(title)) {
				obj[title[0]] = { label: `${title[0] || ''}`, condition: new Set([{ key: currentTarget, value: [title[0]] }]) };
			}
		}
		return [Object.values(obj)];
	}
	get TitleTableConfList(): Array<Array<TicketComparison.TableRowConfData>> {
		return this.getTitleTableConfList(this.currentTarget);
	}
	tableConfList1: Array<Array<TicketComparison.TableRowConfData>> = [
		[
			{
				label: "回答済み",
				condition: new Set([{ key: "status", value: "answered" }])
			}
			,
			{
				label: "回答閲覧中",
				condition: new Set([{ key: "status", value: "answering" }])
			}
			,
			{
				label: "検索失敗",
				condition: new Set([{ key: "status", value: "searchFailed" }])
			}
			,
			{
				label: "未収録",
				condition: new Set([{ key: "status", value: "searchNoScript" }])
			}
			,
			{
				label: "未完了",
				condition: new Set([{ key: "status", value: "quit" }])
			}
			,
			{
				label: "再検索",
				condition: new Set([{ key: "status", value: "re-search" }])
			}
			,
			{
				label: "離脱",
				condition: new Set([{ key: "status", value: "open" }])
			}
			,
		]
	];
	tableConfList2: Array<Array<TicketComparison.TableRowConfData>> = [
		[
			{
				label: "解決",
				condition: new Set([{ key: "feedback", value: "resolved" }])
			}
			,
			{
				label: "未解決",
				condition: new Set([{ key: "feedback", value: "unresolved" }])
			}
			,
			{
				label: "なし",
				condition: new Set([{ key: "feedback", value: "none" }, { key: "feedback", isNone: true }])
			}
			,
		]
	];
	get TicketListTable2() {
		return this.ticketGroup.TicketList.filter(t => (t.data.status === "answered"));
	}
}
