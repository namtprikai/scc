import request from "@/utils/request";
import { CLIENT_ID, subsystemUrl } from "@consoletype/utils/configration";
import axios from "axios";
import { AjaxService } from "@/services/ajax";
import type { IPartialLogData} from "./types";
export namespace PublicTicket {
	const URL = "log/";
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
	export const getList = async ()=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};
	export const getCategoryByQuestionId = async(questionId:number)=>{
		const { data,is_error,type }: any = await AjaxService.ajax.http({
			url:  `${URL}/{${questionId}}/category/`,
			method: "get",
			params: {},
		});
		return data;
	};
	export const post = async(input:IPartialLogData)=>{
		const { data,is_error,type }: any = await AjaxService.ajax.http({
			url: `${URL}`,
			method: "post",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const patch = async(id:number,input:any)=>{
		const { data }: any = await AjaxService.ajax.http({
			url:  `${URL}/${id}/`,
			method: "patch",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const deleteObject = async (id:number)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}/${id}/`,
			method: "post",
			data: {},
		});
		console.log(data);
		return data;
	};
}
