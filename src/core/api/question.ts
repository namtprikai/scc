import { AjaxService } from "@/services/ajax";
import {IQuestionData} from "@/api/types";
export namespace Question{
	export const getList = async ()=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `questions/`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};
	export const post = async(input:IQuestionData)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `question/`,
			method: "post",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const patch = async(id:number,input:any)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `question/{${id}}/`,
			method: "patch",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const deleteObject = async (id:number)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `question/{${id}}/`,
			method: "post",
			data: {},
		});
		console.log(data);
		return data;
	};
}
