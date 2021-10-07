import { AjaxService } from "@/services/ajax";
import { IPolicyGroupData } from "./types";

namespace PolycyGroup{
	const URL = "api/policy_group/";
	export const get = ()=>{};
	export const getList = async()=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};
	export const post = async (input:IPolicyGroupData)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}`,
			method: "post",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const patch = async(id:number,input:any)=>{
		const { data }: any = await AjaxService.ajax.http({
			url:  `${URL}/{${id}}/`,
			method: "patch",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const deleteObject = async (id:number)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}/{${id}}/`,
			method: "post",
			data: {},
		});
		console.log(data);
		return data;
	};
}
