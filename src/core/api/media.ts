import { AjaxService } from "@/services/ajax";
import { IKeywordData } from "./types";

export namespace Media{
	const URL = "media/";
	export const get = ()=>{};
	export const getList = async()=>{
		const { data }: any = await AjaxService.getInstance().http({
			url: `${URL}`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};
	export const post = async (file:File)=>{
		const { data }: any = await AjaxService.getInstance().http({
			url: `${URL}`,
			method: "post",
			data: { upload_file:file },
		});
		console.log(data);
		return data;
	};
	export const patch = async(id:number,input:any)=>{
		const { data }: any = await AjaxService.getInstance().http({
			url:  `${URL}/${id}/`,
			method: "patch",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const deleteObject = async (id:number)=>{
		const { data }: any = await AjaxService.getInstance().http({
			url: `${URL}/${id}/`,
			method: "post",
			data: {},
		});
		console.log(data);
		return data;
	};
}
