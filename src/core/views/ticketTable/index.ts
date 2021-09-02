import { v4 } from "uuid";
import { Component, Vue } from "vue-property-decorator";
import { eventHub } from "@/init/eventHub";

import { CLIENT_ID, subsystemUrl } from "@consoletype/utils/configration";
import { Ajax } from "@/utils/parts";
import type {
	KeyData,
	TableKeyList,
	TicketData,
	EnquateTicket,
	Condition,
} from "./index.i";
import { AdminUserModule } from "@/store/modules/adminUser";
export { Condition, TicketData, KeyData, EnquateTicket };
export class TicketGroup {
	public static readonly noneSt = "-";
	private ticketList: Array<Ticket> = [];
	public tableData: Array<Array<string>> = [];
	public keyData: Array<KeyData> = [];
	constructor(private tableKeyList: TableKeyList) {}
	get TableKeyList() {
		return this.tableKeyList;
	}

	public setTicketList(
		ticketDataList: Array<TicketData>,
		filter: (ticket: Ticket) => boolean
	) {
		this.ticketList = [];
		for (const ticketData of ticketDataList) {
			const ticket = new Ticket(ticketData);
			if (filter(ticket)) {
				this.ticketList.push(ticket);
			}
		}
	}

	public setKeyData() {
		this.keyData = this.getTicketList()
			.filter((t) => {
				const data = t.getNativeData();
				return this.tableKeyList.every((tableKeyObj) => {
					if (tableKeyObj.valid) {
						return tableKeyObj.valid(data[tableKeyObj.key], data);
					}
					return true;
				});
			})
			.map((t) => {
				const data = t.getNativeData();
				const ret: KeyData = {};
				let nativeData: any = null;
				for (let i = 0; i < this.tableKeyList.length; i++) {
					const tableKeyObj = this.tableKeyList[i];
					let dataText: any = TicketGroup.noneSt;
					if (tableKeyObj.valueMapper) {
						dataText =
							tableKeyObj.valueMapper(data[tableKeyObj.key], data) ||
							TicketGroup.noneSt;
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

	public setTableData() {
		this.tableData = this.getTicketList()
			.filter((t) => {
				const data = t.getNativeData();
				return this.tableKeyList.every((tableKeyObj) => {
					if (tableKeyObj.valid) {
						return tableKeyObj.valid(data[tableKeyObj.key], data);
					}
					return true;
				});
			})
			.map((t) => {
				const data = t.getNativeData();
				const ret: Array<string> = [];
				const nativeData: any = null;
				for (let i = 0; i < this.tableKeyList.length; i++) {
					const tableKeyObj = this.tableKeyList[i];
					let dataText: any = TicketGroup.noneSt;
					if (tableKeyObj.valueMapper) {
						dataText =
							tableKeyObj.valueMapper(data[tableKeyObj.key], data) ||
							TicketGroup.noneSt;
					} else if (tableKeyObj.key in data) {
						dataText = data[tableKeyObj.key] || TicketGroup.noneSt;
					}
					if (tableKeyObj.valueGetter) {
						dataText = tableKeyObj.valueGetter(dataText, data);
					}
					if (Array.isArray(dataText)) {
						dataText = dataText.join(",");
					}
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
	private data: TicketData = {};
	public getNativeData() {
		return this.data;
	}

	constructor(data: TicketData) {
		this.data = this.FixTicket(data);
	}

	// public setTicketLabelMapper(ticketLabelMapper: { [key: string]: string }) {
	// 	this.ticketLabelMapper = ticketLabelMapper;
	// }
	private FixTicket(ticket: TicketData) {
		const safeList = ["partitionKey", "rangeKey"];
		for (const key in ticket) {
			if (safeList.indexOf(key) !== -1) {
				continue;
			}
			if (key.match(/([A-Z])/g) === undefined) {
				continue;
			}
			const fixKey = key
				.replace(/([A-Z])/g, (a) => `_${a.toLowerCase()}`)
				.replace(/^_/, "")
				.replace("end_date", "end_time")
				.replace("start_date", "start_time");
			const tempValue = ticket[key];
			delete ticket[key];
			ticket[fixKey] = tempValue;
		}
		return ticket;
	}
}

// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// // @ts-ignore
@Component({})
export default class TicketCompParent extends Vue {
	protected noneString = "なし";
	public isSearch = false;
	protected tableKeyList: TableKeyList = [
		{
			key: "assignee",
			label: "対応者",
			valueMapper: (value: string, ticket: TicketData) => value,
		},
	];

	protected activeName = "table";
	protected ajax: Ajax = new Ajax();
	protected conditionList: Array<Condition> = [
		{
			label: "ステータス",
			key: "status",
			checkList: [
				{ value: ["open"], label: "離脱", flg: true },
				{ value: ["escalated"], label: "直通", flg: true },
				{ value: ["resolved"], label: "解決", flg: true },
				{ value: ["unresolved"], label: "未解決", flg: true },
				{ value: ["scriptNotFound"], label: "未収録", flg: true },
				{ value: ["searchFailed"], label: "検索失敗", flg: true },
				{ value: ["re-search"], label: "再検索", flg: true },
				{ value: ["unsupported"], label: "未対応", flg: true },
				{ value: ["quit"], label: "未完了", flg: true },
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

	public ticketGroup = new TicketGroup(this.tableKeyList);
	protected listLoading = false;
	protected startdate = this.$moment().subtract(1, "month").toDate();

	protected enddate = this.$moment().toDate();
	public created() {
		AdminUserModule.getAdminUserList();
	}

	public async search() {
		this.isSearch = true;
		await this.getTicket();
		this.isSearch = false;
	}

	public defaultSearchFilter(ticket: Ticket): boolean {
		const data = ticket.getNativeData();
		const start = String(data.start_date || data.start_time || data.rangeKey);
		console.log(`${parseInt(start, 10)}  ${this.startdate.getTime()}`);
		if (
			typeof start === "string" &&
			parseInt(start, 10) < this.startdate.getTime()
		) {
			return false;
		}
		const EndDate = this.$moment(this.enddate).add(1, "day").toDate();
		if (typeof start === "string" && parseInt(start, 10) > EndDate.getTime()) {
			return false;
		}
		for (const condition of this.conditionList) {
			if (condition.checkList.every((c) => c.flg === false)) {
				// 項目自体がない場合でもすべてチェックしていないなら出す。
				continue;
			}

			for (const check of condition.checkList) {
				if (
					check.flg === false &&
					check.value.find((v) => {
						const ticketItem = condition.mapper
							? condition.mapper(data)
							: data[condition.key];
						if (Array.isArray(ticketItem)) {
							return ticketItem.indexOf(v) !== -1;
						}
						return ticketItem === v;
					})
				) {
					return false;
				}
			}
			if (!(condition.key in data) && !condition.mapper) {
				// if (condition.checkList.every(c => c.flg === false)) {
				// 	// 項目自体がない場合でもすべてチェックしていないなら出す。
				// 	continue;
				// }

				return false;
			}
			if (
				condition.checkList.every(
					(c) =>
						!c.value.find((v) => {
							const ticketItem = condition.mapper
								? condition.mapper(data)
								: data[condition.key];
							if (Array.isArray(ticketItem)) {
								return ticketItem.indexOf(v) !== -1;
							}
							return ticketItem === v;
						})
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

	public optionSearchFilter(ticket: Ticket): boolean {
		return true;
	}

	public async csv() {
		let csvSt = "";
		const tableKeyList = this.ticketGroup.TableKeyList;
		const tableData = this.ticketGroup.tableData;
		if (tableKeyList) {
			csvSt += tableKeyList.map((v) => `"${v.label}"`).join(",") + "\n";

			for (const ticket of tableData) {
				csvSt +=
					tableKeyList
						.map((k, i) => {
							const t = ticket;
							return `"${t[i] || ""}"`;
						})
						.join(",") + "\n";
			}
		}
		const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
		const element = document.createElement("a");
		let blob = new Blob([bom, csvSt], { type: "text/csv" });
		// if(code=="SJIS"){

		blob = new Blob([bom, csvSt], {
			type: "text/csv;charset=shift_jis",
		});

		// }
		const url = URL.createObjectURL(blob);
		element.href = url;
		element.setAttribute("download", "data.csv");
		// element.setAttribute('target', '_blank');
		document.body.appendChild(element); // Append the element to work in firefox
		element.click();
	}

	public async getTicket() {
		const startDateMoment = this.$moment(this.startdate); // .subtract(1, 'months');
		const st = startDateMoment.format("YYYY-MM");
		const endDateMoment = this.$moment(this.enddate).add(1, "month");
		const en = endDateMoment.format("YYYY-MM");
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
		const data: any = await Promise.resolve(); // Ticket.get();
		// 	this.ajax.http({
		// 	baseURL: subsystemUrl,
		// 	url: `product/${CLIENT_ID}/data_get`,
		// 	method: "get",
		// 	params: { type: "ticket", en, st },
		// });
		if (Array.isArray(data.message)) {
			this.ticketGroup.setTicketList(data.message, filter);
			this.ticketGroup.setTableData();
			this.ticketGroup.setKeyData();
			// this.ticketList=ticketGroup.getTicketList();
		}
	}
}
