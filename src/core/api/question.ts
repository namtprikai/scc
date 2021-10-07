import { AjaxService } from "@/services/ajax";
import {IQuestionData} from "@/api/types";
export namespace Question{
	const URL = "api/questions/";
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
	export const post = async(input:IQuestionData)=>{
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
