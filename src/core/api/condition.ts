import { AjaxService } from "@/services/ajax";
import {IConditionData, IQuestionData} from "@/api/types";
export namespace Condition{
	const URL = "condition/";
	export const getList = async ()=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};
	export const post = async(input:IConditionData)=>{
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

