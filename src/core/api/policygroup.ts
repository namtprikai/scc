import { AjaxService } from "@/services/ajax";
import { IPartialPolicyGroupData, IPolicyData, IPolicyGroupData } from "./types";

export namespace PolicyGroup{
	const URL = "policy_group/";
	export const get = ()=>{};
	export const getList = async():Promise<Array<IPolicyGroupData>>=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};
	export const getPolicyByPolicyGroupId = async(policyGroupId:number):Promise<Array<IPolicyData>>=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}${policyGroupId}/policy/`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};
	export const addPolicy = async (add:Array<number>,remove:Array<number>,policyGroupId:number)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}${policyGroupId}/policy/`,
			method: "post",
			data: {
				policy_id:add,
				delete_id:remove,
			},
		});
		console.log(data);
		return data;
	};
	export const post = async (input:IPartialPolicyGroupData)=>{
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
