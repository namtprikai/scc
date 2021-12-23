import { Component, Vue, Watch, Prop,PropSync } from 'vue-property-decorator';
import Pie from '@/components/Charts/Pie.vue';
import Bar from '@/components/Charts/Bar.vue';
import Pareto from '@/components/Charts/Pareto.vue';
import _ from 'lodash';
import { duration } from 'moment';
import { moment } from '@/init/moment';

import { Saiko } from '@/utils/saiko/index';
// import { TicketModule, ticketMapper, Ticket, FaqTicket } from "@/store/modules/ticket";
import TicketCompParent, { Ticket, TicketData, TicketGroup, Condition, KeyData } from '@/views/ticketTable';
export namespace TicketComparison{
	export interface TableConf {
		headers:Array<TableHeader>;
		rows:Array<TableRowConf>;
	}
	export interface TableHeader{
		title:string;
		key:string;
		target?:Set<"csv"|"view">;
		type?:string;
		formatFn?(value:string|number):string;
		sortFn?(x:any,y:any):number;
		thClass?:string;
			// csv独自の表示形式があればこのメソッドを使う
		csvValueGetter?: (key: any, ticket: any) => string;
		getData(row:TableRowConf,tickets?:Array<Ticket>,comparisonTickets?:Array<Ticket>):string|number|Object;
	}
	export interface TableRowConfData{
		label:string;
		condition:Condition;
	}
	export interface TableRowConf{
		label:string;
		tickets():Array<Ticket>;
		comparisonTickets():Array<Ticket>|null;
	}
	type Condition=Set<{key:string,value?:string|Array<string>,isNone?:boolean}>;
	export class Table{
		rowMapper:{[key:string]:string}={};
		headers:Array<TableHeader>=[
			{
				title:"ステータス",
				key:"status",
				getData:(row)=>{
					return row.label;
				}
			},
			{
				title:"件数",
				key:"size",
				getData:(row)=>{
					return row.tickets()?.length||0;
				}
			},
			{
				title:"全体を占める割合",
				key:"parcentAll",
				getData:(row)=>{
					const entity = "%";
					let parcent = 0;
					if(this.tickets==undefined){
						return `${parcent}${entity}`;
					}
					parcent = Math.round(((row.tickets()?.length||0)/this.tickets.length)*100);
					return `${parcent}${entity}`;
				}
			},
			{
				title:"増減率",
				key:"parcentRelative",
				getData:(row)=>{
					const entity = "%";
					let parcent = 0;
					if(!row.comparisonTickets()?.length){
						return `-`;
					}
					parcent = Math.round((((row.tickets()?.length||0)-(row.comparisonTickets()?.length||0))/(row.comparisonTickets()?.length||1))*100);
					return `${parcent}${entity}`;
				}
			},
		];
		private getHeaderByKey(key:string){
			for(const header of this.headers){
				if(header.key===key){
					return header;
				}
			}
			return null;
		}
		private getTicketsFromCondition(condition:Condition):Array<Ticket>{
			return this.tickets.filter(t=>{
				for(const [value] of condition.entries()){
					const isNone = value.isNone === true;
					if(value.value==undefined){
						if((!!t.getNativeData()[value.key])!==isNone){
							return true;
						}
					}
					else if(!Array.isArray(value.value)&&(!!(t.getNativeData()[value.key] === value.value))!==isNone){
						return true;
					}else if(Array.isArray(value.value)&&Array.isArray(t.getNativeData()[value.key])){
						if(value.value.every(v=>t.getNativeData()[value.key].indexOf(v)!==-1)!==isNone){
							return true;
						};
					}
				}
				return false;
			});
		}
		private getComparisonTicketsFromCondition(condition:Condition):Array<Ticket>|null{
			return this.comparisonTickets?.filter(t=>{
				for(const [value] of condition.entries()){
					const isNone = value.isNone === true;
					if(value.value==undefined){
						if((!!t.getNativeData()[value.key])!==isNone){
							return true;
						}
					}
					else if(!Array.isArray(value.value)&&(!!(t.getNativeData()[value.key] === value.value))!==isNone){
						return true;
					}else if(Array.isArray(value.value)&&Array.isArray(t.getNativeData()[value.key])){
						if(value.value.every(v=>t.getNativeData()[value.key].indexOf(v)!==-1)!==isNone){
							return true;
						};
					}
				}
				return false;
			})||null;
		}
		private rows:Array<TableRowConf>=[
			// {
			// 	label:"回答済み",
			// 	tickets:this.getTicketsFromCondition.bind(this,new Set([{key:"status",value:"ansered"}])),
			// 	comparisonTickets:this.getTicketsFromCondition.bind(this,new Set([{key:"status",value:"ansered"}])),
			// }
		];
		constructor(private rowDatas:Array<TableRowConfData>,headers:Array<TicketComparison.TableHeader>|undefined,private tickets:Array<Ticket>,private comparisonTickets?:Array<Ticket>){
			if(Array.isArray(headers)){
				this.headers = headers;
			}
			this.init();
		}
		private init(){
			this.rows = this.rowDatas.map(row=>{
				return {label:row.label,tickets:this.getTicketsFromCondition.bind(this,row.condition),comparisonTickets:this.getComparisonTicketsFromCondition.bind(this,row.condition)};
			});
		}
		get CSVTableKeyList(){
			return this.headers.filter(t=>t.target===undefined?true:t.target?.has("csv"));
		}
		get CSVTableDate():Array<Array<string>>{
			const ticketList = this.rows
			.map(t => {
				const data = t;
				const ret: {[key:string]:string} = {};
				const nativeData: any = null;
				const tableKeyList = this.CSVTableKeyList;
				for (let i = 0; i < tableKeyList.length; i++) {
					const tableKeyObj = tableKeyList[i];
					let dataText: any = TicketGroup.noneSt;
					dataText = tableKeyObj.getData(data,this.tickets,this.comparisonTickets) || TicketGroup.noneSt;
					if (tableKeyObj.csvValueGetter) {
						dataText = tableKeyObj.csvValueGetter(dataText, data);
					}else if (tableKeyObj.formatFn) {
						dataText = tableKeyObj.formatFn(dataText);
					}
					// if (Array.isArray(dataText)) {
					// 	dataText = dataText.join(',');
					// }
					ret[tableKeyObj.key]=dataText;
				}
				return ret;
			});
			const tableKey = this.CSVTableKeyList;
			const tableArray:Array<Array<string>> =[];
			tableArray.push(tableKey.map(t=>t.title));
			for(const ticket of ticketList){
				tableArray.push(tableKey.map(t=>ticket[t.key]||''));
			}
			return tableArray;
		}
		get Rows(){
			return this.rows;
		}
		get GoodTableColumns(){
			return this.headers.map(h=>{
				const ret = {};
				Object.assign(ret,{label:h.title,field:h.key,type:h.type||'text',thClass:h.thClass||""});
				if(h.formatFn){
					Object.assign(ret,{formatFn:h.formatFn});
				}
				if(h.sortFn){
					Object.assign(ret,{sortFn:h.sortFn});
				}
				return ret;
			});
		}
		get GoodTableRows(){
			return this.rows.map(row=>{
				const obj:{[key:string]:string|number|Object}={};
				for(const header of this.headers){
					obj[header.key] = this.getHeaderByKey(header.key)?.getData(row,this.tickets,this.comparisonTickets)||'';
				}
				return obj;
			});
		}
	}
}

// @ts-ignore
@Component({
	components: {},
	filters: {

	},
})
export default class TicketComparisonParent extends Vue {
	@Prop()
	protected tickets: Array<Ticket> | undefined;
	@Prop()
	protected comparisonTickets: Array<Ticket> | undefined;
	@Watch('tickets')
	public dataSet(tickets: Array<Ticket>) {
		if (Array.isArray(tickets)&&Array.isArray(this.tableConfList)) {
			this.tableList.length=0;
			// console.log(this.tableConfList);
			// debugger;
			for (const rowConf of this.tableConfList) {
				this.tableList.push(new TicketComparison.Table([...rowConf],this.tableHeaderList,tickets,this.comparisonTickets));
			}
		}
	}

	public async mounted() {
		if(this.tickets){
			this.dataSet(this.tickets);
		}
		// if (Array.isArray(this.tickets)) {
		// 	this.dataMaintain(this.tickets);
		// }
	}
	@Prop()
	protected tableHeaderList: Array<TicketComparison.TableHeader>|undefined;
	@Prop()
	protected tableConfList!: Array<Array<TicketComparison.TableRowConfData>>;
	@PropSync('table_list')
	protected tableList!:Array<TicketComparison.Table>;
	protected listLoading = false;
}
