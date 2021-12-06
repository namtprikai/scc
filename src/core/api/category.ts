import { AjaxService } from "@/services/ajax";
import { AxiosResponse } from "axios";
import { ICategoryData, IPartialCategoryData, IRoleData } from './types';

export namespace Category{
	const URL = "category/";
	export const getList = async (parent_id:number|null):Promise<Array<ICategoryData>>=>{
		const { data }: any = await AjaxService.getInstance().http({
			url: `${URL}`,
			method: "get",
			params: {parent_id},
		});
		console.log(data);
		return data;
	};
		export const getRoleListByCategoryId = async (id:number|null):Promise<Array<IRoleData>>=>{
		const { data }: any = await AjaxService.getInstance().http({
			url: `${URL}${id}/role`,
			method: "get",
			params: {},
		});
			console.log(data);
		return data;
	};
	export const getCategory = async (id:number)=>{
		const { data }: any = await AjaxService.getInstance().http({
			url: `${URL}${id}/`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};

	export const post = async(input:IPartialCategoryData)=>{
		const { data }: any = await AjaxService.getInstance().http({
			url: `${URL}`,
			method: "post",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const patch = async(id:number,input:IPartialCategoryData)=>{
		const { data }: any = await AjaxService.getInstance().http({
			url:  `${URL}${id}/`,
			method: "patch",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const deleteObject = async (id:number)=>{
		const { data }: any = await AjaxService.getInstance().http({
			url: `${URL}${id}/`,
			method: "post",
			data: {},
		});
		console.log(data);
		return data;
	};
}
