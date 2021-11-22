import { AjaxService } from "@/services/ajax";
import { IPartialPolicyData, IPolicyData } from "./types";

export namespace Policy{
	const URL = "policy/";
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
	export const addPolicy = async (add:Array<number>,remove:Array<number>,policyId:number)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}${policyId}/policy`,
			method: "post",
			data: {
				policy_id:add,
				delete_id:remove,
			},
		});
		console.log(data);
		return data;
	};
	export const post = async (input:IPartialPolicyData)=>{
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
