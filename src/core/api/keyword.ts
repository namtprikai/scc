import { AjaxService } from "@/services/ajax";
import { IKeywordData } from "./types";

namespace Keyword{
	const URL = "api/keyword/";
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
	export const post = async (input:IKeywordData)=>{
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
