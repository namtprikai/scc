import request from "@/utils/request";
import { CLIENT_ID, subsystemUrl } from "@consoletype/utils/configration";
import axios from "axios";

export namespace PublicTicket {
	interface Log {
		start_time: string;
		end_time: string;
		query: string;
		items: any;
	}
	interface TicketID {
		partitionKey: string;
		rangeKey: string;
	}
	interface TicketData {
		partitionKey?: string;
		rangeKey?: string;
		start_time?: string;
		end_time?: string;
		query?: string;
		items?: any;
		[key: string]: string | undefined;
	}
	let ticketID: TicketID | null = null;
	const defaultParam = {};
	let start_time: string | null = null;
	let ticketData: TicketData | null = null;
	export const setStartTime = () => {
		start_time = String(new Date().getTime());
	};
	export const resetStartTime = () => {
		start_time = null;
	};

	export const setDefaultParam = (param: Object) => {
		Object.assign(defaultParam, param || {});
	};
	export const resetTicket = () => {
		ticketID = null;
		ticketData = null;
		resetStartTime();
	};
	export const ticketPost = (log: TicketData, isPost = true): Promise<[boolean, TicketData | null]> => {
		if (start_time === null) {
			setStartTime();
		}
		return new Promise(async (r) => {
			const data: any = { origin: "console", start_time };
			for (const logKey in log) {
				if (logKey === "items") {
					console.log(logKey);
					for (const itemKey in log[logKey]) {
						data[itemKey] = log[logKey][itemKey];
					}
				} else {
					data[logKey] = log[logKey];
				}
			}
			try {
				if (ticketID) {
					// const { partitionKey, rangeKey } = ticketID;
					Object.assign(data, ticketID);
				}
			} catch (e) {
				console.log(e);
			}
			ticketData = data;
			if (isPost) {
				axios({
					url: `${subsystemUrl}/product/${CLIENT_ID}/public-ticket`,
					headers: {},
					method: "post",
					data: {
						values: data,
					},
				})
					.then((res) => {
						console.log(res);
						const { data } = res;
						ticketID = data.putItem;
						r([false, data]);
					})
					.catch(() => {
						r([true, null]);
					});
			} else {
				r([false, data]);
			}
		});
	};
}
